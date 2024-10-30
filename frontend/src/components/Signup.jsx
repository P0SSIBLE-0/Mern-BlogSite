import { useContext, useState } from "react";
import { UserContext } from "../userContext/UserContext";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import config from "../../config";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);
  const signup = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    };

    try {
      const response = await fetch(`${config.server_url}/signup`, options);
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
        setRedirect(true);
        toast.success("User is now signed up.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      // handle error
      toast.error("something went wrong!");
      console.error(error);
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form
      className="flex flex-col items-center space-y-5 w-[90%] max-w-96 m-auto rounded-md px-8 py-14 my-3 bg-white min-h-96 mt-20 shadow-md"
      onSubmit={signup}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold font-Montserrat">Sign up</h1>
        <Link to="/login" className="text-sm text-neutral-500">
          Already have account?{" "}
          <span className="text-blue-500 font-semibold hover:underline">
            Login
          </span>
        </Link>
      </div>
      <div className="w-full">
        <label htmlFor="username" className="font-semibold text-gray-500 ml-1">
          Username
        </label>
        <input
          className="bg-blue-50 mt-2 py-2 text-lg px-2 w-full outline-none border rounded-md focus:border-blue-700  placeholder:py-2"
          type="text"
          id="username"
          name="usename"
          placeholder="sam jones"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="w-full">
        <label htmlFor="email" className="font-semibold text-gray-500 ml-1">
          Email
        </label>
        <input
          className="bg-blue-50 mt-2 py-2 text-lg px-2 w-full outline-none border rounded-md focus:border-blue-700  placeholder:py-2"
          type="email"
          id="email"
          name="email"
          placeholder="sam@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="w-full relative my-4">
        <label htmlFor="password" className="font-semibold text-gray-500 ml-1">
          Password
        </label>
        <input
          className="bg-blue-50 mt-2 py-2 text-lg px-2 w-full outline-none border rounded-md focus:border-blue-700  placeholder:py-2"
          id="password"
          type={`${showPassword ? "text" : "password"}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <span
          className={`absolute right-2 top-11 font-semibold hover:text-blue-600 cursor-pointer `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </span>
      </div>
      <div className="w-full">
      <button className="py-2 px-2 w-full outline-2 bg-zinc-800 text-white hover:bg-gray-900 hover:tracking-wider font-semibold rounded-md mt-5">
        Signup
      </button>
      </div>
    </form>
  );
}
