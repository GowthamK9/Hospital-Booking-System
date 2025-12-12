import { useEffect, useState } from "react";

export default function Home() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/slots")
      .then((res) => res.json())
      .then(setSlots);
  }, []);

  return (
    <div className="container">
      <h1>Available Slots</h1>

      {slots.length === 0 ? (
        <p>No slots available.</p>
      ) : (
        slots.map((slot: any) => (
          <div key={slot.id} className="slot-card">
            <div className="slot-title">Doctor: {slot.doctor_name}</div>
            <div>Time: {slot.start_time} - {slot.end_time}</div>
            <a href={`/booking/${slot.id}`}>
              <button style={{ marginTop: "10px" }}>Book Slot</button>
            </a>
          </div>
        ))
      )}
    </div>
  );
}
