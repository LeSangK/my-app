import clsx from 'clsx';
import React, { createRef } from 'react';
import { ActionType, BackgroundProps, SelectedRect } from 'react-big-calendar';

import { dateCellSelection, getSlotAtX, pointInBox } from '../calendarUtil/selection';
import Selection, { getBoundsForNode, isEvent } from '../Selection';

export interface BackgroundState {
  selecting: boolean;
  startIdx: number;
  endIdx: number;
}

//Stateを同期で使うためClassComponentにしました
export class BackgroundCells extends React.Component<
  BackgroundProps,
  BackgroundState & { didMount: boolean }
> {
  private initial: { x?: number; y?: number } = {};
  private globalSelector: Selection | null = null;
  private cellsRef: React.RefObject<HTMLDivElement>;

  constructor(props: BackgroundProps) {
    super(props);

    this.cellsRef = createRef();
    this.state = {
      selecting: false,
      startIdx: -1,
      endIdx: -1,
      didMount: false,
    };
  }

  componentDidMount() {
    this.setState({ didMount: true });
  }

  componentWillUnmount() {
    if (this.globalSelector) {
      this.globalSelector.teardown();
      this.globalSelector = null;
      this.setState({ didMount: false });
    }
  }

  componentDidUpdate() {
    if (this.props.container() !== null && this.globalSelector === null) {
      this.props.selectable && this.initialSelectable();
    }
  }

  initialSelectable = () => {
    const node = this.cellsRef.current;
    const { container } = this.props;
    const selector = (this.globalSelector = new Selection(container()));
    if (node === null) return;
    const selectorClicksHandler = (
      point: { x: any; y: number },
      actionType: ActionType
    ) => {
      if (!isEvent(node, point)) {
        const rowBox = getBoundsForNode(node);

        if (pointInBox(rowBox, point)) {
          const currentCell = getSlotAtX(
            rowBox,
            point.x,
            this.props.range.length
          );

          this.selectSlot({
            startIdx: currentCell,
            endIdx: currentCell,
            action: actionType,
          });
        }

        this.initial = {};
        this.setState({ selecting: false });
      }
    };

    selector.on("selecting", (box: SelectedRect) => {
      let startIdx = -1,
        endIdx = -1;

      const isCurrentContainer = pointInBox(
        getBoundsForNode(this.props.container()),
        {
          x: box.x,
          y: box.y,
        }
      );

      if (!this.state.selecting && isCurrentContainer) {
        this.initial = { x: box.x, y: box.y };
      }

      if (selector.isSelected(node)) {
        const nodeBox = getBoundsForNode(node);
        ({ startIdx, endIdx } = dateCellSelection(
          this.initial,
          nodeBox,
          box,
          this.props.range.length
        ));
      }

      this.setState({
        selecting: true,
        startIdx,
        endIdx,
      });
    });

    selector.on("beforeSelect", (box: SelectedRect) => !isEvent(node, box));

    selector.on("click", (point: { x: any; y: number }) =>
      selectorClicksHandler(point, "click")
    );

    selector.on("select", () => {
      this.selectSlot({
        startIdx: this.state.startIdx,
        endIdx: this.state.endIdx,
        action: "select",
      });
      this.initial = {};
      this.setState({ selecting: false });
    });
  };

  selectSlot = ({
    startIdx,
    endIdx,
    action,
  }: {
    startIdx: number;
    endIdx: number;
    action: ActionType;
  }) => {
    if (endIdx !== -1 && startIdx !== -1) {
      this.props.onSelectSlot &&
        this.props.onSelectSlot({
          start: startIdx,
          end: endIdx,
          action,
        });
    }
  };
  render() {
    const { range } = this.props;
    const { selecting, startIdx, endIdx } = this.state;
    return (
      <div className="rbc-row-bg" ref={this.cellsRef}>
        {range.map((date, index) => {
          const selected = selecting && index >= startIdx && index <= endIdx;
          return (
            <div
              style={{ flex: "1 0 0%" }}
              className={clsx(selected && "rbc-selected-cell")}
              key={index}
            />
          );
        })}
      </div>
    );
  }
}
