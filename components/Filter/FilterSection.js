import React, { useState } from 'react'
import Slider from '@mui/material/Slider';




const FilterSection = ({ handleCheckboxChange, selectedFilters, handleChange, priceRange }) => {

    


    return (
        <div className='h-full w-1/4 sticky top-24 border flex flex-col items-center pb-10'>
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

            <div className='flex flex-col items-center w-40'>
                <h2 className='mb-3 text-base font-semibold'>Price</h2>                
                
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

        </div>
    )
}

export default FilterSection