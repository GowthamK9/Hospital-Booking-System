import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function App(){
  const [slots, setSlots] = useState<any[]>([])
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

  useEffect(()=> {
    fetchSlots()
  },[])

  async function fetchSlots(){
    try {
      const res = await axios.get(api + '/slots')
      setSlots(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return <div style={{padding:20}}>
    <h2>Available Slots</h2>
    {slots.length===0 && <div>No slots</div>}
    <ul>
      {slots.map(s => (
        <li key={s.id} style={{marginBottom:10}}>
          <b>{s.doctor_name}</b> ({s.specialization}) - {new Date(s.start_time).toLocaleString()} 
          <div>Available: {s.available}</div>
          <Link to={'/booking/'+s.id}>Book</Link>
        </li>
      ))}
    </ul>
  </div>
}
