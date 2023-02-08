import closest from 'dom-helpers/closest';
import contains from 'dom-helpers/contains';
import listen from 'dom-helpers/listen';
import { MouseEvent, TouchEvent } from 'react';
import { ElementRect, SelectedRect } from 'react-big-calendar';

import { isMouseEvent, isTouchEvent } from '../calendarUtil/selection';

function addEventListener(
  type: keyof HTMLElementEventMap,
  handler: any,
  target: HTMLElement = document.documentElement
) {
  return listen(target, type, handler, { passive: false });
}

function isOverContainer(container: HTMLElement, x: number, y: number) {
  const elementFromPoint = document.elementFromPoint(x, y);
  if (elementFromPoint !== null) {
    return !container || contains(container, elementFromPoint);
  }
  return false;
}

export function getEventNodeFromPoint(
  node: Element,
  { clientX, clientY }: any
) {
  const target = document.elementFromPoint(clientX, clientY);
  if (target !== null) return closest(target, ".rbc-event", node);
  return null;
}

export function isEvent(node: Element, bounds: { x: any; y: number }) {
  return !!getEventNodeFromPoint(node, bounds);
}

function getEventCoordinates(
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
) {
  if (isMouseEvent(event)) {
    const target = event;
    return {
      clientX: target.clientX,
      clientY: target.clientY,
      pageX: target.pageX,
      pageY: target.pageY,
    };
  }

  if (isTouchEvent(event) && event.touches && event.touches.length) {
    const target = event.touches[0];
    return {
      clientX: target.clientX,
      clientY: target.clientY,
      pageX: target.pageX,
      pageY: target.pageY,
    };
  }

  return {
    clientX: -1,
    clientY: -1,
    pageX: -1,
    pageY: -1,
  };
}

const clickTolerance = 5;
const longPressThreshold = 250;

class Selection {
  private container: HTMLElement;
  private longPressThreshold: number;
  //_listenersは抽象関数の二次元配列
  private _listeners: { [key: string]: any };
  private _removeInitialEventListener?: () => void;
  private _removeEndListener?: () => void;
  private _onEscListener?: () => void;
  private _removeMoveListener?: () => void;
  private _initialEventData?: {
    isTouch: boolean;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
  } | null;
  private selecting?: boolean;
  private _selectRect?: SelectedRect;
  private _removeDropFromOutsideListener: any;
  private _removeDragOverFromOutsideListener: any;

  constructor(node: HTMLElement) {
    this.container = node;
    this.longPressThreshold = longPressThreshold;
    this._listeners = Object.create(null);

    this._handleInitialEvent = this._handleInitialEvent.bind(this);
    this._handleMoveEvent = this._handleMoveEvent.bind(this);
    this._handleTerminatingEvent = this._handleTerminatingEvent.bind(this);

    this._dropFromOutsideListener = this._dropFromOutsideListener.bind(this);
    this._dragOverFromOutsideListener = this._dragOverFromOutsideListener.bind(
      this
    );

    //Drop EventListener
    this._removeDropFromOutsideListener = addEventListener(
      "drop",
      this._dropFromOutsideListener
    );
    this._removeDragOverFromOutsideListener = addEventListener(
      "dragover",
      this._dragOverFromOutsideListener
    );

    this._addInitialEventListener();
  }

  teardown() {
    this._listeners = Object.create(null);
    this._removeInitialEventListener && this._removeInitialEventListener();
    this._removeEndListener && this._removeEndListener();
    this._onEscListener && this._onEscListener();
    this._removeMoveListener && this._removeMoveListener();
    this._removeDropFromOutsideListener &&
      this._removeDropFromOutsideListener();
    this._removeDragOverFromOutsideListener &&
      this._removeDragOverFromOutsideListener();
  }

  isSelected(node: HTMLElement | ElementRect) {
    const box = this._selectRect;

    if (!box || !this.selecting) return false;

    return objectsCollide(box, getBoundsForNode(node));
  }

  //関数(handler)を登録
  //handlerも抽象関数なのでanyで定義
  on(type: string, handler: any) {
    const handlers = this._listeners[type] || (this._listeners[type] = []);
    handlers.push(handler);
  }

  //関数(handler)を実行
  //抽象関数のためanyで止まります
  emit(type: string, args?: any) {
    let result: any;
    const handlers = this._listeners[type] || [];
    handlers.forEach((fn: (arg: any) => any) => {
      if (result === undefined) result = fn(args);
    });
    return result;
  }

  //タッチイベントを設定、250ms以内指を動かずにhandlerを追加する
  _addLongPressListener(handler: any, initialEvent: any) {
    let timer: NodeJS.Timeout | null = null;
    let removeTouchMoveListener: { (): void; (): void } | null = null;
    let removeTouchEndListener: { (): void; (): void } | null = null;
    const handleTouchStart = (initialEvent: any) => {
      timer = setTimeout(() => {
        cleanup();
        handler(initialEvent);
      }, this.longPressThreshold);
      removeTouchMoveListener = addEventListener("touchmove", () => cleanup());
      removeTouchEndListener = addEventListener("touchend", () => cleanup());
    };
    const removeTouchStartListener = addEventListener(
      "touchstart",
      handleTouchStart
    );
    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (removeTouchMoveListener) {
        removeTouchMoveListener();
      }
      if (removeTouchEndListener) {
        removeTouchEndListener();
      }

      timer = null;
      removeTouchMoveListener = null;
      removeTouchEndListener = null;
    };

    if (initialEvent) {
      handleTouchStart(initialEvent);
    }

    return () => {
      cleanup();
      removeTouchStartListener();
    };
  }

  //マウスイベントとタッチイベントを初期化する
  _addInitialEventListener() {
    const removeMouseDownListener = addEventListener(
      "mousedown",
      (
        e:
          | MouseEvent<HTMLElement, globalThis.MouseEvent>
          | TouchEvent<HTMLElement>
      ) => {
        this._removeInitialEventListener && this._removeInitialEventListener();
        this._handleInitialEvent(e);
        this._removeInitialEventListener = addEventListener(
          "mousedown",
          this._handleInitialEvent
        );
      }
    );
    const removeTouchStartListener = addEventListener(
      "touchstart",
      (
        e:
          | MouseEvent<HTMLElement, globalThis.MouseEvent>
          | TouchEvent<HTMLElement>
      ) => {
        this._removeInitialEventListener && this._removeInitialEventListener();
        this._removeInitialEventListener = this._addLongPressListener(
          this._handleInitialEvent,
          e
        );
      }
    );

    this._removeInitialEventListener = () => {
      removeMouseDownListener();
      removeTouchStartListener();
    };
  }

  //DomEvent詳細を初期化
  _handleInitialEvent(
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) {
    const { clientX, clientY, pageX, pageY } = getEventCoordinates(e);
    const node = this.container;
    let collides, offsetData;

    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    //マウスイベントの右ボタン無効か
    if (
      (isMouseEvent(e) && e.button === 2) ||
      !isOverContainer(node, clientX, clientY)
    ) {
      return;
    }

    if (node && !contains(node, e.target)) {
      offsetData = getBoundsForNode(node);

      collides = objectsCollide(
        {
          top: offsetData.top,
          left: offsetData.left,
          bottom: offsetData.bottom,
          right: offsetData.right,
        },
        { top: pageY, left: pageX, bottom: NaN, right: NaN }
      );

      if (!collides) return;
    }

    const result = this.emit(
      "beforeSelect",
      (this._initialEventData = {
        isTouch: /^touch/.test(e.type),
        x: pageX,
        y: pageY,
        clientX,
        clientY,
      })
    );

    if (result === false) return;

    switch (e.type) {
      case "mousedown":
        this._removeEndListener = addEventListener(
          "mouseup",
          this._handleTerminatingEvent
        );
        this._removeMoveListener = addEventListener(
          "mousemove",
          this._handleMoveEvent
        );
        break;
      case "touchstart":
        this._handleMoveEvent(e);
        this._removeEndListener = addEventListener(
          "touchend",
          this._handleTerminatingEvent
        );
        this._removeMoveListener = addEventListener(
          "touchmove",
          this._handleMoveEvent
        );
        break;
      default:
        break;
    }
  }

  //中断,実行handler
  _handleTerminatingEvent(
    e:
      | React.MouseEvent<HTMLElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) {
    const { pageX, pageY } = getEventCoordinates(e);

    this.selecting = false;

    this._removeEndListener && this._removeEndListener();
    this._removeMoveListener && this._removeMoveListener();

    if (!this._initialEventData) return;
    if (!(e.target instanceof HTMLElement)) return;

    const inRoot = !this.container || contains(this.container, e.target);
    const bounds = this._selectRect;
    const click = this.isClick(pageX, pageY);

    this._initialEventData = null;

    if (!inRoot) {
      return this.emit("reset");
    }

    if (click && inRoot) {
      return this._handleClickEvent(e);
    }

    //クリック区域を超えた場合はselectとして判定
    if (!click) return this.emit("select", bounds);
  }

  //移動イベントhandler
  _handleMoveEvent(
    e:
      | React.MouseEvent<HTMLElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) {
    if (this._initialEventData === null) return;
    if (!(e.target instanceof HTMLElement)) return;

    const { x, y } = this._initialEventData ?? { x: -1, y: -1 };
    const { pageX, pageY } = getEventCoordinates(e);
    const w = Math.abs(x - pageX);
    const h = Math.abs(y - pageY);
    const left = Math.min(pageX, x);
    const top = Math.min(pageY, y);
    const old = this.selecting;

    // マウス移動してない場合のselectStart発火を防止.
    if (this.isClick(pageX, pageY) && !old && !(w || h)) {
      return;
    }

    this.selecting = true;
    this._selectRect = {
      top,
      left,
      x: pageX,
      y: pageY,
      right: left + w,
      bottom: top + h,
    };

    if (!old) {
      this.emit("selectStart", this._initialEventData);
    }

    if (!this.isClick(pageX, pageY)) {
      this.emit("selecting", this._selectRect);
    }

    e.preventDefault();
  }

  //DropEvent Handler
  _dropFromOutsideListener(
    e:
      | React.MouseEvent<HTMLElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) {
    const { pageX, pageY, clientX, clientY } = getEventCoordinates(e);

    this.emit("dropFromOutside", {
      x: pageX,
      y: pageY,
      clientX: clientX,
      clientY: clientY,
    });

    e.preventDefault();
  }

  _dragOverFromOutsideListener(
    e:
      | React.MouseEvent<HTMLElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) {
    const { pageX, pageY, clientX, clientY } = getEventCoordinates(e);

    this.emit("dragOverFromOutside", {
      x: pageX,
      y: pageY,
      clientX: clientX,
      clientY: clientY,
    });

    e.preventDefault();
  }

  _handleClickEvent(
    e:
      | React.MouseEvent<HTMLElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLElement>
  ) {
    const { pageX, pageY, clientX, clientY } = getEventCoordinates(e);
    return this.emit("click", {
      x: pageX,
      y: pageY,
      clientX: clientX,
      clientY: clientY,
    });
  }

  isClick(pageX: number, pageY: number) {
    const { x, y, isTouch } = this._initialEventData ?? {
      x: -1,
      y: -1,
      isTouch: false,
    };
    return (
      !isTouch &&
      Math.abs(pageX - x) <= clickTolerance &&
      Math.abs(pageY - y) <= clickTolerance
    );
  }
}

/**
 * Given two objects containing "top", "left", "offsetWidth" and "offsetHeight"
 * properties, determine if they collide.
 * @param  {ElementRect|HTMLElement} a
 * @param  {ElementRect|HTMLElement} b
 * @return {bool}
 */
export function objectsCollide(
  nodeA: ElementRect | HTMLElement,
  nodeB: ElementRect | HTMLElement,
  tolerance = 0
) {
  const {
    top: aTop,
    left: aLeft,
    right: aRight = aLeft,
    bottom: aBottom = aTop,
  } = getBoundsForNode(nodeA);
  const {
    top: bTop,
    left: bLeft,
    right: bRight = bLeft,
    bottom: bBottom = bTop,
  } = getBoundsForNode(nodeB);

  return !(
    // 'a' bottom doesn't touch 'b' top
    (
      aBottom - tolerance < bTop ||
      // 'a' top doesn't touch 'b' bottom
      aTop + tolerance > bBottom ||
      // 'a' right doesn't touch 'b' left
      aRight - tolerance < bLeft ||
      // 'a' left doesn't touch 'b' right
      aLeft + tolerance > bRight
    )
  );
}

/**
 * Given a node, get everything needed to calculate its boundaries
 * @param  {HTMLElement| Object} node
 * @return {ElementRect}
 */
export function getBoundsForNode(node: HTMLElement | ElementRect): ElementRect {
  if (node instanceof HTMLElement) {
    const rect = node.getBoundingClientRect(),
      left = rect.left + pageOffset("left"),
      top = rect.top + pageOffset("top");

    return {
      top,
      left,
      right: (node.offsetWidth || 0) + left,
      bottom: (node.offsetHeight || 0) + top,
    };
  } else return node;
}

function pageOffset(dir: "left" | "top") {
  if (dir === "left")
    return window.pageXOffset || document.body.scrollLeft || 0;
  if (dir === "top") return window.pageYOffset || document.body.scrollTop || 0;
  return 0;
}

export default Selection;
