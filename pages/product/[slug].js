import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import mongoose from "mongoose";
import Error from 'next/error'

import Product from "@/models/Product"
import 'react-toastify/dist/ReactToastify.css';


export default function ProductPage({ addToCart, buyNow, product, variants, error }) {

  const router = useRouter()
  const { slug } = router.query
  const [pin, setPin] = useState("")
  const [service, setService] = useState()

  const checkServiceability = async () => {
    let pins = await fetch(`/api/pincode`)
    let pinJson = await pins.json()
    
    if (Object.keys(pinJson).includes(pin)) {
      setService(true)
      // toast.success('Your Pincode is serviceable!')
    } else {
      setService(false)
      // toast.error('Sorry! Pincode NOT serviceable!')

    }

  }

  const onChangePin = (e) => {
    setPin(e.target.value)

  }

  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState(product.size)

  useEffect(() => {
    if (!error) {
      setColor(product.color)
      setSize(product.size)
    }

  }, [router.query])



  const refreshVariant = (newsize, newcolor) => {


    if(!Object.keys(variants[newcolor]).includes(newsize)){
      newsize = Object.keys(variants[newcolor])[0]
    }

    let url = `/product/${variants[newcolor][newsize]['slug']}`
    router.push(url);
  }

  if (error == 404) {
    return <Error statusCode={404} />
  }



  return <>
    <section className="text-gray-600 body-font overflow-hidden dark:text-gray-300">
      {/* <ToastContainer
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
      /> */}

      <div className="container px-8 py-14 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto px-20 object-cover object-top rounded" src={product.img} />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 dark:text-gray-400 tracking-widest">CodesWear</h2>
            <h1 className="text-gray-900 dark:text-gray-300 text-3xl title-font font-medium mb-1">{product.title} ({product.size} / {product.color})</h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400 ml-3">4 Reviews</span>
              </span>
              
            </div>
            <p className="leading-relaxed">{product.desc}</p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex">
                <span className="mr-3">Color</span>

                {Object.keys(variants).includes('blue') && 
                <button onClick={() => { refreshVariant(size, 'blue') }} className={`border-2 ml-1 bg-blue-500  rounded-full w-6 h-6 focus:outline-none ${color == 'blue' ? 'border-pink-400' : 'border-gray-300'}`}></button>}

                {Object.keys(variants).includes('red') && 
                <button onClick={() => { refreshVariant(size, 'red') }} className={`border-2 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none ${color === 'red' ? 'border-pink-400' : 'border-gray-300'}`}></button>}

                {Object.keys(variants).includes('yellow') && 
                <button onClick={() => { refreshVariant(size, 'yellow') }} className={`border-2 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none ${color === 'yellow' ? 'border-pink-400' : 'border-gray-300'}`}></button>}
                {Object.keys(variants).includes('purple') && 
                <button onClick={() => { refreshVariant(size, 'purple') }} className={`border-2 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none ${color === 'purple' ? 'border-pink-400' : 'border-gray-300'}`}></button>}
                {Object.keys(variants).includes('green') && 
                <button onClick={() => { refreshVariant(size, 'green') }} className={`border-2 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none ${color === 'green' ? 'border-pink-400' : 'border-gray-300'}`}></button>}

              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <div className="relative">
                  <select value={size} onChange={(e) => { refreshVariant(e.target.value, color) }} className="rounded border appearance-none border-gray-300 dark:bg-[#0f172a] py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10">
                    {color && Object.keys(variants[color]).includes('S') && <option value={'S'}>S</option>}
                    {color && Object.keys(variants[color]).includes('M') && <option value={'M'}>M</option>}
                    {color && Object.keys(variants[color]).includes('L') && <option value={'L'}>L</option>}
                    {color && Object.keys(variants[color]).includes('XL') && <option value={'XL'}>XL</option>}
                    {color && Object.keys(variants[color]).includes('XXL') && <option value={'XXL'}>XXL</option>}
                  </select>
                  <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {product.availableQty <= 0 && <span className="title-font font-medium text-xl text-gray-900 dark:text-gray-200">Out of Stock</span>}
              {product.availableQty > 0 && <span className="title-font font-medium text-xl text-gray-900 dark:text-gray-200">Rs. {product.price}</span>}
              <button disabled={product.availableQty <= 0} onClick={() => { addToCart(slug, 1, product.price, product.title, product.size, product.color) }} className={`flex ml-7 text-white bg-pink-500 disabled:opacity-60 border-0  py-2 px-3 text-sm md:px-6 focus:outline-none ${!product.availableQty <= 0 && `hover:bg-pink-600`} rounded`}>Add to Cart</button>
              <button disabled={product.availableQty <= 0} onClick={() => { buyNow(slug, 1, product.price, product.title, product.size, product.color) }} className={`flex ml-4 text-white bg-pink-500 disabled:opacity-60 border-0 py-2 px-3 text-sm md:px-6 focus:outline-none ${!product.availableQty <= 0 && `hover:bg-pink-600`} rounded`}>Buy Now</button>
              
            </div>
            <div className="pin mt-5 flex space-x-2 text-sm">
              <input onChange={onChangePin} className='flex mx-1 px-3 py-2 border-gray-400 border-2 rounded-md dark:bg-[#0f172a]' type="number" placeholder='Enter your Pincode' />
              <button onClick={checkServiceability} className={`mx-1 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded ${pin == "" ? "cursor-not-allowed" : ""}`} disabled={pin == ""}>Check</button>
            </div>
            {(!service && service != null) && <div className='text-red-700 text-sm mt-3'>Sorry! We do not deliver to this pincode yet</div>}
            {(service && service != null) && <div className='text-green-700 text-sm mt-3'>Yay! The pincode is serviceable</div>}
          </div>
        </div>
      </div>
    </section>
  </>
}

export const getServerSideProps = async (context) => {

  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)

  }
  let product = await Product.findOne({ slug: context.query.slug })
  if (product == null) {
    return {
      props: { error: 404 }
    }
  }
  let variants = await Product.find({ title: product.title, category: product.category })
  let ColorSizeSlug = {} // {red: {xl: {slug: 'wear-the-code'}}}
  for (let item of variants) {
    if (Object.keys(ColorSizeSlug).includes(item.color)) {
      ColorSizeSlug[item.color][item.size] = { slug: item.slug }

    }
    else {
      ColorSizeSlug[item.color] = {}
      ColorSizeSlug[item.color][item.size] = { slug: item.slug }
    }
  }

  return {
    props: { product: JSON.parse(JSON.stringify(product)), variants: JSON.parse(JSON.stringify(ColorSizeSlug))}
  }
}