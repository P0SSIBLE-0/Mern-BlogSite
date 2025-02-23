import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { UserContext } from "../userContext/UserContext";
import toast from "react-hot-toast";
import config from "../../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { setUserInfo } = useContext(UserContext);
  const login = async (e) => {
    e.preventDefault();
    if (username == "" && password == "") {
      toast("Please enter your username and password!");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };
    try {
      const response = await fetch(`${config.server_url}/login`, options);

      if (response.ok) {
        // login success
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUserInfo(data);
        setRedirect(true);
        toast.success("You are logined in!");
      } else {
        // login failed
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      // alert("Login failed. Please check your credentials and try again.");
      toast.error("Login failed. Please try again!");
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form
      className="flex flex-col items-center space-y-5 w-[90%] max-w-96 m-auto rounded-lg p-7 lg:p-10 md:p-9 my-2 bg-white min-h-96 lg:w-1/3"
      onSubmit={login}
    >
      <div className="flex flex-col items-center my-6">
        <h1 className="text-[1.8rem] font-Montserrat font-extrabold my-2">
          Welcome back!
        </h1>
        <span className="text-xs font-semibold text-neutral-500">
          Please enter your details
        </span>
      </div>
      <div className="w-full relative flex flex-col">
        <input
          className="peer bg-gray-50 mt-2 py-1.5 px-2 w-full outline-none border rounded-md focus:border-blue-700 placeholder:py-2 placeholder-transparent"
          autoFocus
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label
          htmlFor="username"
          className="absolute left-0 top-2 text-neutral-500 duration-300 transform origin-[0] px-3 py-2 scale-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:text-xs  peer-focus:-left-2 peer-focus:-translate-y-7 peer-valid:scale-80 peer-valid:-translate-y-7 peer-valid:-left-2 peer-valid:text-xs text-sm"
        >
          Username
        </label>
      </div>
      <div className="w-full relative flex flex-col">
        <input
          className="peer bg-gray-100 mt-2 py-1.5 text-lg px-2 w-full outline-none border rounded-md focus:border-blue-700 placeholder:py-2 placeholder-transparent"
          type={`${showPassword ? "text" : "password"}`}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
        <label htmlFor="password" className="absolute left-0 top-2.5 text-neutral-500 duration-300 transform origin-[0] px-3 py-2 scale-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:text-xs  peer-focus:-left-2 peer-focus:-translate-y-7 peer-valid:scale-80 peer-valid:-translate-y-7 peer-valid:-left-2 peer-valid:text-xs text-sm">
          Password
        </label>
        <span
          className={`absolute right-2 top-4 font-semibold cursor-pointer `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </span>
      </div>
      <div className="w-full">
        <button className="py-2 px-2 mt-5 w-full outline-2 bg-zinc-800 text-white hover:bg-zinc-900 hover:tracking-wider font-semibold rounded-md ">
          Login
        </button>
      </div>
      <span className="text-xs font-semibold text-neutral-400">
        Don't have an account?
        <Link to="/signup" className="hover:text-blue-400 text-blue-500">
          {" "}
          Signup
        </Link>
      </span>
    </form>
  );
}
