import {
  add,
  isAfter,
  isBefore,
  isSameDay,
  isSameMinute,
  startOfDay,
} from "date-fns";
import endOfWeek from "date-fns/endOfWeek";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import { ja } from "date-fns/locale";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
  ja,
};
type FnsLocalizerConfig = {
  format: typeof format;
  parse: typeof parse;
  startOfWeek: typeof startOfWeek;
  getDay: typeof getDay;
  locales: typeof locales;
};
export type FnsLocalizerOptions = {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 週の始まりの曜日 (e.g. 0: 日曜日, 6: 土曜日)
};

const fnsLocalizerConfig: (options: FnsLocalizerOptions) => FnsLocalizerConfig =
  (options) => ({
    format,
    parse,
    startOfWeek: (date) =>
      startOfWeek(date, { weekStartsOn: options.weekStartsOn }),
    getDay,
    locales,
  });

export const fnsLocalizer = (options: FnsLocalizerOptions) =>
  dateFnsLocalizer(fnsLocalizerConfig(options));

//weekCalendar
export const getDateWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return getDateInRange(start, end);
};

export const getDateInRange = (start: Date, end: Date) => {
  let curr = start;
  const days: Date[] = [];

  while (isAfter(ceil(end), curr)) {
    days.push(curr);
    curr = add(curr, { days: 1 });
  }

  return days;
};

export const weekDayFormat = (date: Date) =>
  format(date, "d(E)", { locale: ja }); // 日本語のみ

export const isSameOrBefore = (dateA: Date, dateB: Date) =>
  isSameDay(dateA, dateB) || isBefore(dateA, dateB);

export const isSameOrAfter = (dateA: Date, dateB: Date) =>
  isSameDay(dateA, dateB) || isAfter(dateA, dateB);

export const isBeforeDate = (dateA: Date, dateB: Date) =>
  isBefore(startOfDay(dateA), startOfDay(dateB));

export const isAfterDate = (dateA: Date, dateB: Date) =>
  isAfter(startOfDay(dateA), startOfDay(dateB));

export const inEventRange = ({
  event: { start, end },
  range,
}: {
  event: { start?: Date; end?: Date };
  range: Date[];
}) => {
  if (!start || !end) return;
  const first = range[0];
  const last = add(range[range.length - 1], { days: 1 });
  const startDay = startOfDay(start);

  const startBeforeLast = isBefore(startDay, last); //同じの場合はカウントされない、日曜日00:00を次の週とする

  const notSameMin = !isSameMinute(end, startDay);
  const endAfterFirst = notSameMin
    ? isAfter(end, first)
    : isSameOrAfter(end, first);

  return startBeforeLast && endAfterFirst;
};

export function ceil(date: Date) {
  const floor = startOfDay(date);
  return isSameMinute(floor, date) ? floor : add(floor, { days: 1 });
}

export function merge(date: Date, time: Date) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const secondes = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  const newDate = startOfDay(date);
  newDate.setHours(hours, minutes, secondes, milliseconds);
  return newDate;
}

export function inRange(day: Date, min: Date, max: Date) {
  const mDay = startOfDay(day);
  const mMin = startOfDay(min);
  const mMax = startOfDay(max);
  return isSameOrAfter(mDay, mMin) && isSameOrBefore(mDay, mMax);
}
