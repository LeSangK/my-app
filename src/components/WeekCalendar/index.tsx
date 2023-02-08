import React, { useMemo } from "react";
import { WeekCalendarProps } from "react-big-calendar";
import { getDateWeekRange } from "../../utils/localizer";

import { DateGrid } from "./DateGrid";
import { DragAndDropWrapper } from "./DragAndDropWrapper";

export const WeekCalendar: React.FC<WeekCalendarProps> = (props) => {
  const date = useMemo(() => {
    return props.date ?? new Date();
  }, [props.date]);
  const {
    component = {
      event: undefined,
      category: undefined,
      dateCellWrapper: undefined,
    },
  } = props;
  const range = useMemo(() => getDateWeekRange(date), [date]);
  return (
    <DragAndDropWrapper {...props}>
      <DateGrid {...props} date={date} range={range} component={component} />
    </DragAndDropWrapper>
  );
};
