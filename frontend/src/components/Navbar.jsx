import { useContext, useEffect } from "react";
import { NavLink, Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import {PlusCircle} from 'lucide-react'
export default function Navbar() {
  const {setUserInfo, userInfo} = useContext(UserContext);


  async function fetchProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/profile", {
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
    }
  }
  useEffect(() => {
    fetchProfile();
  },[]);

  const logout = () => {
    localStorage.removeItem('token');
    setUserInfo(null)
    fetch('http://localhost:3000/logout',{
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null);
    return <Navigate to={'/'} />
  }
  return (
    <div>
      <header className="flex justify-between p-4 items-center sticky top-0">
        <NavLink to="/" className="text-2xl font-bold">
          MyBlog
        </NavLink>
        {userInfo && (
          <>
          <div className="flex font-semibold space-x-3">
            <Link className="hover:underline hover:text-blue-600 flex" to="/create"><PlusCircle className="mx-2" /> Create New Post</Link>
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
                <li className="border-2 border-gray-800 py-1 px-3 rounded font-semibold bg-gray-800 text-white hover:bg-gray-900">
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li className="border-2 border-gray-800 py-1 px-3 rounded font-semibold  text-black hover:bg-gray-800 hover:text-white">
                  <NavLink to="/signup">Singup</NavLink>
                </li>
              </nav>
            </>
        )
        }
      </header>
    </div>
  );
}
