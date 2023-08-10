import Link from 'next/link'
import React from 'react'
import { AiOutlineShoppingCart, AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import {BsFillBagCheckFill} from 'react-icons/bs';
import { useRef } from 'react';


const Navbar = () => {

  const ref = useRef()


  const toggleCart = () => {
    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full')
      ref.current.classList.add('translate-x-0')
    } else if (!ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-0')
      ref.current.classList.add('translate-x-full')
    }

  }


  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md'>
      <div className="logo mx-5">
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
      <div onClick={toggleCart} className="cart absolute right-0 top-2 mx-5 font-bold">
        <button><AiOutlineShoppingCart className='text-xl md:text-3xl' /></button>
      </div>
      <div ref={ref} className='w-72 z-10 h-full sideCart absolute top-0 right-0 bg-pink-100 px-8 py-10 transform transition-transform translate-x-full'>
        <h2 className='font-bold text-l text-center'>Shopping Cart</h2>
        <span className='absolute top-3 right-3 cursor-pointer text-pink-500 text-2xl' onClick={toggleCart}><AiFillCloseCircle /></span>
        <ol className='list-decimal'>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          <li className='my-3'>
            <div className="item flex">
              <div className='font-semibold w-2/3'>Tshirt - Wear the code</div>
              <div className='flex items-center justify-center w-1/3 text-lg'>
                <AiFillMinusCircle className='cursor-pointer text-pink-500'/><span className='mx-2'> 1 </span><AiFillPlusCircle className='cursor-pointer text-pink-500'/></div>
            </div>
          </li>
          
          
        </ol>
        <div className="flex">

        <button class="flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"> <BsFillBagCheckFill className='m-1 mr-3'/> Checkout</button>
        <button class="flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm">Clear Cart</button>

        </div>
        
      </div>

    </div>
  )
}

export default Navbar
