import { useContext, useEffect } from "react";
import { NavLink, Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import {PlusCircle} from 'lucide-react'
import toast from "react-hot-toast";
import config from "../../config";
export default function Navbar() {
  const {setUserInfo, userInfo} = useContext(UserContext);


  async function fetchProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${config.server_url}/profile`, {
        headers: {
          Authorization: `${token}`, // Send token in header
        },
      });

      if (!response.ok) {
        console.error(
          // `Profile request failed with status: ${response.status}`
        );
      }
      const profile = await response.json();
      if(response.ok) setUserInfo(profile);
      
    } catch (error) {
      // console.error("Profile fetch error:", error);
      toast.error("some error occurred while fetching profile")
    }
  }
  useEffect(() => {
    fetchProfile();
  },[]);

  const logout = () => {
    localStorage.removeItem('token');
    setUserInfo(null)
    fetch(`${config.server_url}/logout`,{
      method: 'POST',
    })
    setUserInfo(null);
    return <Navigate to={'/'} />
  }
  return (
      <header className="flex justify-between p-4 items-center sticky top-0 backdrop-blur-sm z-20 lg:max-w-screen-xl mx-auto ">
        <NavLink to="/" className="text-2xl lg:text-3xl font-Montserrat font-extrabold bg-gradient-to-r from-zinc-800 to-zinc-500 text-transparent bg-clip-text inline-block">
        Postly
        </NavLink>
        {userInfo && (
          <>
          <div className="flex justify-start items-center font-semibold space-x-3 h-10">
            <Link className="duration-200 hover:bg-blue-600 flex items-center bg-zinc-900 text-white py-2 px-3 rounded-md" to="/create"><PlusCircle className="mx-2" />New Post</Link>
            <div className=" hover:bg-blue-500 border-2 border-gray-300 p-2 rounded-md hover:text-white">
            <a href=""
            onClick={logout} 
            >Logout</a>
            </div>
          </div>
          </>
        )}
        {
        !userInfo && (
            <>
              <nav className="flex space-x-4 list-none text-sm lg:text-base md:text-base ">
                <li className="border-2 border-zinc-800 py-1.5 px-4 rounded-lg font-semibold bg-zinc-800 text-white hover:bg-zinc-900 tracking-widest">
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li className="border-2 border-zinc-800 py-1.5 px-3 rounded-lg font-semibold text-black hover:bg-zinc-800 hover:text-white tracking-widest">
                  <NavLink to="/signup">Signup</NavLink>
                </li>
              </nav>
            </>
        )
        }
      </header>
  );
}
