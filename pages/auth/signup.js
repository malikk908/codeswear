import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signIn, getProviders } from 'next-auth/react';
import { useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner';
import Checkmark from '@/components/Checkmark';
import Image from 'next/image';



const Signup = ({providers}) => {

  delete providers.credentials

  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (session) {
      if (session.user.provider === 'google') {
        toast.success("You have successfully logged in!")
        setTimeout(() => {
          router.push("/")
        }, 500)
      }else{
        router.push("/")
      }
    }
  }, [session])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length == 0) {
      toast.error("Password is required")
    } else {

      setLoading(true)

      const data = { name, email, password }
      let res = await fetch(`/api/signup`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      let response = await res.json()

      if (response.success) {

        const res = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        })


        if (res?.error == null) {

          setLoading(false)
          setLoginSuccess(true)

          router.push('/')
          toast.success('Your account has been created & you are logged in!')
          

        } else {

          toast.error('Some Error Occured')
          setLoading(false)

        }


      } else {
        if (response.error.code == 11000) {
          toast.error('Email already exists, please Login to continue')
          setLoading(false)
        } else {
          console.log(response)
          toast.error('Some Error Occured')
          setLoading(false)
        }

      }
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google")
  }


  const handleChange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)

    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
  }


  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="/logo1.png" alt="Your Company" />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up for an account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div className="mt-2">
              <input value={name} onChange={handleChange} id="name" name="name" type="text" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input value={email} onChange={handleChange} id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>

            </div>
            <div className="mt-2">
              <input value={password} onChange={handleChange} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button disabled={loading || loginSuccess} type="submit" className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50">
              Sign Up              
              {loading && <Spinner />}

              {loginSuccess && <Checkmark/>}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <span className='mx-2'>Already a member?</span>
          <Link href="/auth/login" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">Login</Link>
        </p>
        <div className="flex items-center my-5">
          <div className="flex-grow bg bg-gray-300 h-0.5"></div>
          <div className="flex-grow-0 mx-5 text-gray-500">or</div>
          <div className="flex-grow bg bg-gray-300 h-0.5"></div>
        </div>
        {providers &&
          Object.values(providers).map(provider => (
            <button disabled={googleLoading} key={provider.name} onClick={handleGoogle} className="flex items-center w-full rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold leading-6 border border-pink-600 text-pink-600 shadow-sm hover:bg-pink-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50">

              <div className="ml-4">
                <Image width={21} height={21} src='/googleLogo.png' alt='googleLogo' />
              </div>

              <div className="mx-auto flex items-center">
                Sign Up with{' '} {provider.name}

                {googleLoading && <Spinner />}
              </div>

              <div className='w-7 h7'>
              </div>

            </button>
          ))}
      </div>
    </div>
  )
}

export default Signup

export async function getServerSideProps() {
  const providers = await getProviders()


  return {
    props: {
      providers
    },
  }
}
