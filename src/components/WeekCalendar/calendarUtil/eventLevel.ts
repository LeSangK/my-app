import {
  add,
  differenceInDays,
  endOfDay,
  isSameDay,
  max,
  min,
  startOfDay,
} from "date-fns";
import findIndex from "lodash/findIndex";
import { Event, RowSegments } from "react-big-calendar";
import { ceil, getDateInRange } from "../../../utils/localizer";

//To include lastDay which come with 00:00
export const endOfRange = (dateRange: Date[]) => ({
  first: dateRange[0],
  last: add(dateRange[dateRange.length - 1], { days: 1 }),
});

export const intersectionRange = (
  eventRange: Date[],
  slotsDateRange: Date[]
) => {
  const { first, last } = endOfRange(slotsDateRange);
  const rStart = startOfDay(eventRange[0]);
  const rEnd = endOfDay(eventRange[eventRange.length - 1]); //23:59になる

  const start = max([rStart, first]);
  const end = min([rEnd, last]);

  return getDateInRange(start, end);
};

export function eventSegments(
  event: Event & { _isPreview?: boolean },
  range: Date[]
) {
  const { first, last } = endOfRange(range);

  const slots = differenceInDays(last, first);
  const start = max([startOfDay(event.start!), first]);
  const end = min([ceil(event.end!), last]);

  const padding = findIndex(range, (x) => isSameDay(x, start));
  let span = differenceInDays(end, start);

  span = Math.min(span, slots);
  span = Math.max(span, 1);

  return {
    event,
    span,
    left: padding + 1,
    right: Math.max(padding + span, 1),
  };
}

export function eventLevels(rowSegments: RowSegments[], limit = Infinity) {
  let i,
    j,
    seg,
    levels: RowSegments[][] = [],
    extra: RowSegments[] = [];

  for (i = 0; i < rowSegments.length; i++) {
    seg = rowSegments[i];
    for (j = 0; j < levels.length; j++) if (!segsOverlap(seg, levels[j])) break;

    if (j >= limit) {
      extra.push(seg);
    } else {
      (levels[j] || (levels[j] = [])).push(seg);
    }
  }

  for (i = 0; i < levels.length; i++) {
    levels[i].sort((a, b) => a.left - b.left);
  }

  return { levels, extra };
}

export function segsOverlap(seg: RowSegments, otherSegs: RowSegments[]) {
  return otherSegs.some(
    (otherSeg) => otherSeg.left <= seg.right && otherSeg.right >= seg.left
  );
}
