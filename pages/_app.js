import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'



export default function App({ Component, pageProps }) {

  const [progress, setProgress] = useState(0)

  const [cart, setCart] = useState({})
  const[subTotal, setSubTotal] = useState(0)
  const [user, setUser] = useState({value: null})
  const [key, setKey] = useState()


  const router = useRouter()



  useEffect(()=>{
    router.events.on('routeChangeStart', ()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100)
    })
    try {
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }      
    } catch (error) {
      console.error(error)
      localStorage.clear()
    }

    const token = localStorage.getItem('token')
    if(token){
      setUser({value: token})
      
    }

    setKey(Math.random())
    
  }, [router.query])

  const logout = ()=>{
    localStorage.removeItem('token')    
    setUser({value:null})
    setKey(Math.random())
    toast.success('You have been logged out successfully!')
    router.push('/')
  }


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

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let newCart = {}
    newCart[itemCode] = {qty:1, price, name, size, variant}
    setCart(newCart)
    saveCart(newCart)
    router.push('/checkout')

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
    toast.info('Your cart has been cleared!')
  }

  const clearCartAfterCheckout = ()=>{
    setCart({})
    saveCart({})   
  }



  return <>

  <Head>
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
  </Head>

  <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  

  {key && <Navbar logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}

  <LoadingBar
        color='#ff2d55'
        progress={progress}
        height={4}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
  
  <Component user={user} cart={cart} addToCart={addToCart} buyNow={buyNow} removeFromCart={removeFromCart} clearCart={clearCart} clearCartAfterCheckout={clearCartAfterCheckout} subTotal={subTotal} {...pageProps} />
  
  <Footer/>

  </>
}
