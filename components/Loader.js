import React, { useEffect } from 'react'

function Loader() {

    useEffect(() => {

        window.scrollTo(0, 0); // Scroll to the top of the page

    }, []);

    return (
        <div className='h-screen flex items-start justify-center mt-4'>

            <img src='loader.svg' alt='Loading...'></img>

        </div>
    )
}

export default Loader
