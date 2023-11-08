import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react'


const MyAccount = () => {

  const { data: session, status } = useSession()

  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
  })

  const { name, email, address, phone, pincode, city, state } = user


  const router = useRouter()

  // const [email, setEmail] = useState('')


  useEffect(() => {
    if (status == 'loading') return

    if (session.user) {
      async function fetchEmail() {
        const email = session.user.email;
        try {
          const { data } = await axios.post(
            `/api/getuser`,
            {
              email
            }
          );

          const name = data.name
          const address = data.address
          const phone = data.phone
          const pincode = data.pincode

          setUser(prevState => (
            {
              ...prevState,
              name,
              email,
              address,
              phone,
              pincode
            }

          ))

          // setEmail(email)
          // setName(name)
          // setAddress(address)
          // setPhone(phone)
          // setPincode(pincode)

          getPincode(pincode)

        } catch (error) {
          console.log(error)
        }

      }

      fetchEmail()
    }
    else {
      router.push('/auth/login')
      toast.info('Please login to see your account details')
    }

  }, [session])

  const getPincode = async (pin) => {
    let pins = await fetch(`/api/pincode`)
    let pinJson = await pins.json()
    if (Object.keys(pinJson).includes(pin)) {
      // setCity(pinJson[pin][1])
      // setState(pinJson[pin][0])

      setUser(prev => (
        {
          ...prev,
          city: pinJson[pin][1],
          state: pinJson[pin][0]
        }
      ))
    } else {
      setUser(prev => (
        {
          ...prev,
          city: '',
          state: '',
        }
      ))
    }
  }



  // const [name, setName] = useState('')
  // const [address, setAddress] = useState('')
  // const [phone, setPhone] = useState('')
  // const [pincode, setPincode] = useState('')
  // const [city, setCity] = useState('')
  // const [state, setState] = useState('')

  const [epassword, setEpassword] = useState("")
  const [npassword, setNpassword] = useState("")
  const [cpassword, setCpassword] = useState("")

  const [disableDetailsButton, setDisableDetailsButton] = useState(true)
  const [disablePasswordButton, setDisablePasswordButton] = useState(true)

  const handleChange = (e) => {
    setUser(prevState => (
      {
        ...prevState,
        [e.target.name]: e.target.value
      }
    ))
    if (e.target.name == 'pincode') {
      getPincode(e.target.value)
    }

    if (name.length > 2 && address.length > 5 && phone.length > 7 && pincode.length > 4) {
      setDisableDetailsButton(false)
    } else {
      setDisableDetailsButton(true)
    }
   

  }


  const handlePasswordChange = async (e) => {

    if (e.target.name == 'epassword') {
      setEpassword(e.target.value)
    }
    else if (e.target.name == 'npassword') {
      setNpassword(e.target.value)
    }
    else if (e.target.name == 'cpassword') {
      setCpassword(e.target.value)
    }   

    if (epassword.length && npassword.length && cpassword.length) {
      setDisablePasswordButton(false)
    } else {
      setDisablePasswordButton(true)
    }

  }

  const handleSubmit = async () => {
    e.preventDefault()
    if (session.user) {

      const email = session.user.email
      const res = await axios.post(
        `/api/updateuser`,
        {
          email,
          name,
          address,
          pincode,
          phone
        }
      );
      console.log(res)
      if (res.data.success) {
        toast.success('Successfully Updated')
      }

    } else {
      router.push('/auth/login')
      toast.info('Session expired, please login to see your account details')
    }


  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (session.user) {

      if (npassword === cpassword) {

        if (npassword !== epassword) {

          try {
            const email = session.user.email

            const res = await axios.post(
              `/api/updatepassword`,
              {
                email,
                epassword,
                npassword,
                cpassword
              }
            );
            console.log(res)
            if (res.data.success) {
              toast.success('Successfully Updated the Password!')

              setEpassword("")
              setNpassword("")
              setCpassword("")
            }

          } catch (error) {
            console.log(error)
            if (!error.response.data.success) {

              toast.error(error.response.data.error)
            }
          }

        } else {
          toast.error('New password cannot be old password')

        }


      } else {
        toast.error('Password not matched, try again')
        return

      }

    } else {
      router.push('/auth/login')
      toast.info('Session expired, please login to see your account details')
    }

  }


  return (
    <div className='container px-10 sm:px-6 sm:m-auto'>
      <h1 className='font-bold text-3xl text-center my-8'>Account Details</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>


      <div className="mt-5 flex flex-col sm:flex-row">
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Email (cannot be changed)</label>
            <input readOnly value={email} type="email" id="email" name="email" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <div className='mx-auto'>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="address" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Address</label>

            <textarea onChange={handleChange} value={address} className='w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out' name="address" id="address" cols="30" rows="2"></textarea>

          </div>

        </div>

      </div>

      <div className="mt-5 flex flex-col sm:flex-row">
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Phone</label>
            <input onChange={handleChange} value={phone} type="number" id="phone" name="phone" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 10 digit phone number' />
          </div>

        </div>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Pincode</label>
            <input onChange={handleChange} value={pincode} type="number" id="pincode" name="pincode" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 6 digit pincode' />
          </div>

        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row">
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600 dark:text-gray-300">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600 dark:text-gray-300">City</label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
      </div>

      <button disabled={disableDetailsButton} onClick={handleSubmit} className={`flex ml-2 mt-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${!disableDetailsButton ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} type="submit" role="link"> Submit </button>

      {session?.user?.provider && <div>

        <h2 className='font-semibold text-xl mt-4'>2. Change Password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="mx-auto mt-5 flex">
            <div className="px-2 w-full sm:w-1/2">
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Existing Password</label>
                <input onChange={handlePasswordChange} value={epassword} type="password" id="epassword" name="epassword" required className="w-full text-gray-700 bg-white dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>

            </div>

          </div>

          <div className="mx-auto mt-2 flex">
            <div className="px-2 w-full sm:w-1/2">
              <div className="relative mb-4">
                <label htmlFor="state" className="leading-7 text-sm text-gray-600 dark:text-gray-300">New Password</label>
                <input onChange={handlePasswordChange} value={npassword} type="password" id="npassword" name="npassword" required className="w-full bg-white text-gray-700 dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>

            </div>

          </div>

          <div className="mx-auto mt-2 flex">
            <div className="px-2 w-full
             sm:w-1/2">
              <div className="relative mb-4">
                <label htmlFor="state" className="leading-7 text-sm text-gray-600 dark:text-gray-300">Confirm Password</label>
                <input onChange={handlePasswordChange} value={cpassword} type="password" id="cpassword" name="cpassword" required className="w-full bg-white text-gray-700 dark:text-gray-300  dark:bg-gray-800 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>

            </div>

          </div>


          <button disabled={disablePasswordButton || npassword != cpassword} type='submit' className={`flex ml-2 my-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${!disablePasswordButton && npassword == cpassword ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} role="link"> Reset Password </button>
          {cpassword && npassword != cpassword &&
            <span className='text-red-600'>Password Not Matched</span>}
          {npassword && npassword == cpassword &&
            <span className='text-green-600'>Password Matched</span>}

        </form>

      </div>}

    </div>
  )
}

export default MyAccount
