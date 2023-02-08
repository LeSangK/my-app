import React, { useContext } from "react";
import clsx from "clsx";
import { EventCellProps } from "react-big-calendar";
import { WeekEventWrapper } from "../WeekEventWrapper";
import { DnDContext } from "../Context";

export const EventCell: React.FC<EventCellProps> = ({
  contentsId,
  event,
  component: { event: Event },
  continuesPrior,
  continuesAfter,
  onSelectEvent,
  eventPropGetter,
}) => {
  const { title } = event;
  const userProps = eventPropGetter?.(event);
  const currentDrag =
    useContext(DnDContext).draggable?.dragAndDropAction.currentDrag;
  const content = (
    <div className="rbc-event-content">
      {Event ? <Event title={title!} event={event} /> : title}
    </div>
  );
  return (
    <WeekEventWrapper
      contentsId={contentsId}
      event={event}
      continuesPrior={continuesPrior}
      continuesAfter={continuesAfter}
    >
      <div
        tabIndex={0}
        style={{ ...userProps?.style }}
        className={clsx(
          "rbc-event",
          "rbc-event-allday",
          currentDrag !== contentsId && "rbc-addons-dnd-drag-inactive",
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
    </WeekEventWrapper>
  );
};
