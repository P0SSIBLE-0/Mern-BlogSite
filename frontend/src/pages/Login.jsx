import Login from '../components/Login'

export default function LoginPage() {
  return (
    <div className='w-full h-full lg:h-4/5 flex py-2'>
      <div className='hidden lg:block w-1/2 h-1/2 lg:h-full'>
        <img className=' h-full w-full bg-cover opacity-90' src='https://images.unsplash.com/photo-1682686580950-960d1d513532?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D' alt="" />
      </div>
      <div className='w-full lg:w-1/2 h-full bg-gray-200' >
        <div>
          <Login/>
        </div>
      </div>
    </div>
  )
}
