import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

import Invoice from "./pages/Invoice";
import Admin from "./pages/Admin";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Dispatch from "./pages/Dispatch";
import Stock from "./pages/Stock";

import { Routes, Route } from "react-router-dom";

function App() {

  const role = localStorage.getItem("role");

  if (!role) {
    return <Login />;
  }

  return (
    <div className="flex watermark-bg">

      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

    </div>
  );
}

export default App;