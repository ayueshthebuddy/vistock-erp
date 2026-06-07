import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Boxes,
  FileText,
  ShieldCheck
} from "lucide-react";

import { Link } from "react-router-dom";

function Sidebar() {
    const role = localStorage.getItem("role");
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-3xl font-bold mb-10">
        Vistock ERP
      </h1>

     <ul className="space-y-6">

  <Link to="/">
    <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
      <LayoutDashboard size={20} />
      Dashboard
    </li>
  </Link>

  {(role === "admin" || role === "sales") && (
    <Link to="/sales">
      <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
        <ShoppingCart size={20} />
        Sales Enrty
      </li>
    </Link>
  )}

  {(role === "admin" || role === "dispatch") && (
    <Link to="/dispatch">
      <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
        <Truck size={20} />
        Delivery
      </li>
    </Link>
  )}

  {role === "admin" && (
    <Link to="/stock">
      <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
        <Boxes size={20} />
        Stock
      </li>
    </Link>
  )}

  {(role === "admin" || role === "sales") && (
    <Link to="/invoice">
      <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
        <FileText size={20} />
        Invoice
      </li>
    </Link>
  )}

  {role === "admin" && (
    <Link to="/admin">
      <li className="flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition">
        <ShieldCheck size={20} />
        Admin Panel
      </li>
    </Link>
  )}

</ul>

    </div>
  );
}

export default Sidebar;