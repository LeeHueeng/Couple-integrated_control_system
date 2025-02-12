"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./CoupleCalendar.module.css"; // CSS 모듈 import

const CoupleCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([
    { id: "1", title: "데이트", start: "2025-02-10" },
    { id: "2", title: "영화 관람", start: "2025-02-12" },
  ]);

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt("일정 제목을 입력해주세요:");
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: arg.dateStr,
      };
      setEvents([...events, newEvent]);
      // Supabase API를 호출해서 백엔드에 일정 저장 로직 추가 가능
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.calendarWrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

export default CoupleCalendar;
