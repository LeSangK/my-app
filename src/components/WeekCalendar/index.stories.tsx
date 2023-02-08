// import "../../../assets/styles/weekCalendar.scss";

// import clsx from "clsx";
// import { SubSlotInfo, WeekCalendarProps } from "react-big-calendar";

// import { Meta, Story } from "@storybook/react";

// import { categories, samples as events } from "../../../assets/eventSamples";
// import { Event } from "../../../models/ProjectSchedule/Event";
// import { defaultProfile } from "../../../models/User";
// import {
//   ProcessEventContent,
//   ProcessEventContentProps,
// } from "../ProcessEventContent";
// import { WorkEventContent, WorkEventContentProps } from "../WorkEventContent";
// import { WeekCalendar } from "./";

// const allEventComponent =
//   (
//     ProcessEvent: React.FC<ProcessEventContentProps>,
//     WorkEvent: React.FC<WorkEventContentProps>
//   ) =>
//   ({ event }: { event: Event }) => {
//     switch (event.type) {
//       case "process": {
//         return (
//           <ProcessEvent
//             event={event}
//             title={event.title}
//             detail={{
//               myProfile: defaultProfile,
//             }}
//             popoverView="processDetailForWeek"
//           />
//         );
//       }
//       case "work": {
//         return (
//           <WorkEvent
//             event={event}
//             title={event.title}
//             forPopover={{ myProfile: defaultProfile }}
//           />
//         );
//       }
//       case "event": {
//         return <div>{event.title}</div>;
//       }
//     }
//   };

// const eventPropGetter: (event: Event) => React.HTMLAttributes<HTMLDivElement> =
//   (event: Event) => {
//     switch (event.type) {
//       case "process": {
//         return { className: clsx("process") };
//       }
//       case "work": {
//         return { className: clsx("work") };
//       }
//       case "event": {
//         return { className: clsx("") };
//       }
//     }
//   };

// const args: Omit<WeekCalendarProps, "events"> = {
//   date: new Date(),
//   selectable: true,
//   component: {
//     event: allEventComponent(ProcessEventContent, WorkEventContent),
//   },
//   eventPropGetter: eventPropGetter,
//   onSelectEvent: (event: Event) =>
//     console.log(event.title, `start: ${event.start}, end: ${event.end}`),
//   onSelectSlot: (slots: SubSlotInfo) =>
//     slots.action === "click" &&
//     console.log(
//       `start: ${slots.start}`,
//       `end: ${slots.end}`,
//       slots.action,
//       slots.superEvent
//     ),
//   onEventDrop: ({ event, start, end }) => {
//     console.log(`event: ${event.title}, start: ${start}, end: ${end}`);
//   },
// };

// export default {
//   title: "pim-lam/organisms/WeekCalendar",
//   component: WeekCalendar,
//   args,
//   argTypes: {
//     date: {
//       type: null,
//     },
//     defaultDate: {
//       type: null,
//     },
//   },
// } as Meta;

// const Template: Story<WeekCalendarProps> = (props) => {
//   return <WeekCalendar {...props} />;
// };

// export const NoEvents = Template.bind({});
// NoEvents.args = {
//   events: [],
//   categories,
// };

// export const SomeEvents = Template.bind({});
// SomeEvents.args = {
//   events: [...events.processes, ...events.works, ...events.normalEvent],
//   categories,
// };

// export const NoCategories = Template.bind({});
// NoCategories.args = {
//   events: [...events.processes, ...events.works, ...events.normalEvent],
// };
export const HELLO = "tempt";
