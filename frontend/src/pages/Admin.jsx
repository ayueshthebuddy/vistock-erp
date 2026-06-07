import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [sales, setSales] = useState([]);
  const [parties, setParties] = useState([]);

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin-sales");
      setSales(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/parties");
      setParties(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateLimit = async (party) => {
    try {
      await axios.post("http://127.0.0.1:5000/update-limit", {
        party_name: party.party_name,
        credit_limit: party.credit_limit,
      });

      alert("Limit Updated Successfully");
      fetchParties();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Error Updating Limit");
    }
  };

  useEffect(() => {
    fetchSales();
    fetchParties();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">D.O Number</th>
              <th className="border p-3">Party</th>
              <th className="border p-3">Items</th>
              <th className="border p-3">Vehicle</th>
              <th className="border p-3">Driver Contact</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td className="border p-3">{sale.do_number}</td>
                <td className="border p-3">{sale.party}</td>

                <td className="border p-3">
                  {sale.items?.map((item, index) => (
                    <div key={index}>
                      {item.item} | Qty: {item.qty} | Total: ₹
                      {item.qty * item.price}
                    </div>
                  ))}
                </td>

                <td className="border p-3">{sale.vehicle || "Pending"}</td>

                <td className="border p-3">
                  {sale.driver_contact || "Pending"}
                </td>

                <td className="border p-3">
                  {sale.vehicle ? (
                    <span className="text-green-600 font-bold">
                      Dispatched
                    </span>
                  ) : (
                    <span className="text-orange-500 font-bold">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-5">
          Credit Limit Management
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Party Name</th>
              <th className="border p-3">Credit Limit</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {parties.map((party, index) => (
              <tr key={index}>
                <td className="border p-3">{party.party_name}</td>

                <td className="border p-3">
                  <input
                    type="number"
                    value={party.credit_limit}
                    onChange={(e) => {
                      const updated = [...parties];
                      updated[index].credit_limit = e.target.value;
                      setParties(updated);
                    }}
                    className="border p-2 rounded"
                  />
                </td>

                <td className="border p-3">
                  <button
                    type="button"
                    onClick={() => updateLimit(party)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;