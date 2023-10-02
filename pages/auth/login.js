import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { signIn, getProviders } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Spinner from '@/components/Spinner';
import Checkmark from '@/components/Checkmark';


const Login = ({ providers }) => {

  delete providers.credentials


  const { data: session } = useSession()


  const router = useRouter()


  useEffect(() => {
    if (session) {
      toast.success("You have successfully logged in!")
      setTimeout(() => {
        router.push("/")
      }, 800)
    }

  }, [session])



  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })


    if (res?.error == null) {

      setLoading(false)
      setLoginSuccess(true)

      toast.success('You have successfully logged in!')
      router.push("/")
         

    } else if (res?.error === 'customErrorToClient') {

      toast.error('Invalid Credentials')
      setLoading(false)

    } else {

      toast.error('Some Error Occured')
      setLoading(false)

    }

  }

  const handleGoogle = async () => {
    await signIn("google")

  }


  const handleChange = (e) => {

    if (e.target.name == 'email') {
      setEmail(e.target.value)

    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
  }


  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <ToastContainer
        position="top-right"
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="/logo1.png" alt="Your Company" />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input value={email} onChange={handleChange} id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div className="text-sm">
                <Link href="/auth/forgot" className="font-semibold text-pink-600 hover:text-pink-500">Forgot password?</Link>
              </div>
            </div>
            <div className="mt-2">
              <input value={password} onChange={handleChange} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button disabled={loading || loginSuccess} type="submit" className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50">
              Login
              {loading && <Spinner />}
              
              {loginSuccess && <Checkmark/>}
              
              
            </button>
          </div>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          <span className='mx-2'>Not a member?</span>
          <Link href="/auth/signup" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">Sign Up</Link>
        </p>
        <hr className=' m-7' />
        {providers &&
          Object.values(providers).map(provider => (
            <button key={provider.name} onClick={handleGoogle} className="flex w-full justify-center rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold leading-6 border border-pink-600 text-pink-600 shadow-sm hover:bg-pink-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ">

              Sign in with{' '} {provider.name}

            </button>
          ))}


      </div>

    </div>
  )
}

export default Login


export async function getServerSideProps() {
  const providers = await getProviders()


  return {
    props: {
      providers
    },
  }
}
