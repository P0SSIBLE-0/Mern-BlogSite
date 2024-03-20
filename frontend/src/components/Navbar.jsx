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
        credentials: "include",
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
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null);
    return <Navigate to={'/'} />
  }
  return (
      <header className="flex justify-between p-4 items-center sticky top-0 backdrop-blur-sm">
        <NavLink to="/" className="text-2xl lg:text-3xl font-Montserrat font-bold text-[#080fe8]">
          Perspective
        </NavLink>
        {userInfo && (
          <>
          <div className="flex font-semibold space-x-3">
            <Link className="hover:underline hover:text-blue-600 flex" to="/create"><PlusCircle className="mx-2" />New Post</Link>
            <div className="hover:underline hover:text-blue-600">
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
              <nav className="flex space-x-4 list-none">
                <li className="border-2 border-gray-800 py-1 px-4 rounded-2xl font-semibold bg-gray-800 text-white hover:bg-gray-900">
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li className="border border-gray-800 py-1 px-3 rounded-2xl font-semibold text-black hover:bg-gray-800 hover:text-white">
                  <NavLink to="/signup">Singup</NavLink>
                </li>
              </nav>
            </>
        )
        }
      </header>
  );
}
