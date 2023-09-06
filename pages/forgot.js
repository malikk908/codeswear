import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify';


const forgot = () => {

  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCpassword] = useState('')


  const handleChange = async (e) => {
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
    else if (e.target.name == 'cpassword') {
      setCpassword(e.target.value)
    }
  }

  const sendResetEmail = async (e) => {

    e.preventDefault()

    try {
      const { data } = await axios.post(
        `/api/forgot`,
        {
          email,
          sendMail: true
        }
      );

      router.push(`/forgot?token=${data.token}`)  //since we dont have an email service running, we are pushing user directly the token url; in reality, user is supposed to come at this url through email

      toast.success('Password Reset instructions have been sent to your email')

    } catch (error) {
      console.log(error)
      toast.error('Some error occured')
    }

  }

  const resetPassword = async (e) => {

    e.preventDefault()

    if (password === cpassword) {

      try {
        let token = router.query.token
        console.log(token)
        const { data } = await axios.post(
          `/api/forgot`,
          {
            email,
            password,
            token,
            sendMail: false
          }
        );
        router.push(`/login`)
        toast.success(data.message)

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }


    }
    else {
      toast.error('Password not matched, try again')

    }

  }


  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="/logo1.png" alt="Your Company" />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Forgot Password</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          {!router.query.token && <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input value={email} onChange={handleChange} id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
            <div className='mt-4'>
              <button onClick={sendResetEmail} type="submit" className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">Continue</button>
            </div>
          </div>}
          {router.query.token && <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
            <div className="mt-2">
              <input value={password} onChange={handleChange} id="password" name="password" type="password" autoComplete="password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
            <label htmlFor="cpassword" className="mt-4 block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
            <div className="mt-2">
              <input value={cpassword} onChange={handleChange} id="cpassword" name="cpassword" type="password" autoComplete="cpassword" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
            <div className='mt-4'>
              <button disabled={password !== cpassword} onClick={resetPassword} type="submit" className={`flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${password === cpassword ? `hover:bg-pink-600` : 'disabled:opacity-50'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600`}>Reset Password</button>
            </div>
            {cpassword && password != cpassword &&
              <span className='text-red-600'>Password Not Matched</span>}
            {password && password == cpassword &&
              <span className='text-green-600'>Password Matched</span>}
          </div>
          }
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <span className='mx-2'>Or</span>
          <Link href="/login" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default forgot
