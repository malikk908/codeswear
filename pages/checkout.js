import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';

import { useSession } from 'next-auth/react'


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);


const Checkout = ({ cart, addToCart, removeFromCart, clearCartAfterCheckout, subTotal }) => {

  const { data: session } = useSession()


  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [disabled, setDisabled] = useState(true)


  useEffect(() => {

    if (session) {
      async function fetchEmail() {
        const email = session.user.email;
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
        setDisabled(false)
      }

      fetchEmail()
    }
    else {
      return
    }

  }, [])

  const getPincode = async (pin) => {
    let pins = await fetch(`/api/pincode`)
        let pinJson = await pins.json()
        if (Object.keys(pinJson).includes(pin)) {
          setCity(pinJson[pin][1])
          setState(pinJson[pin][0])
        } else {
          setCity('')
          setState('')
        }
  }


  const handleChange = async (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
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
        let pins = await fetch(`/api/pincode`)
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

    if (name.length > 3 && email.length > 3 && address.length > 3 && phone.length > 3 && pincode.length > 1) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const handleCheckout = async () => {

    try {
      let oid = Math.floor(Math.random() * Date.now())
      const { data } = await axios.post(
        `/api/orders/checkout_session`,
        {
          items: cart,
          subTotal,
          oid,
          name,
          email,
          address,
          pincode,
          phone
        }
      );
      window.location.href = data.url

    } catch (error) {
      console.log(error)
      if (!error.response.data.dontClearCart) {
        clearCartAfterCheckout()
      }
      toast.error(error.response.data.error, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);


  return (
    <div className='container px-6 sm:m-auto text-gray-600 dark:text-gray-200'>
      <h1 className='font-bold text-3xl text-center my-8 '>Checkout</h1>
      <h2 className='font-semibold text-xl dark:text-gray-300'>1. Delivery Details</h2>

      <div className="mx-auto mt-5 flex ">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm ">Email</label>
            <input ${...(session?.user ? {readOnly:true} : {onChange: handleChange})} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />          
            
          </div>

        </div>
      </div>

      <div className='mx-auto'>
        <div className="px-2 w-full">
          <div className="relative mb-4">
            <label htmlFor="address" className="leading-7 text-sm ">Address</label>

            <textarea onChange={handleChange} value={address} className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out' name="address" id="address" cols="30" rows="2"></textarea>

          </div>

        </div>

      </div>

      <div className="mx-auto mt-5 flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm ">Phone</label>
            <input onChange={handleChange} value={phone} type="number" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 10 digit phone number' />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm ">Pincode</label>
            <input onChange={handleChange} value={pincode} type="number" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter your 6 digit pincode' />
          </div>

        </div>
      </div>

      <div className="mx-auto mt-5 flex">
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="state" className="leading-7 text-sm ">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="city" className="leading-7 text-sm ">City</label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
      </div>

      <h2 className='font-semibold text-xl mt-3 dark:text-gray-300'>2. Review Cart Items & Pay</h2>

      <div className='sideCart bg-pink-100 dark:bg-[#475569] dark:text-gray-100 rounded-lg  p-6 m-4 '>

        <ol className='list-decimal font-semibold'>
          {Object.keys(cart).length == 0 && <div className='my-4'>Your cart is Empty!</div>}
          {Object.keys(cart).map((k) => {
            return <li key={k} className='my-3'>
              <div className="item flex">
                <div className='font-semibold'>{cart[k].name}({cart[k].size}/{cart[k].variant})</div>
                <div className='flex items-center justify-center w-1/3 text-lg'>
                  <AiFillMinusCircle onClick={() => { removeFromCart(k, 1) }} className='cursor-pointer text-pink-500' /><span className='mx-2'> {cart[k].qty} </span><AiFillPlusCircle onClick={() => { addToCart(k, 1) }} className='cursor-pointer text-pink-500' /></div>
              </div>
            </li>
          })}
          <span className='total font-bold'>Subtotal: Rs.{subTotal} </span>

        </ol>


      </div>
      


      <section>
        <button disabled={disabled} onClick={handleCheckout} className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${!disabled ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} type="submit" role="link"><BsFillBagCheckFill className='m-1 mr-3' />
          Pay Rs.{subTotal}
        </button>
      </section>

    </div>
  )
}

export default Checkout
