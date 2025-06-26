import React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import {
  DndContext,
  closestCenter,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

const categoryColors = {
  Work: "#007bff",
  Personal: "#e83e8c",
  Urgent: "#dc3545",
  General: "#28a745",
  Default: "#6c757d",
};

const DayCell = ({ day, events, onDateClick, onEventClick, setEvents }) => {
  const { setNodeRef } = useDroppable({ id: format(day, "yyyy-MM-dd") });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        minHeight: "120px",
        backgroundColor:
          format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
            ? "#fff5d7"
            : "#fff",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        fontFamily: "'Times New Roman', serif",
        cursor: "pointer",
        transition: "0.2s ease",
      }}
      onClick={() => onDateClick(day)}
    >
      <div
        style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "6px" }}
      >
        {format(day, "d")}
      </div>
      <ul style={{ fontSize: "14px", listStyle: "none", padding: 0 }}>
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={onEventClick}
            setEvents={setEvents}
          />
        ))}
      </ul>
    </div>
  );
};

const EventItem = ({ event, onClick, setEvents }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: event.id });
  const bgColor = categoryColors[event.category] || categoryColors.Default;

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        backgroundColor: bgColor,
        color: "#fff",
        padding: "6px 10px",
        marginBottom: "6px",
        borderRadius: "5px",
        fontFamily: "'Times New Roman', serif",
        fontSize: "14px",
        cursor: "grab",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <span>{event.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("Delete this event?")) {
            setEvents((prev) => prev.filter((ev) => ev.id !== event.id));
          }
        }}
        style={{
          color: "#fff",
          background: "transparent",
          border: "none",
          marginLeft: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        title="Delete"
      >
        ✖
      </button>
    </li>
  );
};

const Calendar = ({
  events,
  onDateClick,
  onEventClick,
  setEvents,
  searchText,
  filterCategory,
}) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsByDate = days.reduce((acc, day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    acc[dateKey] = events.filter(
      (e) =>
        e.date === dateKey &&
        (filterCategory === "All" || e.category === filterCategory) &&
        (e.title.toLowerCase().includes(searchText.toLowerCase()) ||
          e.description.toLowerCase().includes(searchText.toLowerCase()))
    );
    return acc;
  }, {});

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (!over) return;
    const eventId = active.id;
    const newDate = over.id;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, date: newDate } : ev))
    );
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "15px",
          padding: "20px",
        }}
      >
        {days.map((day) => (
          <DayCell
            key={day}
            day={day}
            events={eventsByDate[format(day, "yyyy-MM-dd")] || []}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            setEvents={setEvents}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default Calendar;
