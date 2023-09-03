import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Orders = () => {

  const router = useRouter();

  const [orders, setOrders] = useState([])


  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.post(
        `/api/myorders`,
        {
          token: localStorage.getItem('token')
        }
      );

      setOrders(data.orders)

    }

    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
    else {
      fetchOrders()
    }

  }, [])






  return (
    <div className='min-h-screen'>
      <div className='container mx-auto'>
        <h1 className='text-center text-2xl font-semibold  my-5'>My Orders</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-center text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-400">
                    <tr>
                      <th scope="col" className="px-6 py-4">Order ID</th>
                      <th scope="col" className="px-6 py-4">Email</th>
                      <th scope="col" className="px-6 py-4">Amount</th>
                      <th scope="col" className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((k) => {
                      return <tr key={k._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-400 dark:hover:bg-neutral-300">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{k.orderId}</td>
                        <td className="whitespace-nowrap px-6 py-4">{k.email}</td>
                        <td className="whitespace-nowrap px-6 py-4">{k.paymentInfo.amountPaid}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link href={`/order?id=` + k._id}> Details </Link>
                        </td>
                      </tr>
                    })}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Orders
