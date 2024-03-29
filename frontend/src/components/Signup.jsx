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
      className="flex flex-col items-center space-y-8 w-[90%] max-w-80 m-auto rounded-lg p-8 my-3 bg-white min-h-96 mt-20 font-Montserrat"
      onSubmit={signup}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold font-Montserrat">Get Started</h1>
        <Link to="/login" className="text-sm text-neutral-500">
          Already have account? <span className="text-blue-500 font-semibold hover:underline" >Login</span>
        </Link>
      </div>
      <input
        className="border-b border-gray-800 py-1 w-full outline-none placeholder:text-black bg-white focus:border-blue-700 text-sm placeholder:py-2"
        type="text"
        name="usename"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border-b border-gray-800 py-1 w-full outline-none placeholder:text-black bg-white focus:border-blue-700 text-sm placeholder:py-2"
        type="email"
        name="usename"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="w-full relative my-4">
        <input
          className="border-b border-gray-800 py-1 w-full outline-none placeholder:text-black bg-white focus:border-blue-700 text-sm placeholder:py-2"
          type={`${showPassword ? "text" : "password"}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <span
          className={`absolute right-2 top-1 font-semibold hover:text-blue-600 cursor-pointer `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </span>
      </div>
      <button className="py-2 px-2 w-full outline-2 bg-gray-800 text-white hover:bg-gray-900 hover:tracking-wider font-semibold rounded-xl my-6">
        Signup
      </button>
    </form>
  );
}
