import React, { useState } from 'react'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import Link from 'next/link'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);




const checkout = ({ cart, addToCart, removeFromCart, subTotal }) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [disabled, setDisabled] = useState(true)

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

    if (name.length > 3 && email.length > 3 & address.length > 3 && phone.length > 3 && pincode.length > 1) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }

  }





  const handleCheckout = async () => {

    // try {
    //   const data = { cart, subTotal }
    //   // console.log(data)
    //   let res = await fetch(`/api/checkout_sessions`, {
    //     method: "POST", // or 'PUT'
    //     headers: {
    //       "Content-Type": "application/json",          
    //     },
    //     body: JSON.stringify(data),
    //   })

    //   let response = await res.json()
    //   // console.log(response)

    // } catch (error) {
    //   console.log(error)

    // }

    // ${process.env.NEXT_PUBLIC_HOST}

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
      toast.error(error.response.data.error)
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
    <div className='container px-6 sm:m-auto'>
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className='font-bold text-3xl text-center my-8'>Checkout</h1>
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
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
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
            <input onChange={handleChange} value={phone} type="text" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>

        </div>
        <div className="px-2 w-1/2">
          <div className="relative mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="number" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
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

      <h2 className='font-semibold text-xl mt-3'>2. Review Cart Items & Pay</h2>

      <div className='sideCart bg-pink-100 p-6 m-4 '>

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

      {/* <div className="flex mt-3 mx-4">

        <button> <BsFillBagCheckFill className='m-1 mr-3' /> Pay Rs.{subTotal} </button>


      </div> */}


      <section>
        <button disabled={false} onClick={handleCheckout} className={`flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none ${!disabled ? `hover:bg-pink-600` : 'disabled:opacity-50'}  rounded text-sm`} type="submit" role="link"><BsFillBagCheckFill className='m-1 mr-3' />
          Pay Rs.{subTotal}
        </button>
      </section>







    </div>
  )
}

export default checkout
