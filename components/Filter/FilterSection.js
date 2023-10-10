import React, { useState } from 'react'
import Slider from '@mui/material/Slider';
import { AiOutlineClear } from 'react-icons/ai';




const FilterSection = ({ handleCheckboxChange, selectedFilters, handleChange, priceRange, setShowSidebar, clearFilters }) => {




    return (
        <>

            <h1 className='my-5 text-lg font-bold'>Filters:</h1>

            <div>
                <h2 className='mb-3 text-base font-semibold'>Colors</h2>
                <div className='text-sm'>
                    <input onChange={e => handleCheckboxChange(e, 'colors')} type="checkbox" id="red" name="red" value="red" checked={selectedFilters.colors.includes('red')} />
                    <label htmlFor="red"> Red</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'colors')} type="checkbox" id="yellow" name="yellow" value="yellow" checked={selectedFilters.colors.includes('yellow')} />
                    <label htmlFor="yellow"> Yellow</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'colors')} type="checkbox" id="purple" name="purple" value="purple" checked={selectedFilters.colors.includes('purple')} />
                    <label htmlFor="purple"> Purple</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'colors')} type="checkbox" id="blue" name="blue" value="blue" checked={selectedFilters.colors.includes('blue')} />
                    <label htmlFor="blue"> Blue</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'colors')} type="checkbox" id="green" name="green" value="green" checked={selectedFilters.colors.includes('green')} />
                    <label htmlFor="green"> Green</label><br /><br />
                </div>
            </div>

            <div>
                <h2 className='mb-3 text-base font-semibold'>Size</h2>
                <div className='text-sm'>
                    <input onChange={e => handleCheckboxChange(e, 'sizes')} type="checkbox" id="S" name="S" value="S" checked={selectedFilters.sizes.includes('S')} />
                    <label htmlFor="S"> Small</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'sizes')} type="checkbox" id="M" name="M" value="M" checked={selectedFilters.sizes.includes('M')} />
                    <label htmlFor="M"> Medium</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'sizes')} type="checkbox" id="L" name="L" value="L" checked={selectedFilters.sizes.includes('L')} />
                    <label htmlFor="L"> Large</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'sizes')} type="checkbox" id="XL" name="XL" value="XL" checked={selectedFilters.sizes.includes('XL')} />
                    <label htmlFor="XL"> XL</label><br />
                    <input onChange={e => handleCheckboxChange(e, 'sizes')} type="checkbox" id="XXL" name="XXL" value="XXL" checked={selectedFilters.sizes.includes('XXL')} />
                    <label htmlFor="XXL"> XXL</label><br /><br />
                </div>
            </div>

            <div className='flex flex-col items-center w-40 px-5'>
                <h2 className='mb-3 text-base font-semibold'>Price</h2>

                <div className='flex justify-between w-full text-xs'>
                    <span className='w-5'>Min: {priceRange[0]}</span>
                    <span className='w-5'>Max: {priceRange[1]}</span>
                </div>

                <Slider
                    value={priceRange}
                    onChange={handleChange}
                    min={300}
                    step={50}
                    max={2500}
                    valueLabelDisplay="auto"
                    aria-labelledby='range-slider'
                    disableSwap
                    style={{ width: '100%' }}
                />

            </div>

            <div className='md:hidden my-3'>
            <button onClick={()=>{setShowSidebar(false)}} className={`flex mr-2 text-white bg-pink-500 disabled:opacity-60 border-0 py-2 px-2 focus:outline-none rounded text-sm`}>Apply Filters</button>
            </div>

            <button
                className='flex items-center justify-between p-1 w-auto bg-transparent text-black my-3 ;'
                onClick={clearFilters}
                
              >
                <AiOutlineClear className='mr-2' />
                <span className='text-decoration-line: underline'>Clear Filters</span>
              </button>
        </>


    )
}

export default FilterSection