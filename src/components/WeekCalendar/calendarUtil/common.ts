import { add, differenceInMilliseconds, isSameSecond } from "date-fns";
import { Event } from "react-big-calendar";

export function eventTimes(event: Event) {
  const start = event.start;
  let end = event.end;
  const isZeroDuration =
    isSameSecond(start!, end!) && differenceInMilliseconds(start!, end!) === 0;
  if (isZeroDuration) end = add(end!, { minutes: 30 });
  const duration = differenceInMilliseconds(end!, start!);
  return { start, end, duration };
}

export function getUniqueStr(): string {
  const strong = 1000;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}
