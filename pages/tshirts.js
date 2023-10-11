import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import mongoose from "mongoose";
import Product from "@/models/Product"
import FilterSection from '@/components/Filter/FilterSection';
import { BsFilterLeft } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io'



const Tshirts = ({ products }) => {

  const productsArray = Object.values(products);

  const minRange = 600
  const maxRange = 2000

  const [priceRange, setPriceRange] = useState([minRange, maxRange]);
  const [showSidebar, setShowSidebar] = useState(false);



  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    sizes: [],
  });

  const [filteredProducts, setFilteredProducts] = useState(productsArray)

  useEffect(() => {
    setFilteredProducts(filteredData(productsArray, selectedFilters, priceRange));
  }, [selectedFilters, priceRange]);



  const handleCheckboxChange = (event, type) => {
    const { name, checked } = event.target;

    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [type]: checked
        ? [...prevFilters[type], name]
        : prevFilters[type].filter(item => item !== name),
    }));
  };

  const minDistance = 50;

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceRange([Math.min(newValue[0], priceRange[1] - minDistance), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(newValue[1], priceRange[0] + minDistance)]);
    }
  };

  const clearFilters = () => {

    setSelectedFilters({
      colors: [],
      sizes: [],
    });

    setPriceRange([minRange, maxRange])

  }


  function filteredData(products, selectedFilters, priceRange) {
    const { colors, sizes } = selectedFilters;

    let filteredProducts = products;

    // Filter by colors and sizes
    if (colors.length > 0 || sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const { color, size } = product;

        return (
          colors.every(selectedColor => color.includes(selectedColor)) &&
          sizes.every(selectedSize => size.includes(selectedSize))
        );
      });
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(product => {
      const price = parseFloat(product.price);
      const min = priceRange[0];
      const max = priceRange[1];

      return price >= min && price <= max;
    });

    return filteredProducts;
  }



  return (
    <>
      <div className='flex'>

        <div className={`bg-pink-100 h-full w-64 fixed top-0 z-30 overflow-x-hidden transition-all duration-300 ${showSidebar ? 'right-0' : '-right-96'}`}>
          <button
            className='absolute top-3 right-3 text-2xl'
            onClick={() => setShowSidebar(false)}
          >
            <AiFillCloseCircle className='text-pink-500' />
          </button>
          <div className="flex flex-col items-start ml-10 mr-10">

            <FilterSection
              handleCheckboxChange={handleCheckboxChange}
              selectedFilters={selectedFilters}
              handleChange={handleChange}
              priceRange={priceRange}
              setShowSidebar={setShowSidebar}
              clearFilters={clearFilters}
            />

          </div>
        </div>


        <div className="hidden md:flex flex-col items-center h-full sticky top-24 border rounded-md ml-3 pb-10">
          <FilterSection
            handleCheckboxChange={handleCheckboxChange}
            selectedFilters={selectedFilters}
            handleChange={handleChange}
            priceRange={priceRange}
            setShowSidebar={setShowSidebar}
            clearFilters={clearFilters}
          />
        </div>

        <section className="text-gray-600 body-font w-full">

          <div className="container px-5 py-7 mx-auto">
            <h1 className='text-3xl font-extrabold mb-5'>Tshirts</h1>
            <div className='md:hidden mb-3'>
              <button
                className='flex items-center justify-between p-1 w-auto bg-white text-black ;'
                onClick={() => setShowSidebar(true)}
              >
                <BsFilterLeft className='mr-2 text-2xl' />
                <span className='font-semibold'>Apply Filters</span>
              </button>

              {(selectedFilters.colors.length > 0 ||
              selectedFilters.sizes.length > 0 ||
              priceRange[0] !== minRange ||
              priceRange[1] !== maxRange) &&

                <button
                  className='flex items-center justify-between w-auto bg-transparent text-black border rounded-full border-zinc-300 px-2 my-1'
                  onClick={clearFilters}

                >
                  <span className='text-xs'>Clear</span>
                  <IoIosClose className='ml-1 w-4 h-4' />
                </button>}


            </div>

            <div className="flex flex-wrap -m-4">

              {filteredProducts.length === 0 &&

                <span className='mx-auto mt-3 md:m-5 font-semibold'> No Products Found</span>

              }

              {filteredProducts?.map((product) => {

                return (
                  <div key={product._id} className="lg:w-1/4 md:w-1/3 p-4 w-1/2 shadow-lg">
                    <Link passHref={true} href={`/product/${product.slug}`} >
                      <div className="block relative rounded overflow-hidden">
                        <img alt="ecommerce" className="h-[36vh] md:h-[42vh] block m-auto" src={product.img} />
                      </div>
                      <div className="mt-4 text-center md:text-left">
                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{product.category}</h3>
                        <h2 className="text-gray-900 title-font text-lg font-medium">{product.title}</h2>
                        <p className="mt-1">Rs {product.price}</p>
                        <div className="mt-1">
                          {product.size.includes('S') && <span className='border border-gray-300 px-1 mx-1'>S</span>}
                          {product.size.includes('M') && <span className='border border-gray-300 px-1 mx-1'>M</span>}
                          {product.size.includes('L') && <span className='border border-gray-300 px-1 mx-1'>L</span>}
                          {product.size.includes('XL') && <span className='border border-gray-300 px-1 mx-1'>XL</span>}
                          {product.size.includes('XXL') && <span className='border border-gray-300 px-1 mx-1'>XXL</span>}
                        </div>
                        <div className="mt-1">
                          {product.color.includes('blue') && <button className='border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                          {product.color.includes('red') && <button className='border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                          {product.color.includes('yellow') && <button className='border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                          {product.color.includes('purple') && <button className='border-2 border-gray-300 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                          {product.color.includes('green') && <button className='border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none'></button>}
                        </div>
                      </div>
                    </Link>
                  </div>

                )
              })}
            </div>
          </div>
        </section >

      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)

  }
  let products = await Product.find({ category: 'tshirt' })
  let tshirts = {}

  for (let item of products) {
    if (item.title in tshirts) {
      if (!tshirts[item.title].color.includes(item.color) && item.availableQty > 0) {
        tshirts[item.title].color.push(item.color)
      }
      if (!tshirts[item.title].size.includes(item.size) && item.availableQty > 0) {
        tshirts[item.title].size.push(item.size)
      }

    }
    else {
      tshirts[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        tshirts[item.title].color = [item.color]
        tshirts[item.title].size = [item.size]
      }
      else {
        tshirts[item.title].color = []
        tshirts[item.title].size = []
      }
    }
  }


  return {
    props: { products: JSON.parse(JSON.stringify(tshirts)) }
  }
}

export default Tshirts
