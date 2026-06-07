function Navbar() {

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white shadow-md p-5 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-gray-800">
        Vistock ERP
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">
         Welcome {role?.toUpperCase()}
        </span>

       <button
  onClick={() => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  }}
  className="bg-red-600 text-white px-4 py-2 rounded"
>
  Logout
</button>

      </div>

    </div>
  );
}

export default Navbar;