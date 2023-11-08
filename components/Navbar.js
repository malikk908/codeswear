import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiOutlineShoppingCart, AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle, AiOutlineSearch } from 'react-icons/ai';
import { BsFillBagCheckFill, BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { MdAccountCircle } from 'react-icons/md';

import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "next-themes"
import { FaHome } from 'react-icons/fa';



const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {

  const { theme, setTheme } = useTheme()

  const [loaded, setLoaded] = useState(false);

  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const router = useRouter()

  const { data: session } = useSession()

  //Hydration
  useEffect(() => setLoaded(true), []);

  useEffect(() => {

    Object.keys(cart).length !== 0 && setSidebar(true)

    let exempted = ['/checkout', '/order', '/orders', '/myaccount', '/auth/login', '/auth/signup', '/auth/forgot']
    if (exempted.includes(router.pathname)) {
      setSidebar(false)
    }

  }, [subTotal])


  const ref = useRef()

  const toggleCart = () => {

    setSidebar(!sidebar)
  }

  const handleLogout = async () => {

    const data = await signOut({ redirect: false, callbackUrl: "/" })
    router.push(data.url)
    toast.success('You have successfully logged out!')
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  console.log(loaded)
  console.log(theme)



  return (
    <nav className='sticky top-0 z-10 bg-white dark:bg-[#0c1221]'>
      <div className='flex flex-col justify-center items-center  lg:flex-row lg:justify-start py-2 shadow-md  '>

        <div className="logo lg:mx-5">
          <Link href={"/"}><img src="/logo2.png" alt="" /></Link>
        </div>
        <div className="nav">
          <ul className='flex space-x-4 font-bold text-lg md:text-xl'>
            <Link href={"/tshirts"}><li>Tshirts</li></Link>
            <Link href={"/hoodies"}><li>Hoodies</li></Link>
            <Link href={"/stickers"}><li>Stickers</li></Link>
            <Link href={"/mugs"}><li>Mugs</li></Link>
          </ul>
        </div>
        <div className="hidden lg:flex gap-x-2 cart absolute right-0 top-2 mx-5 mt-2 font-bold ">
          {!session &&
            <button onClick={() => { signIn() }} className='bg-pink-600 rounded text-sm text-white p-2'>Login</button>}
          <span onClick={() => { setDropdown(!dropdown) }} onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }}>
            {session &&
              <MdAccountCircle className='text-xl md:text-3xl text-pink-600' />}
            {dropdown &&
              <div className='absolute right-8 bg-pink-300 dark:bg-[#475569] top-7 py-4 rounded-md px-5 w-36'>
                <ul>
                  <Link href={"/myaccount"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>My Account</li></Link>
                  <Link href={"/orders"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Orders</li></Link>
                  <li onClick={handleLogout} className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Logout</li>
                </ul>
              </div>
            }
          </span>

          <button onClick={toggleCart}><AiOutlineShoppingCart className='text-xl md:text-3xl text-pink-600' /></button>


          <button
            onClick={toggleTheme}
            className='text-lg md:text-2xl mx-2'>

            {theme === "light" && loaded &&
              <BsMoonStarsFill className='text-pink-600' />}

            {theme === "dark" && loaded &&
              <BsSunFill className='text-pink-600' />}

          </button>




        </div>



        <div ref={ref} className={`w-72 z-10 h-[100vh] overflow-x-hidden sideCart fixed top-0 bg-pink-100 dark:bg-[#475569] dark:text-gray-100 px-8 py-10 transition-all ${sidebar ? 'right-0' : '-right-96'}`}>
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
      <div className='h-10 w-full fixed bottom-0 z-20 bg-white dark:bg-[#0c1221] shadow-md flex lg:hidden' >
        <div className='text-pink-500 flex items-center justify-center w-1/4'>
          <Link href="/">
            <FaHome className='text-2xl md:text-3xl ' />
          </Link>

        </div>

        <div className='text-pink-500 flex items-center justify-center w-1/4'>
          <AiOutlineSearch className='text-2xl md:text-3xl ' />
        </div>

        <div onClick={toggleCart} className='text-pink-500 flex items-center justify-center w-1/4'>
          <AiOutlineShoppingCart className='text-2xl md:text-3xl ' />
        </div>

        <div className='text-pink-500 flex items-center justify-center w-1/4'>
          <button
            onClick={toggleTheme}
            className='text-xl md:text-2xl'>

            {theme === "light" && loaded &&
              <BsMoonStarsFill className='text-pink-600' />}

            {theme === "dark" && loaded &&
              <BsSunFill className='text-pink-600' />}

          </button>
        </div>


        <div onClick={() => { setDropdown(!dropdown) }} onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }} className='flex items-center justify-center w-1/4'>

          <MdAccountCircle className='text-2xl md:text-3xl text-pink-600' />

          {session && dropdown &&
            <div className='absolute right-3 bg-pink-300 dark:bg-[#475569] bottom-10 py-4 rounded-md px-5 w-36 font-bold'>
              <ul>
                <Link href={"/myaccount"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>My Account</li></Link>
                <Link href={"/orders"}><li className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Orders</li></Link>
                <li onClick={handleLogout} className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Logout</li>
              </ul>
            </div>
          }

          {!session && dropdown &&
            <div className='absolute right-3 bg-pink-300 dark:bg-[#475569] bottom-10 py-4 rounded-md px-5 w-36 font-bold'>
              <ul>
                <li onClick={() => { signIn() }} className='py-1 text-sm hover:text-pink-700 cursor-pointer'>Login</li>

              </ul>
            </div>

          }
        </div>




      </div>
    </nav>
  )
}

export default Navbar
