import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Create doctor
  const createDoctor = async () => {
    await fetch("http://localhost:4000/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, specialization: spec }),
    });
    alert("Doctor created!");
  };

  // Create slot
  const createSlot = async () => {
    await fetch("http://localhost:4000/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_id: doctorId,
        start_time: start,
        end_time: end,
      }),
    });
    alert("Slot created!");
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {/* Create Doctor */}
      <h2>Create Doctor</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        <input
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Specialization"
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
        />
        <button onClick={createDoctor}>Create Doctor</button>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Create Slot */}
      <h2>Create Slot</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        <input
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        />
        <input
          placeholder="Start Time (ISO)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          placeholder="End Time (ISO)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={createSlot}>Create Slot</button>
      </div>
    </div>
  );
}
