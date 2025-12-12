import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Booking() {
  const { slotId } = useParams();
  const [name, setName] = useState("");

  const book = async () => {
    await fetch(`http://localhost:4000/book/${slotId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_name: name }),
    });
    alert("Slot booked!");
  };

  return (
    <div className="container">
      <h1>Book Slot</h1>

      <div style={{ display: "flex", gap: "15px" }}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={book}>Confirm Booking</button>
      </div>
    </div>
  );
}
