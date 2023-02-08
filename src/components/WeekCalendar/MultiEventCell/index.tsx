import clsx from "clsx";
import React from "react";
import { MultiEventCellProps } from "react-big-calendar";
import { getDateInRange, getDateWeekRange } from "../../../utils/localizer";

import { intersectionRange } from "../calendarUtil/eventLevel";
import { DateContentRow } from "../DateContentRow";

export const MultiEventCell: React.FC<MultiEventCellProps> = ({
  event,
  date,
  subEvents,
  selectable,
  component: { event: Event },
  continuesPrior,
  continuesAfter,
  onSelectEvent,
  eventPropGetter,
  onSelectSlot,
}) => {
  const { title } = event;
  const userProps = eventPropGetter?.(event);
  // const events = subEvents.filter(
  //   (evt) =>
  //     evt.type === "work" &&
  //     event.type === "process" &&
  //     evt.processId === event.processId
  // );
  const range = intersectionRange(
    getDateInRange(event.start!, event.end!),
    getDateWeekRange(date)
  );

  const content = (
    <div className="rbc-event-content">
      {Event ? <Event title={title!} event={event} /> : title}
    </div>
  );
  const subContents = (
    <DateContentRow
      isShowAll
      date={date}
      isMultiEvent={false}
      selectable={selectable}
      events={subEvents}
      superEvent={event}
      range={range}
      component={{ event: Event }}
      eventPropGetter={eventPropGetter}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
    />
  );
  return (
    <React.Fragment>
      <div
        tabIndex={0}
        style={{ ...userProps?.style }}
        className={clsx(
          "rbc-event",
          "rbc-event-allday",
          "rbc-addons-dnd-drag-inactive",
          userProps?.className,
          {
            "rbc-event-continues-prior": continuesPrior,
            "rbc-event-continues-after": continuesAfter,
          }
        )}
        onClick={(e) => onSelectEvent && onSelectEvent(event, e)}
      >
        {content}
      </div>
      {subContents}
    </React.Fragment>
  );
};
