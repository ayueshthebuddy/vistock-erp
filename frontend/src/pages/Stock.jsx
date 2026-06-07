import { useEffect, useState } from "react";
import axios from "axios";

function Stock() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/products"
      );

      setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-8">
        Stock Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">
              {product.name}
            </h2>

            <p className="text-lg">
              Actual Stock:
              <span className="font-bold ml-2">
                {product.actual_stock}
              </span>
            </p>

            <p className="text-lg mt-2">
              Virtual Stock:
              <span className="font-bold ml-2 text-blue-600">
                {product.virtual_stock}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stock;