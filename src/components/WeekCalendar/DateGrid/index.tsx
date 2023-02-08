import clsx from "clsx";
import { getMonth, isSameDay } from "date-fns";
import React from "react";
import { DateGridProps } from "react-big-calendar";
import { weekDayFormat } from "../../../utils/localizer";

import { DateContentRow } from "../DateContentRow";

const Header = ({ label }: { label: string }) => {
  return (
    <span role="columnheader" aria-sort="none">
      {label}
    </span>
  );
};

const HeaderComponent = ({ range }: { range: Date[] }) => (
  <>
    {range.map((date, i) => (
      <div key={i} className={"rbc-header"}>
        <Header label={weekDayFormat(date)} />
      </div>
    ))}
  </>
);

export const DateGrid: React.FC<DateGridProps> = (props) => {
  const {
    range,
    categories,
    events,
    component: { dateCellWrapper: DateCellWrapper },
  } = props;

  const today = new Date();
  // const eventsInRange = (type: Event["type"], categoryId?: string) => {
  //   const eventFilter = events.filter((event) =>
  //     inEventRange({ event, range })
  //   );
  //   switch (type) {
  //     case "event":
  //       return eventFilter.filter((evt) => evt.type === "event");
  //     case "process":
  //       return eventFilter.filter(
  //         (evt) =>
  //           evt.type === "process" &&
  //           (categoryId ? evt.companyIds.includes(categoryId) : true)
  //       );
  //     case "work":
  //       return eventFilter.filter(
  //         (evt) =>
  //           evt.type === "work" &&
  //           (categoryId ? categoryId === evt.companyId : true)
  //       );
  //   }
  // };

  return (
    <div className={"rbc-calendar"}>
      <div className={"rbc-time-view"}>
        <div className={"rbc-time-header"}>
          <div className={"rbc-time-header-content"}>
            <div className={"rbc-row"}>
              <HeaderComponent range={range} />
            </div>
          </div>
        </div>
        <div className={"rbc-allday-cell"} role="rowgroup">
          <div className={"rbc-header-event"}>
            <div className={"rbc-header-event-title"}>イベント</div>
            <DateContentRow
              isMultiEvent={false}
              isShowAll
              {...props}
              // events={eventsInRange("event")}
            />
          </div>

          <div className="rbc-row-bg">
            {range.map((date, index) =>
              DateCellWrapper ? (
                <DateCellWrapper value={date} key={index}>
                  <div
                    className={clsx(
                      "rbc-day-bg",
                      isSameDay(date, today) && "rbc-today",
                      today &&
                        getMonth(date) !== getMonth(today) &&
                        "rbc-off-range-bg"
                    )}
                    key={index}
                  />
                </DateCellWrapper>
              ) : (
                <div
                  className={clsx(
                    "rbc-day-bg",
                    isSameDay(date, today) && "rbc-today",
                    today &&
                      getMonth(date) !== getMonth(today) &&
                      "rbc-off-range-bg"
                  )}
                  key={index}
                />
              )
            )}
          </div>

          <div className={"rbc-category-contents"}>
            {!categories && (
              <DateContentRow
                {...props}
                isShowAll
                isMultiEvent
                // events={eventsInRange("process")}
                // subEvents={eventsInRange("work")}
              />
            )}
            {/* {categories &&
              categories.map((category) => (
                <CategoryRow
                  category={category}
                  {...props}
                  // events={eventsInRange("process", category.id)}
                  // subEvents={eventsInRange("work", category.id)}
                  key={category.id}
                />
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};
