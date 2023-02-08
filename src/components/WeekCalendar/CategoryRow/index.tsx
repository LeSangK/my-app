import clsx from "clsx";
import React from "react";
import { CategoryRowProps, SubSlotInfo } from "react-big-calendar";

import { DateContentRow } from "../DateContentRow";

export const CategoryRow: React.FC<CategoryRowProps> = (props) => {
  const {
    events,
    category,
    component: { category: CategoryComponent },
    onSelectSlot,
  } = props;

  const [categoryOpen, setCategoryOpen] = React.useState<boolean>(true);

  const handleOpen = () => {
    setCategoryOpen(!categoryOpen);
  };

  const handleSlotSelected = (slotInfo: SubSlotInfo) => {
    const categoryId = category.id;
    onSelectSlot?.({ ...slotInfo, categoryId: categoryId });
  };

  return (
    <>
      {events.length !== 0 && (
        <div className={"rbc-category-box"} key={category.id}>
          {CategoryComponent ? (
            <CategoryComponent name={category.label} />
          ) : (
            <div
              className={clsx("rbc-category-row")}
              onClick={() => handleOpen()}
            >
              {categoryOpen ? "▲" : "▼"} {category.label}
            </div>
          )}
          <DateContentRow
            isMultiEvent
            isShowAll={categoryOpen}
            {...props}
            onSelectSlot={handleSlotSelected}
          />
        </div>
      )}
    </>
  );
};
