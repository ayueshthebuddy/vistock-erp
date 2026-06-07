function StockCard({ title, value }) {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 w-64 border border-gray-200 hover:scale-105 transition duration-300">

      <h2 className="text-gray-500 text-lg font-medium">
        {title}
      </h2>

      <p className="text-4xl font-bold mt-4 text-gray-800">
        {value}
      </p>

    </div>
  );
}

export default StockCard;