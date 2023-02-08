import { isAfter, isBefore, isSameDay } from "date-fns";
import { eventSegments, endOfRange, eventLevels } from "./eventLevel";
import { SlotMetrics, RowSegments, Event } from "react-big-calendar";

const isSegmentInSlot = (seg: RowSegments, slot: number) =>
  seg.left <= slot && seg.right >= slot;

export const getSlotMetrics = (options: {
  range: Date[];
  events: Event[];
  maxRows: number;
  minRows: number;
}): SlotMetrics => {
  const { range, events, maxRows, minRows } = options;
  const { first, last } = endOfRange(range);

  const segments = events.map((evt: Event) => eventSegments(evt, range));

  const { levels } = eventLevels(segments, Math.max(maxRows, 0));

  while (levels.length < minRows) levels.push([]);

  return {
    first,
    last,

    levels,
    range,
    slots: range.length,

    continuesPrior(event: Event) {
      return isBefore(event.start!, first);
    },

    continuesAfter(event: Event) {
      const end = event.end;
      return isAfter(end!, last) || isSameDay(end!, last);
    },

    getDateForSlot(slotNumber) {
      return range[slotNumber];
    },

    getEventsForSlot(slot: number) {
      return segments
        .filter((seg) => isSegmentInSlot(seg, slot))
        .map((seg) => seg.event);
    },
  };
};
