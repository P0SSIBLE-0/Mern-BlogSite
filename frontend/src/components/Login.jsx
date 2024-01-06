import { useContext, useState } from "react";
import { Navigate , Link} from "react-router-dom";
import { Eye, EyeOff} from "lucide-react"
import { UserContext } from "../userContext/UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);


  const {setUserInfo} = useContext(UserContext);
  const login = async (e) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch("http://localhost:3000/login", options);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUserInfo(data);
        setRedirect(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form
      className="flex flex-col items-center space-y-5 w-4/5 max-w-80 m-auto rounded-lg p-10 my-2 bg-white font-sans min-h-96 mt-20"
      onSubmit={login}
    >
      <div className="flex flex-col items-center my-6">
        <h1 className="text-2xl font-extrabold my-2">Welcome back!</h1>
        <span className="text-xs font-semibold text-neutral-600">Please enter your details</span>

      </div>
      <input
        className="border-b border-gray-800 py-1 w-full outline-none placeholder:text-black bg-white focus:border-blue-700 text-sm placeholder:py-2"
        type="text"
        name="usename"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="w-full relative">
        <input
          className="border-b border-gray-800 py-1 outline-none  w-full focus:border-blue-700 placeholder:text-black text-sm"
          type={`${showPassword ? "text" : "password"}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <span
          className={`absolute right-2 top-1 font-semibold cursor-pointer `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye/>  :<EyeOff/>}
        </span>
      </div>
      <button className="py-2 px-2 w-full outline-2 bg-gray-800 text-white hover:bg-gray-900 hover:tracking-wider font-semibold rounded-xl ">
        Login
      </button>
      <span className="text-xs font-semibold text-neutral-400">Don't have an account?<Link to={'/signup'}> Signup</Link></span>
    </form>
  );
}
