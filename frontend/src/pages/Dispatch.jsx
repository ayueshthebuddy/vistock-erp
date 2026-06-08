import { useState } from "react";
import axios from "axios";

function Dispatch() {

  const [formData, setFormData] = useState({
    do_number: "",
    vehicle: "",
    driver_contact: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDispatch = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "https://vistock-erp-production.up.railway.app/dispatch",
        formData
      );

      alert(
        `Dispatch Completed\nVehicle: ${formData.vehicle}`
      );

      console.log(response.data);

      setFormData({
        do_number: "",
        vehicle: "",
      });

    } catch (error) {

      console.log(error);

      alert("D.O Not Found");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">

      <h1 className="text-3xl font-bold mb-8">
        Dispatch Entry
      </h1>

      <form
        onSubmit={handleDispatch}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-xl"
      >

        <div className="mb-5">

          <label className="block mb-2 font-medium">
            D.O Number
          </label>

          <input
            type="text"
            name="do_number"
            value={formData.do_number}
            onChange={handleChange}
            placeholder="Enter D.O Number"
            className="w-full border p-3 rounded-lg"
          />

        </div>

        <div className="mb-5">

          <label className="block mb-2 font-medium">
            Vehicle Number
          </label>

          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Enter vehicle number"
            className="w-full border p-3 rounded-lg"
          />

        </div>

        <div className="mb-5">

          <label className="block mb-2 font-medium">
              Driver Contact Number
           </label>

        <input
    type="text"
    name="driver_contact"
    value={formData.driver_contact}
    onChange={handleChange}
    placeholder="Enter driver contact number"
    className="w-full border p-3 rounded-lg"
        />

        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Confirm Dispatch
        </button>

      </form>

    </div>
  );
}

export default Dispatch;