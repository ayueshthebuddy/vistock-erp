import { useEffect, useState } from "react";
import axios from "axios";

import StockCard from "../components/StockCard";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [data, setData] = useState({
    actual_stock: 0,
    virtual_stock: 0,
    total_sales: 0,
    pending_dispatch: 0,
  });

  const fetchDashboard = async () => {
    try {

      const response = await axios.get(
        "https://vistock-erp-production.up.railway.app/dashboard"
      );

      setData(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="flex gap-6 flex-wrap">

          <StockCard
            title="Actual Stock"
            value={data.actual_stock}
          />

          <StockCard
            title="Virtual Stock"
            value={data.virtual_stock}
          />

          <StockCard
            title="Pending Dispatch"
            value={data.pending_dispatch}
          />

          <StockCard
            title="Total Sales"
            value={data.total_sales}
          />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;