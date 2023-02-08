import clsx from "clsx";
import React, { ReactElement, useMemo, useRef } from "react";
import {
  ActionType,
  DateContentRowProps,
  EventRowProps,
} from "react-big-calendar";
import { inEventRange } from "../../../utils/localizer";

import { BackgroundCells } from "../BackgroundCells";
import { getUniqueStr } from "../calendarUtil/common";
import { getSlotMetrics } from "../calendarUtil/dateSlotMetrics";
import { WeekWrapper } from "../WeekWrapper";
import { EventSegment, SpanSegment } from "./EventRowMixin";

export const EventRow: React.FC<EventRowProps> = (props) => {
  const { segments, slotMetrics, onSelectSlot, className } = props;
  const { slots } = slotMetrics;

  let lastEnd = 1;

  return (
    <div className={clsx(className, "rbc-row")}>
      {segments.reduce(
        (row: ReactElement[], { event, left, right, span }, li) => {
          const key = "_lvl_" + li;
          const gap = left - lastEnd;

          const content = (
            <EventSegment
              event={event}
              {...props}
              onSelectSlot={onSelectSlot}
            />
          );

          if (gap)
            row.push(
              <SpanSegment slots={slots} len={gap} key={`${key}_gap`} />
            );

          row.push(
            <SpanSegment slots={slots} len={span} key={key} content={content} />
          );

          lastEnd = right + 1;
          return row;
        },
        []
      )}
    </div>
  );
};

export const DateContentRow: React.FC<DateContentRowProps> = ({
  isMultiEvent = false,
  isShowAll,
  date,
  range,
  events,
  selectable,
  superEvent,
  subEvents,
  component,
  eventPropGetter,
  onSelectEvent,
  onSelectSlot,
}) => {
  const eventsInRange = useMemo(
    () =>
      events.filter((evt) =>
        !isMultiEvent
          ? inEventRange({
              event: evt,
              range,
            })
          : true
      ),
    [events, isMultiEvent, range]
  );
  const slotMetrics = useMemo(
    () =>
      getSlotMetrics({
        range,
        events: eventsInRange,
        minRows: 0,
        maxRows: isShowAll ? Infinity : 0,
      }),
    [eventsInRange, isShowAll, range]
  );

  console.log("slotMetrics", slotMetrics);

  const { levels } = slotMetrics;
  const container = useRef<HTMLDivElement>(null!);
  const getContainer = () => container.current;
  const handleSelectSlot = (slot: {
    start: number;
    end: number;
    action: ActionType;
  }) => {
    const date = range.slice(slot.start, slot.end + 1);
    const start = date[0];
    const end = date[date.length - 1];
    onSelectSlot &&
      onSelectSlot({
        start,
        end,
        slots: date,
        superEvent,
        action: slot.action,
      });
  };

  const contentsId = getUniqueStr();

  return (
    <div className={clsx("rbc-row-content")} role="row" ref={container}>
      {!isMultiEvent && selectable && (
        <BackgroundCells
          range={range}
          selectable={selectable}
          container={getContainer}
          onSelectSlot={handleSelectSlot}
        />
      )}
      <WeekWrapper
        contentsId={contentsId}
        draggable={!isMultiEvent}
        slotMetrics={slotMetrics}
        component={component}
        eventPropGetter={eventPropGetter}
      >
        {levels.map((segs, idx) => (
          <EventRow
            contentsId={contentsId}
            isMultiEvent={isMultiEvent}
            selectable={selectable}
            date={date}
            key={idx}
            subEvents={subEvents}
            segments={segs}
            slotMetrics={slotMetrics}
            component={component}
            eventPropGetter={eventPropGetter}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
          />
        ))}
      </WeekWrapper>
      {!isMultiEvent && <div className={"rbc-sub-event-empty"} />}
    </div>
  );
};
