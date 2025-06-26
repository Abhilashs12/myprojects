import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

function App() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar-events");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    document.title = "My Smart Planner";
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleSaveEvent = (eventData) => {
    if (editEvent) {
      const updated = events.map((e) =>
        e.id === eventData.id ? eventData : e
      );
      setEvents(updated);
    } else {
      setEvents((prev) => [...prev, eventData]);
    }
    setShowModal(false);
    setEditEvent(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
        fontFamily: "'Times New Roman', serif",
        paddingBottom: "40px",
      }}
    >
      <h1 style={{ textAlign: "center", paddingTop: "20px", fontSize: "36px" }}>
        📆 My Smart Planner
      </h1>

      {/* Search Input */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search events by title or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: "12px",
            width: "60%",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
            fontFamily: "'Times New Roman', serif",
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <label
          style={{
            marginRight: "8px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Filter by Category:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "16px",
            border: "1px solid #ccc",
            fontFamily: "'Times New Roman', serif",
          }}
        >
          <option value="All">All</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Calendar Component */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Calendar
          events={events}
          setEvents={setEvents}
          onDateClick={(date) => {
            setSelectedDate(date);
            setEditEvent(null);
            setShowModal(true);
          }}
          onEventClick={(event) => {
            setEditEvent(event);
            setSelectedDate(new Date(event.date));
            setShowModal(true);
          }}
          searchText={searchText}
          filterCategory={filterCategory}
          viewMode="month"
        />
      </div>

      {showModal && (
        <EventModal
          date={selectedDate}
          onClose={() => {
            setShowModal(false);
            setEditEvent(null);
          }}
          onSave={handleSaveEvent}
          existingEvent={editEvent}
        />
      )}
    </div>
  );
}

export default App;
