import { useState } from "react";
import axios from "axios";

function Sales() {

  const prices = {
    "TMT 8mm": 58,
    "TMT 10mm": 62,
    "TMT 12mm": 68,
    "TMT 16mm": 75,
  };

const [formData, setFormData] = useState({
  party: "",
  address: "",
  items: [
    {
      item: "",
      qty: "",
      price: 0
    }
  ]
});
  const [total, setTotal] = useState(0);

const addItem = () => {
  setFormData(prev => ({
    ...prev,
    items: [
      ...prev.items,
      {
        item: "",
        qty: "",
        price: 0
      }
    ]
  }));
};

const handleItemChange = (index, field, value) => {

  const updatedItems = [...formData.items];

  updatedItems[index][field] = value;

  if (field === "item") {
    updatedItems[index].price = prices[value];
  }

  setFormData({
    ...formData,
    items: updatedItems
  });

  let grandTotal = 0;

  updatedItems.forEach((row) => {
    grandTotal +=
      (Number(row.qty) || 0) *
      (Number(row.price) || 0);
  });

  setTotal(grandTotal);
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "https://vistock-erp-production.up.railway.app/sales",
        formData
      );

      alert(
        `D.O Created Successfully\n${response.data.do_number}`
      );

     setFormData({
  party: "",
  address: "",
  items: [
    {
      item: "",
      qty: "",
      price: 0
    }
  ]
});
      setTotal(0);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
        "Error creating D.O"
      );
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">

      <h1 className="text-3xl font-bold mb-8">
        Sales Entry
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-xl"
      >

        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Party Name
          </label>

          <select
  name="party"
  value={formData.party}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
>
  <option value="">Select Party</option>

 <option>Barak Steel</option>
<option>Classic Tyres</option>
<option>HP Trader</option>
<option>Loknath Hardware</option>
<option>Niharika Trading</option>
<option>PP Engineering</option>
<option>Steel Traders</option>
<option>PC Steel</option>
<option>JK Traders</option>
<option>Tarat Trading</option>
<option>A One Steel</option>
<option>Milan Iron and Hardware Store</option>
<option>Joy Maa Kali Steel House</option>
<option>Biplab Chakraborty</option>
<option>New Steel Centre</option>
<option>Shivam Enterprise</option>
<option>Maa Tara Traders</option>
<option>Durga Hardware</option>
<option>Ganpati Traders</option>
<option>Laxmi Enterprise</option>
<option>Mahadev Steel</option>
<option>R.K. Traders</option>
<option>S.K. Enterprise</option>
<option>Jai Mata Di Traders</option>
<option>Balaji Steel</option>
<option>Om Hardware</option>
<option>Bharat Traders</option>
<option>Pioneer Enterprise</option>
<option>Modern Steel</option>
<option>United Traders</option>
<option>National Hardware</option>
<option>Royal Steel</option>
<option>Shree Ganesh Enterprise</option>
<option>Shankar Traders</option>
<option>Radha Krishna Traders</option>
<option>Maa Kali Traders</option>
<option>Annapurna Enterprise</option>
<option>Maa Durga Enterprise</option>
<option>City Hardware</option>
<option>Prime Steel</option>
<option>Eastern Traders</option>
<option>Barak Valley Traders</option>
<option>New India Enterprise</option>
<option>Metro Hardware</option>
<option>Universal Traders</option>
<option>Star Steel</option>
<option>Super Enterprise</option>
<option>Maa Lakshmi Traders</option>
<option>Reliable Hardware</option>
<option>Assam Steel House</option>
<option>Siliguri Traders</option>
<option>Shree Krishna Traders</option>
<option>Shakti Enterprise</option>
<option>North East Steel</option>
<option>Best Hardware</option>
</select>
</div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div className="mb-5">

          <label className="block mb-3 font-medium">
                Order Items
          </label>

{formData.items.map((row, index) => (

  <div
    key={index}
    className="grid grid-cols-3 gap-3 mb-4"
  >

    <select
      value={row.item}
      onChange={(e) =>
        handleItemChange(
          index,
          "item",
          e.target.value
        )
      }
      className="border p-3 rounded-lg"
    >
      <option value="">
        Select TMT
      </option>

      <option value="TMT 8mm">
        TMT 8mm
      </option>

      <option value="TMT 10mm">
        TMT 10mm
      </option>

      <option value="TMT 12mm">
        TMT 12mm
      </option>

      <option value="TMT 16mm">
        TMT 16mm
      </option>

    </select>

    <input
      type="number"
      placeholder="Qty"
      value={row.qty}
      onChange={(e) =>
        handleItemChange(
          index,
          "qty",
          e.target.value
        )
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="number"
      value={row.price}
      readOnly
      className="border p-3 rounded-lg bg-gray-100"
    />

  </div>

))}

<button
  type="button"
  onClick={addItem}
  className="bg-green-600 text-white px-4 py-2 rounded-lg mb-5"
>
  + Add Another Item
</button>
</div>

        <div className="mb-5">

          <label className="block mb-2 font-medium">
            Total Amount
          </label>

          <input
            type="number"
            value={total}
            readOnly
            className="w-full border p-3 rounded-lg bg-gray-100"
          />

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create D.O
        </button>

      </form>

    </div>
    
  );
}

export default Sales;