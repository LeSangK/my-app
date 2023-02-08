import clsx from "clsx";
import React from "react";
import {
  DirectionType,
  DndActionType,
  DnDContextType,
  DragAndDropWrapperProps,
  DragAndDropWrapperState,
  Event,
  InteractionInfo,
} from "react-big-calendar";
import { DnDContext } from "../Context";

export class DragAndDropWrapper extends React.Component<
  DragAndDropWrapperProps,
  DragAndDropWrapperState
> {
  constructor(props: DragAndDropWrapperProps) {
    super(props);

    this.state = {
      action: null,
      event: null,
      interacting: false,
      direction: null,
      currentDrag: null,
    };
  }

  getDnDContextValue(): DnDContextType {
    return {
      draggable: {
        onStart: this.handleInteractionStart,
        onEnd: this.handleInteractionEnd,
        onBeginAction: this.handleBeginAction,
        draggableAccessor: this.props.draggableAccessor,
        resizableAccessor: this.props.resizableAccessor,
        resizable: this.props.resizable,
        dragAndDropAction: this.state,
      },
    };
  }

  handleBeginAction = (
    event: Event,
    action: DndActionType,
    currentDrag: string,
    direction?: DirectionType
  ) =>
    this.setState({ event, action, currentDrag, direction: direction ?? null });

  handleInteractionStart = () =>
    this.state.interacting === false && this.setState({ interacting: true });

  handleInteractionEnd = (interactionInfo: InteractionInfo) => {
    const { action, event } = this.state;
    if (!action) return;

    this.setState({
      action: null,
      event: null,
      interacting: false,
      direction: null,
    });

    if (interactionInfo === null) return;

    if (event === null) return;
    interactionInfo.event = event;
    const { onEventDrop, onEventResize } = this.props;
    if (action === "move" && onEventDrop) onEventDrop(interactionInfo);
    if (action === "resize" && onEventResize) onEventResize(interactionInfo);
  };

  render() {
    const { interacting } = this.state;

    const context = this.getDnDContextValue();
    return (
      <DnDContext.Provider value={context}>
        <div
          className={clsx(
            "rbc-addons-dnd",
            !!interacting && "rbc-addons-dnd-is-dragging-week "
          )}
        >
          {this.props.children}
        </div>
      </DnDContext.Provider>
    );
  }
}
