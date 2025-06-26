import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "25px",
  zIndex: 1000,
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  width: "400px",
  fontFamily: "'Times New Roman', serif",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 999,
};

const EventModal = ({ date, onClose, onSave, existingEvent }) => {
  const [title, setTitle] = useState(existingEvent?.title || "");
  const [description, setDescription] = useState(
    existingEvent?.description || ""
  );
  const [time, setTime] = useState(existingEvent?.time || "");
  const [category, setCategory] = useState(
    existingEvent?.category || "General"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    const newEvent = {
      id: existingEvent?.id || uuidv4(),
      title,
      description,
      date: format(date, "yyyy-MM-dd"),
      time,
      category,
    };
    onSave(newEvent);
  };

  return createPortal(
    <>
      <div style={overlayStyle} onClick={onClose}></div>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          {existingEvent ? "Edit Event" : "Add Event"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
              }}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginRight: "10px",
                padding: "8px 14px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 14px",
                fontSize: "16px",
                fontFamily: "Times New Roman",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
};

export default EventModal;
