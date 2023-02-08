import { ElementRect, SelectedRect } from "react-big-calendar";

export function isTouchEvent(
  e: React.TouchEvent | React.MouseEvent
): e is React.TouchEvent {
  return e && "touches" in e;
}

export function isMouseEvent(
  e: React.TouchEvent | React.MouseEvent
): e is React.MouseEvent {
  return e && "screenX" in e;
}

export function slotWidth(rowBox: ElementRect, slots: number) {
  const rowWidth = rowBox.right - rowBox.left;
  const cellWidth = rowWidth / slots;

  return cellWidth;
}

export function getSlotAtX(rowBox: ElementRect, x: number, slots: number) {
  const cellWidth = slotWidth(rowBox, slots);
  return Math.floor((x - rowBox.left) / cellWidth);
}

export function pointInBox(
  box: ElementRect,
  { x, y }: { x: number; y: number }
) {
  return y >= box.top && y <= box.bottom && x >= box.left && x <= box.right;
}

//選択されたslotsを計算
export function dateCellSelection(
  start: { y?: number; x?: number },
  rowBox: ElementRect,
  box: SelectedRect,
  slots: number
) {
  if (!start.x || !start.y) {
    return { startIdx: -1, endIdx: -1 };
  }
  let startIdx = -1;
  let endIdx = -1;
  const lastSlotIdx = slots - 1;

  const cellWidth = slotWidth(rowBox, slots);

  // cell under the mouse
  const currentSlot = getSlotAtX(rowBox, box.x, slots);

  // Identify row as either the initial row
  // or the row under the current mouse point
  const isCurrentRow = rowBox.top < box.y && rowBox.bottom > box.y;
  const isStartRow = rowBox.top < start.y && rowBox.bottom > start.y;

  // this row's position relative to the start point
  const isAboveStart = start.y > rowBox.bottom;
  const isBelowStart = rowBox.top > start.y;
  const isBetween = box.top < rowBox.top && box.bottom > rowBox.bottom;

  // this row is between the current and start rows, so entirely selected
  if (isBetween) {
    startIdx = 0;
    endIdx = lastSlotIdx;
  }

  if (isCurrentRow) {
    if (isBelowStart) {
      startIdx = 0;
      endIdx = currentSlot;
    } else if (isAboveStart) {
      startIdx = currentSlot;
      endIdx = lastSlotIdx;
    }
  }

  if (isStartRow) {
    // select the cell under the initial point
    startIdx = endIdx = Math.floor((start.x - rowBox.left) / cellWidth);

    if (isCurrentRow) {
      if (currentSlot < startIdx) startIdx = currentSlot;
      else endIdx = currentSlot; //select current range
    } else if (start.y < box.y) {
      // the current row is below start row
      // select cells to the right of the start cell
      endIdx = lastSlotIdx;
    } else {
      // select cells to the left of the start cell
      startIdx = 0;
    }
  }

  return { startIdx, endIdx };
}
