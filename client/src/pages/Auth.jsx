import React, { useContext, useState } from 'react'
import { AuthContext } from "../providers/AuthContex";

const Auth = () => {

    const { loginUser, registerUser } = useContext(AuthContext);

    //User form state
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

  return (
     <div className='bg-[#1A1A1A] h-screen flex justify-center items-center flex-col'>
          <div className='flex justify-center flex-col gap-6 items-center bg-[#FBFBFB] p-4 sm:px-10 py-16 rounded-2xl'>
              <h2 className='text-xl sm:text-3xl font-semibold my-1'>Welcome to IBER</h2>
              <form className='flex flex-col gap-2 border-2xl  '>
                  <input className='my-2.5 px-6 py-2 border outline-none border-gray-400 rounded-2xl' type="text" placeholder='User Name' onChange={(e) => setUserName(e.target.value)} />
                  <input className='my-2.5 px-6 py-2 border outline-none border-gray-400 rounded-2xl' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              </form>
              <div className='flex gap-2'>
                  <button className='my-2 px-10 py-3 bg-[#73C7C7] hover:bg-[#2E8A99]/80 duration-400 hover:text-white rounded-full' onClick={() => loginUser({ userName, password })}>Login</button>
                  <button className='my-2 px-10 py-3 border duration-300 hover:text-[#73C7C7] border-transparent rounded-full hover:border-[#73C7C7]' onClick={() => registerUser({ userName, password })}>Register</button>
               </div>   
          </div>
    </div>
  )
}

export default Auth