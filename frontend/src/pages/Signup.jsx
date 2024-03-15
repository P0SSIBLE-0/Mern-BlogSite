import Signup from "../components/Signup";

export default function SignupPage() {
  return (
    <div className='w-full h-full lg:h-4/5 flex py-2'>
      <div className='hidden lg:block w-1/2 h-1/2 lg:h-full'>
        <img className=' h-full w-full bg-cover opacity-90 p-4' src='https://img.freepik.com/free-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.jpg?t=st=1710499196~exp=1710502796~hmac=03b46502211d808b78069305c06956a316d950bace7151da087ff850ea27b996&w=740' alt="" />
      </div>
      <div className='w-full lg:w-1/2 h-full bg-gray-200' >
        <div>
          <Signup/>
        </div>
      </div>
    </div>
  )
}
