import React from 'react'
import Link from 'next/link'
import mongoose from "mongoose";
import Product from "@/models/Product"



const Hoodies = ({ products }) => {

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">

            {Object.keys(products).map((item) => {

              return (
                <div key={products[item]._id} className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg">
                  <Link passHref={true} href={`/product/${products[item].slug}`} >
                    <div className="block relative rounded overflow-hidden">
                      <img alt="ecommerce" className="h-[36vh] md:h-[42vh] block m-auto" src={products[item].img} />
                    </div>
                    <div className="mt-4 text-center md:text-left">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{products[item].category}</h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                      <p className="mt-1">Rs {products[item].price}</p>
                      <div className="mt-1">
                        {products[item].size.includes('S') && <span className='border border-gray-300 px-1 mx-1'>S</span>}
                        {products[item].size.includes('M') && <span className='border border-gray-300 px-1 mx-1'>M</span>}
                        {products[item].size.includes('L') && <span className='border border-gray-300 px-1 mx-1'>L</span>}
                        {products[item].size.includes('XL') && <span className='border border-gray-300 px-1 mx-1'>XL</span>}
                        {products[item].size.includes('XXL') && <span className='border border-gray-300 px-1 mx-1'>XXL</span>}
                      </div>
                      <div className="mt-1">
                        {products[item].color.includes('blue') && <button className='border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                        {products[item].color.includes('red') && <button className='border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                        {products[item].color.includes('yellow') && <button className='border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                        {products[item].color.includes('purple') && <button className='border-2 border-gray-300 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                        {products[item].color.includes('green') && <button className='border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


export const getServerSideProps = async (context) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)

  }
  let products = await Product.find({ category: 'hoodies' })
  let hoodies = {}

  for (let item of products) {
    if (item.title in hoodies) {
      if (!hoodies[item.title].color.includes(item.color) && item.availableQty > 0) {
        hoodies[item.title].color.push(item.color)
      }
      if (!hoodies[item.title].size.includes(item.size) && item.availableQty > 0) {
        hoodies[item.title].size.push(item.size)
      }

    }
    else {
      hoodies[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        hoodies[item.title].color = [item.color]
        hoodies[item.title].size = [item.size]

      }
    }
  }

  return {
    props: { products: JSON.parse(JSON.stringify(hoodies)) }
  }
}

export default Hoodies
