import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react'


const MyAccount = () => {

  const { data: session } = useSession()


  const router = useRouter()

  const [email, setEmail] = useState('')


  useEffect(() => {

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

          setEmail(email)
          setName(name)
          setAddress(address)
          setPhone(phone)
          setPincode(pincode)
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

  }, [])

  const getPincode = async (pin) => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let pinJson = await pins.json()
    if (Object.keys(pinJson).includes(pin)) {
      setCity(pinJson[pin][1])
      setState(pinJson[pin][0])
    } else {
      setCity('')
      setState('')
    }
  }



  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [epassword, setEpassword] = useState("")
  const [npassword, setNpassword] = useState("")
  const [cpassword, setCpassword] = useState("")



  const [disableDetailsButton, setDisableDetailsButton] = useState(true)


  const handleChange = async (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'address') {
      setAddress(e.target.value)
    }
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
    }
    else if (e.target.name == 'pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
        let pinJson = await pins.json()
        if (Object.keys(pinJson).includes(e.target.value)) {
          setCity(pinJson[e.target.value][1])
          setState(pinJson[e.target.value][0])
        } else {
          setCity('')
          setState('')
        }
      } else {
        setCity('')
        setState('')
      }
    }
    else if (e.target.name == 'epassword') {
      setEpassword(e.target.value)
    }
    else if (e.target.name == 'npassword') {
      setNpassword(e.target.value)
    }
    else if (e.target.name == 'cpassword') {
      setCpassword(e.target.value)
    }


    if (name.length > 1 || address.length > 3 || phone.length > 7 || pincode.length > 4) {
      setDisableDetailsButton(false)
    } else {
      setDisableDetailsButton(true)
    }

  }

  const handleSubmit = async () => {
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
        toast.success(('Successfully Updated'), {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }

    } else {
      router.push('/auth/login')
      toast.info('Session expired, please login to see your account details')
    }


  }

  const handlePasswordChange = async () => {

    if (session.user) {      

      if (npassword === cpassword) {

        if(npassword !== epassword){

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
              toast.success(('Successfully Updated'), {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              })
  
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

        }else{
          toast.error('New password cannot be old password')

        }        


      } else {
        toast.error(('Password not matched, try again'), {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        return

      }

    } else {
      router.push('/auth/login')
      toast.info('Session expired, please login to see your account details')
    }

  }


  return (
    <div className='container px-6 sm:m-auto'>
      <h1 className='font-bold text-3xl text-center my-8'>Account Details</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>


      <div className="mx-auto mt-5 flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email (cannot be changed)</label>
            <input readOnly value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <div className='mx-auto'>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>

            <textarea onChange={handleChange} value={address} className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out' name="address" id="address" cols="30" rows="2"></textarea>

          </div>

        </div>

      </div>

      <div className="mx-auto mt-5 flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input onChange={handleChange} value={phone} type="number" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 10 digit phone number' />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="number" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 6 digit pincode' />
          </div>

        </div>
      </div>

      <div className="mx-auto mt-5 flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
      </div>

      <button disabled={disableDetailsButton} onClick={handleSubmit} className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${!disableDetailsButton ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} type="submit" role="link"> Submit </button>

      {session?.user?.provider && <div>

        <h2 className='font-semibold text-xl mt-4'>2. Change Password</h2>

        <div className="mx-auto mt-5 flex">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Existing Password</label>
              <input onChange={handleChange} value={epassword} type="password" id="epassword" name="epassword" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>

          </div>

        </div>

        <div className="mx-auto mt-2 flex">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label htmlFor="state" className="leading-7 text-sm text-gray-600">New Password</label>
              <input onChange={handleChange} value={npassword} type="password" id="npassword" name="npassword" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>

          </div>

        </div>

        <div className="mx-auto mt-2 flex">
          <div className="px-2 w-1/2">
            <div className="relative mb-4">
              <label htmlFor="state" className="leading-7 text-sm text-gray-600">Confirm Password</label>
              <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>

          </div>

        </div>


        <button disabled={npassword != cpassword} onClick={handlePasswordChange} className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${npassword == cpassword ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} type="submit" role="link"> Reset Password </button>
        {cpassword && npassword != cpassword &&
          <span className='text-red-600'>Password Not Matched</span>}
        {npassword && npassword == cpassword &&
          <span className='text-green-600'>Password Matched</span>}

      </div>}

    </div>
  )
}

export default MyAccount
