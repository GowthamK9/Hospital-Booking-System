import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App'
import Admin from './pages/Admin'
import Booking from './pages/Booking'
import './styles.css'
const root = createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/admin">Admin</Link>
    </nav>

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  </BrowserRouter>
);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav style={{padding:10}}>
        <Link to="/" style={{marginRight:10}}>Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking/:slotId" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
