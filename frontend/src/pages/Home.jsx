import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css'

export default function Home() {

  return (
    <div className='lg:max-w-screen-lg h-[100vh] lg:m-auto'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}
