import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import Head from 'next/head'
import { useState, useEffect } from 'react'


export default function App({ Component, pageProps }) {

  const [cart, setCart] = useState({})
  const[subTotal, setSubTotal] = useState(0)



  useEffect(()=>{
    try {
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }      
    } catch (error) {
      console.error(error)
      localStorage.clear()
    }
    
  }, [])


  const saveCart = (myCart)=>{
    localStorage.setItem("cart", JSON.stringify(myCart))
    let subt = 0;
    let keys = Object.keys(myCart)
    for (let i = 0; i<keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
           
    }
    setSubTotal(subt)
  }

  const addToCart = (itemCode, qty, price, name, size, variant)=>{
    let newCart = cart;
    if(itemCode in cart){
      newCart[itemCode].qty = newCart[itemCode].qty + qty

    }else{
      newCart[itemCode] = {qty:1, price, name, size, variant}
    }
    setCart(newCart)
    saveCart(newCart)
    
  }

  const removeFromCart = (itemCode, qty)=>{
    let newCart = cart;
    if(itemCode in cart){
      newCart[itemCode].qty = newCart[itemCode].qty - qty

    }if(newCart[itemCode].qty <= 0){
      delete newCart[itemCode]
    }
    setCart(newCart)
    saveCart(newCart)
    
  }

  const clearCart = ()=>{
    setCart({})
    saveCart({})
  }



  return <>

  <Head>
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
  </Head>


  <Navbar key={subTotal} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />
  
  <Component cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
  
  <Footer/>

  </>
}
