import React, { ReactElement } from "react";
import {
  Event,
  EventProps,
  SlotMetrics,
  SubSlotInfo,
} from "react-big-calendar";
import { EventCell } from "../EventCell";
import { MultiEventCell } from "../MultiEventCell";

export const SpanSegment: React.FC<{
  slots: number;
  len: number;
  content?: string | ReactElement;
}> = ({ slots, len, content = "" }) => {
  const per = (Math.abs(len) / slots) * 100 + "%";

  return (
    <div
      className="rbc-row-segment"
      style={{ WebkitFlexBasis: per, flexBasis: per, maxWidth: per }}
    >
      {content}
    </div>
  );
};

export const EventSegment: React.FC<{
  contentsId: string;
  isMultiEvent: boolean;
  event: Event;
  slotMetrics: SlotMetrics;
  component: { event?: React.ComponentType<EventProps<Event>> };
  date?: Date;
  selectable?: boolean;
  subEvents?: Event[];
  eventPropGetter?: (event: Event) => React.HTMLAttributes<HTMLDivElement>;
  onSelectEvent?: (event: Event, e: React.SyntheticEvent<HTMLElement>) => void;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
}> = ({
  contentsId,
  isMultiEvent,
  date,
  selectable,
  event,
  slotMetrics,
  component,
  subEvents,
  eventPropGetter,
  onSelectEvent,
  onSelectSlot,
}) => {
  const continuesPrior = slotMetrics.continuesPrior(event);
  const continuesAfter = slotMetrics.continuesAfter(event);
  return (
    <React.Fragment>
      {isMultiEvent && subEvents && date ? (
        <MultiEventCell
          date={date}
          event={event}
          selectable={selectable}
          subEvents={subEvents}
          continuesPrior={continuesPrior}
          continuesAfter={continuesAfter}
          onSelectEvent={onSelectEvent}
          component={component}
          eventPropGetter={eventPropGetter}
          onSelectSlot={onSelectSlot}
        />
      ) : (
        <EventCell
          contentsId={contentsId}
          event={event}
          continuesPrior={continuesPrior}
          continuesAfter={continuesAfter}
          onSelectEvent={onSelectEvent}
          component={component}
          eventPropGetter={eventPropGetter}
        />
      )}
    </React.Fragment>
  );
};
