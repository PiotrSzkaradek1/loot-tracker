import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import BossSelection from "./pages/BossSelection";
import Looting from "./pages/Looting";
import LootHistorySelection from "./pages/LootHistorySelection";
import LootHistory from "./pages/LootHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/*miejsce na routing*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boss-selection" element={<BossSelection />} />
        <Route path="looting" element={<Looting />} />
        <Route path="/loot-history-selection" element={<LootHistorySelection />} />
        <Route path="/loot-history" element={<LootHistory />}/>
      </Routes>
    </Router>
  );
}

export default App;