"use client";

import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

// Load react-calendar *chỉ trên client*, tắt SSR
const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default Calendar;
