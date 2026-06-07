import { useEffect, useState } from "react";
import axios from "axios";

function Invoice() {

  const [sale, setSale] = useState(null);

  const fetchLatestSale = async () => {
    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/latest-sale"
      );

      setSale(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestSale();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!sale) {
    return (
      <div className="p-8">
        No Invoice Data
      </div>
    );
  }

const total = sale.items?.reduce(
  (sum, row) =>
    sum + Number(row.qty) * Number(row.price),
  0
);

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">

      <div className="flex justify-end mb-5">

        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Print Invoice
        </button>

      </div>

      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Vistock ERP Invoice
        </h1>

        <p className="text-gray-500 mb-8">
         Invoice #{sale.do_number}
        </p>
        <p>
{new Date(sale.created_at).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})}
</p>

        <div className="mb-8">

          <h2 className="text-xl font-bold">
            Customer Details
          </h2>

          <p className="mt-2">
            {sale.party}
          </p>

          <p>
            {sale.address}
          </p>

        </div>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-3 text-left">
                Item
              </th>

              <th className="border p-3 text-left">
                Qty
              </th>

              <th className="border p-3 text-left">
                Price
              </th>

              <th className="border p-3 text-left">
                Total
              </th>

            </tr>

          </thead>

         <tbody>

  {sale.items?.map((row, index) => (

    <tr key={index}>

      <td className="border p-3">
        {row.item}
      </td>

      <td className="border p-3">
        {row.qty}
      </td>

      <td className="border p-3">
        ₹{row.price}
      </td>

      <td className="border p-3">
        ₹{Number(row.qty) * Number(row.price)}
      </td>

    </tr>

  ))}

</tbody>

        </table>

        <div className="mt-8 text-right">

          <h2 className="text-2xl font-bold">
            Grand Total: ₹{total}
          </h2>

        </div>

        <div className="mt-16">

          <p className="border-t pt-2 w-48">
            Authorized Signature
          </p>

        </div>

      </div>

    </div>
  );
}

export default Invoice;