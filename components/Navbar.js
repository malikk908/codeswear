import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiOutlineShoppingCart, AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { MdAccountCircle } from 'react-icons/md';

import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast } from 'react-toastify';



const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {


  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const router = useRouter()

  const { data: session } = useSession()



  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true)
    let exempted = ['/checkout', '/order', '/orders', '/myaccount']
    if (exempted.includes(router.pathname)) {
      setSidebar(false)
    }
  }, [Object.keys(cart).length])


  const ref = useRef()


  const toggleCart = () => {

    setSidebar(!sidebar)

  }

  const handleLogout = async ()=>{

    const data = await signOut({redirect: false, callbackUrl: "/"})
    router.push(data.url)
    toast.success('You have successfully logged out!')
    
  }


  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 z-10 bg-white'>

      <div className="logo mr-auto md:mx-5">
        <Link href={"/"}><img src="/logo2.png" alt="" /></Link>
      </div>
      <div className="nav">
        <ul className='flex space-x-4 font-bold md:text-xl'>
          <Link href={"/tshirts"}><li>Tshirts</li></Link>
          <Link href={"/hoodies"}><li>Hoodies</li></Link>
          <Link href={"/stickers"}><li>Stickers</li></Link>
          <Link href={"/mugs"}><li>Mugs</li></Link>
        </ul>
      </div>
      <div className="cart absolute right-0 top-2 mx-5 mt-2 font-bold flex ">
        {!session && <button onClick={() => { signIn() }} className='mx-2 bg-pink-600 rounded text-sm text-white p-2'>Login</button>}
        <span onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }}>{session && <MdAccountCircle className='mx-2 text-xl md:text-3xl' />}
          {dropdown && <div className='absolute right-8 bg-pink-300 top-7 py-4 rounded-md px-5 w-36'>
            <ul>
              <Link href={"/myaccount"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>My Account</li></Link>
              <Link href={"/orders"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Orders</li></Link>
              <li onClick={handleLogout} className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Logout</li>
            </ul>
          </div>}</span>

        <button onClick={toggleCart}><AiOutlineShoppingCart className='text-xl md:text-3xl' /></button>


      </div>
      <div ref={ref} className={`w-72 z-10 h-[100vh] overflow-x-hidden sideCart fixed top-0 bg-pink-100 px-8 py-10 transition-all ${sidebar ? 'right-0' : '-right-96'}`}>
        <h2 className='font-bold text-l text-center'>Shopping Cart</h2>
        <span className='absolute top-3 right-3 cursor-pointer text-pink-500 text-2xl' onClick={toggleCart}><AiFillCloseCircle /></span>
        <ol className='list-decimal font-semibold'>
          {Object.keys(cart).length == 0 && <div className='my-4'>Your cart is Empty!</div>}
          {Object.keys(cart).map((k) => {
            return <li key={k} className='my-3'>
              <div className="item flex">
                <div className='font-semibold w-2/3'>{cart[k].name}({cart[k].size}/{cart[k].variant})</div>
                <div className='flex items-center justify-center w-1/3 text-lg'>
                  <AiFillMinusCircle onClick={() => { removeFromCart(k, 1) }} className='cursor-pointer text-pink-500' /><span className='mx-2'> {cart[k].qty} </span><AiFillPlusCircle onClick={() => { addToCart(k, 1) }} className='cursor-pointer text-pink-500' /></div>
              </div>
            </li>
          })}
          <span className='total font-bold'>Subtotal: Rs.{subTotal} </span>



        </ol>
        <div className="flex mt-3">

          <Link href={"/checkout"}><button onClick={() => { setSidebar(false) }} disabled={Object.keys(cart).length == 0} className={`flex mr-2 text-white bg-pink-500 disabled:opacity-60 border-0 py-2 px-2 focus:outline-none ${!Object.keys(cart).length == 0 && `hover:bg-pink-600`} rounded text-sm`}> <BsFillBagCheckFill className='m-1 mr-3' /> Checkout</button></Link>
          <button disabled={Object.keys(cart).length == 0} onClick={clearCart} className={`flex mr-2 text-white bg-pink-500 disabled:opacity-60 border-0 py-2 px-2 focus:outline-none ${!Object.keys(cart).length == 0 && `hover:bg-pink-600`} rounded text-sm`}>Clear Cart</button>

        </div>

      </div>

    </div>
  )
}

export default Navbar
