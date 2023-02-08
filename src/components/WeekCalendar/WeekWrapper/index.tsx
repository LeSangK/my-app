import {
  add,
  addMilliseconds,
  isAfter,
  isBefore,
  isSameSecond,
  startOfDay,
} from "date-fns";
import React from "react";
import {
  DirectionType,
  ElementRect,
  Event,
  RowSegments,
  WeekWrapperProps,
} from "react-big-calendar";
import { inRange, merge } from "../../../utils/localizer";

import { eventTimes } from "../calendarUtil/common";
import { eventSegments } from "../calendarUtil/eventLevel";
import { getSlotAtX, pointInBox } from "../calendarUtil/selection";
import { DnDContext } from "../Context";
import { EventRow } from "../DateContentRow";
import Selection, { getBoundsForNode } from "../Selection";

interface WeekWrapperState {
  segment: RowSegments | null;
}

export class WeekWrapper extends React.Component<
  WeekWrapperProps,
  WeekWrapperState
> {
  static contextType = DnDContext;
  private ref: React.RefObject<HTMLDivElement>;
  private globalSelector: Selection | null = null;

  constructor(props: WeekWrapperProps) {
    super(props);
    this.state = { segment: null };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.props.draggable && this.initialSelectable();
  }

  componentWillUnmount() {
    if (this.globalSelector) {
      this.globalSelector.teardown();
      this.globalSelector = null;
    }
  }

  reset() {
    if (this.state.segment) {
      this.setState({ segment: null });
    }
  }

  update(event: Event, start: Date, end: Date) {
    const segment = eventSegments(
      { ...event, end, start, _isPreview: true },
      this.props.slotMetrics.range
    );

    const { segment: lastSegment } = this.state;
    if (
      lastSegment &&
      segment.span === lastSegment.span &&
      segment.left === lastSegment.left &&
      segment.right === lastSegment.right
    ) {
      return;
    }
    this.setState({ segment });
  }

  handleResize(point: { x: any; y: any }, bounds: ElementRect) {
    const {
      event,
      direction,
    }: {
      event: Event;
      direction: DirectionType;
    } = this.context.draggable.dragAndDropAction;
    const { slotMetrics } = this.props;

    let { start, end } = eventTimes(event);

    const slot = getSlotAtX(bounds, point.x, slotMetrics.slots);
    const date = slotMetrics.getDateForSlot(slot);
    const cursorInRow = pointInBox(bounds, point);

    if (direction === "RIGHT") {
      if (cursorInRow) {
        if (slotMetrics.last < start!) return this.reset();
        if (isSameSecond(end!, startOfDay(end!))) end = add(date, { days: 1 });
        else end = date;
      } else if (
        inRange(start!, slotMetrics.first, slotMetrics.last) ||
        (bounds.bottom < point.y && +slotMetrics.first > +start!)
      ) {
        end = add(slotMetrics.last, { seconds: 1 });
      } else {
        this.setState({ segment: null });
        return;
      }
      const originalEnd = event.end;
      end = merge(end!, originalEnd!);
      if (isBefore(end, start!)) {
        end = originalEnd;
      }
    } else if (direction === "LEFT") {
      if (cursorInRow) {
        if (slotMetrics.first > end!) return this.reset();
        start = date;
      } else if (
        inRange(end!, slotMetrics.first, slotMetrics.last) ||
        (bounds.top > point.y && isBefore(slotMetrics.last, end!))
      ) {
        start = add(slotMetrics.first, { seconds: -1 });
      } else {
        this.reset();
        return;
      }
      const originalStart = event.start;
      start = merge(start, originalStart!);
      if (isAfter(start, end!)) {
        start = originalStart;
      }
    }

    this.update(event, start!, end!);
  }

  handleMove = (point: { x: any; y: number }, bounds: ElementRect) => {
    if (!pointInBox(bounds, point)) return;
    const { event, currentDrag } = this.context.draggable.dragAndDropAction;
    const { slotMetrics, contentsId } = this.props;
    if (currentDrag !== contentsId) return;
    const slot = getSlotAtX(bounds, point.x, slotMetrics.slots);

    const date = slotMetrics.getDateForSlot(slot);

    // Adjust the dates, but maintain the times when moving
    const { start: eventStart, duration } = eventTimes(event);
    const start = merge(date, eventStart!);
    const end = addMilliseconds(start, duration);

    this.update(event, start, end);
  };

  initialSelectable = () => {
    if (!this.ref.current) return;
    const node = this.ref.current.closest(".rbc-row-content");
    if (!node || !(node instanceof HTMLElement)) return;
    const container = node.closest(".rbc-time-view");
    if (!container || !(container instanceof HTMLElement)) return;
    const selector = (this.globalSelector = new Selection(container));

    selector.on("beforeSelect", (point: { x: number; y: number }) => {
      const { action } = this.context.draggable.dragAndDropAction;
      const bounds = getBoundsForNode(node);
      const isInBox = pointInBox(bounds, point);
      return action === "move" || (action === "resize" && isInBox);
    });

    selector.on("selecting", (box: { x: number; y: number }) => {
      const bounds = getBoundsForNode(node);
      const { dragAndDropAction } = this.context.draggable;
      if (dragAndDropAction.action === "move") this.handleMove(box, bounds);
      if (dragAndDropAction.action === "resize") this.handleResize(box, bounds);
    });

    selector.on("selectStart", () => this.context.draggable.onStart());

    selector.on("select", (point: { x: number; y: number }) => {
      const bounds = getBoundsForNode(node);
      if (!this.state.segment) return;
      if (!pointInBox(bounds, point)) {
        this.reset();
        this.context.draggable.onEnd(null);
      } else {
        this.handleInteractionEnd();
      }
    });

    selector.on("click", () => this.context.draggable.onEnd(null));

    selector.on("reset", () => {
      this.reset();
      this.context.draggable.onEnd(null);
    });
  };

  handleInteractionEnd = () => {
    if (!this.state.segment) return;
    const { event } = this.state.segment;

    this.reset();

    this.context.draggable.onEnd({
      start: event.start,
      end: event.end,
    });
  };
  render() {
    const { children } = this.props;

    const { segment } = this.state;

    return (
      <div ref={this.ref} className="rbc-addons-dnd-row-body">
        {children}

        {segment && (
          <EventRow
            isMultiEvent={false}
            {...this.props}
            className="rbc-addons-dnd-drag-row"
            segments={[segment]}
          />
        )}
      </div>
    );
  }
}
