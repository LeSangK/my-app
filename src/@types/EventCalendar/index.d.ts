import { Event } from '../../models/Event';

export interface EventProps<TEvent extends object = Event> {
  event: TEvent;
  title: string;
}

export interface WeekCalendarProps {
  events: Event[];
  categories?: { id: string; label: string }[];
  date?: Date;
  selectable?: boolean;
  resizable?: boolean;
  component?: {
    category?: React.ComponentType<{ name: string }>;
    event?: React.ComponentType<EventProps<Event>>;
  };
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
  onEventDrop?: (args: InteractionInfo) => void;
  onEventResize?: (args: InteractionInfo) => void;
  draggableAccessor?: (event: Event) => boolean;
  resizableAccessor?: (event: Event) => boolean;
}

export interface EventCellProps {
  contentsId: string;
  event: Event;
  component: { event?: React.ComponentType<EventProps<Event>> };
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  continuesPrior: boolean;
  continuesAfter: boolean;
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
}

export interface MultiEventCellProps {
  date: Event;
  event: Event;
  subEvents: Event[];
  component: { event?: React.ComponentType<EventProps<Event>> };
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  continuesPrior: boolean;
  continuesAfter: boolean;
  selectable?: boolean;
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
}

export interface DateGridProps {
  range: Date[];
  date: Date;
  events: Event[];
  categories?: { id: string; label: string }[];
  component: {
    category?: React.ComponentType<{ name: string }>;
    event?: React.ComponentType<EventProps<Event>>;
  };
  selectable?: boolean;
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
}

export interface CategoryRowProps {
  date: Date;
  events: Event[];
  subEvents: Event[];
  range: Date[];
  component: {
    category?: React.ComponentType<{ name: string }>;
    event?: React.ComponentType<EventProps<Event>>;
  };
  category: { id: string; label: string };
}

export interface DateContentRowProps {
  date: Date;
  isMultiEvent: boolean;
  isShowAll: boolean;
  range: Date[];
  events: Event[];
  component: { event?: React.ComponentType<EventProps<Event>> };
  selectable?: boolean;
  subEvents?: Event[];
  superEvent?: Event;
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
}

export interface EventRowProps {
  contentsId: string;
  isMultiEvent: boolean;
  segments: RowSegments[];
  slotMetrics: SlotMetrics;
  date?: Date;
  selectable?: boolean;
  className?: string;
  component: { event?: React.ComponentType<EventProps<Event>> };
  subEvents?: Event[];
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
  onSelectEvent?: (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => void;
  onSelectSlot?: (slotInfo: SubSlotInfo) => void;
}

export interface SlotMetrics {
  first: Date;
  last: Date;

  levels: RowSegments[][];
  range: Date[];
  slots: number;
  continuesPrior: (event: Event) => boolean;
  continuesAfter: (event: Event) => boolean;
  getEventsForSlot: (slots: number) => Event[];
  getDateForSlot: (slot: number) => Date;
}

export interface RowSegments {
  event: Event;
  span: number;
  left: number;
  right: number;
}

export interface ElementRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface SelectedRect extends ElementRect {
  x: number;
  y: number;
}

export interface BackgroundProps {
  range: Date[];
  container: () => HTMLDivElement;
  selectable?: boolean;
  onSelectSlot?: (slot: {
    start: number;
    end: number;
    action: ActionType;
  }) => void;
}

export interface SlotInfo {
  start: Date;
  end: Date;
  slots: Date[] | string[];
  action: 'select' | 'click' | 'doubleClick';
}

export interface SubSlotInfo extends SlotInfo {
  superEvent?: Event;
}

export interface DragAndDropWrapperProps {
  resizable?: boolean;
  onEventDrop?: (args: InteractionInfo) => void;
  onEventResize?: (args: InteractionInfo) => void;
  draggableAccessor?: (event: Event) => boolean;
  resizableAccessor?: (event: Event) => boolean;
}

export interface DnDContextType {
  draggable?: {
    onStart: () => void;
    onEnd: (interactionInfo: InteractionInfo) => void;
    onBeginAction: (
      event: Event,
      action: DndActionType,
      currentId: string,
      direction?: DirectionType
    ) => void;
    dragAndDropAction: DragAndDropWrapperState;
    resizable?: boolean;
    draggableAccessor?: (event: Event) => boolean;
    resizableAccessor?: (event: Event) => boolean;
  };
}

export interface DragAndDropWrapperState {
  action: DndActionType | null;
  event: Event | null;
  interacting: boolean;
  direction: DirectionType | null;
  currentDrag: string | null;
}

export interface InteractionInfo {
  event: Event;
  start: Date;
  end: Date;
}

export interface WeekWrapperProps {
  contentsId: string;
  draggable: boolean;
  slotMetrics: SlotMetrics;
  component: { event?: React.ComponentType<EventProps<Event>> };
  eventPropGetter?: (
    event: Event
  ) => React.HTMLAttributes<HTMLDivElement>;
}

export interface WeekEventWrapperProps {
  contentsId: string;
  event: Event & { _isPreview?: boolean };
  continuesPrior: boolean;
  continuesAfter: boolean;
}

export type ActionType = "select" | "click";
export type DndActionType = "move" | "resize";
export type DirectionType = "LEFT" | "RIGHT";
