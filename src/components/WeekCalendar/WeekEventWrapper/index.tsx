import clsx from "clsx";
import React, { ReactElement, useContext, isValidElement } from "react";
import { WeekEventWrapperProps, DirectionType } from "react-big-calendar";
import { isTouchEvent } from "../calendarUtil/selection";
import { DnDContext } from "../Context";

export const WeekEventWrapper: React.FC<WeekEventWrapperProps> = (props) => {
  const context = useContext(DnDContext);
  const { event, continuesPrior, continuesAfter, contentsId } = props;
  let { children } = props;
  if (!isValidElement(children)) return <div />;
  if (!context.draggable) return <div>{children}</div>;
  const {
    resizable,
    draggableAccessor,
    resizableAccessor,
    dragAndDropAction,
  } = context.draggable;
  const handleResizeLeft = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTouchEvent(e) && e.button !== 0) return;
    if (context.draggable)
      context.draggable.onBeginAction(event, "resize", contentsId, "LEFT");
  };
  const handleResizeRight = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTouchEvent(e) && e.button !== 0) return;
    if (context.draggable)
      context.draggable.onBeginAction(event, "resize", contentsId, "RIGHT");
  };
  const handleStartDragging = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTouchEvent(e) && e.button !== 0) return;
    if (!(e.target instanceof HTMLElement)) return;
    const isResizeEvent = e.target.className.includes("rbc-addons-dnd-resize");
    if (isResizeEvent) return;
    if (context.draggable)
      context.draggable.onBeginAction(event, "move", contentsId);
  };

  const renderAnchor = (direction: DirectionType) => (
    <div
      className={`rbc-addons-dnd-resize-ew-anchor`}
      onMouseDown={direction === "LEFT" ? handleResizeLeft : handleResizeRight}
    >
      <div className={`rbc-addons-dnd-resize-ew-icon`} />
    </div>
  );

  const isDraggable = draggableAccessor ? draggableAccessor(event) : true;
  const isResizable =
    resizable && (resizableAccessor ? resizableAccessor(event) : true);

  if (event._isPreview) {
    return React.cloneElement(children, {
      className: clsx(children.props.className, "rbc-addons-dnd-drag-preview"),
    });
  }

  if (!isDraggable) return <div>{children}</div>;
  const newProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    className?: string;
    children?: ReactElement;
  } = {
    onMouseDown: handleStartDragging,
    onTouchStart: handleStartDragging,
  };
  if (isResizable || isDraggable) {
    if (isResizable) {
      const StartAnchor = !continuesPrior && renderAnchor("LEFT");
      const EndAnchor = !continuesAfter && renderAnchor("RIGHT");

      newProps.children = (
        <div className={"rbc-addons-dnd-resizable"}>
          {StartAnchor}
          {children.props.children}
          {EndAnchor}
        </div>
      );
    }

    if (dragAndDropAction.interacting && dragAndDropAction.event === event) {
      newProps.className = clsx(
        children.props.className,
        "rbc-addons-dnd-dragged-event"
      );
    }
    children = React.cloneElement(children, newProps);
  }
  return <div>{children}</div>;
};
