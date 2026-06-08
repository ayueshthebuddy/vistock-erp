import { useState } from "react";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem("role", "admin");
      window.location.href = "/";
    }

    else if (
      username === "sales" &&
      password === "sales123"
    ) {
      localStorage.setItem("role", "sales");
      window.location.href = "/";
    }

    else if (
      username === "dispatch" &&
      password === "dispatch123"
    ) {
      localStorage.setItem("role", "dispatch");
      window.location.href = "/";
    }

    else {
      alert("Invalid Login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6">
          Vistock ERP Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4"
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="bg-blue-600 text-white w-full p-3"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;