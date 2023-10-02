import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { userDB } from '@/middleware/userDB'
import User from '@/models/User'


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'email'
        },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials, req) {

        const res = await fetch(process.env.NEXT_PUBLIC_HOST + `/api/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const response = await res.json()

        const user = response.user

        // If no error and we have user data, return it
        if (res.ok && user) {

          return user

        }else if(response.error){
          return { error: 'customError' }
        }
        // Return null if user data could not be retrieved
        return null

      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      
        if (user?.provider) {
          token.provider = user.provider
        }
        if (user?.role){
          token.role = user.role
        }     

      return token
    },
    async session({ session, token }) {

      if(token?.provider){
        session.user.provider = token.provider;
      }           

      if (session?.user){
        session.user.role = token.role        
      } 


      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      //to handle errors for credentials sign-in      
      if(account.provider ==='credentials' && user?.error === 'customError') {
         throw new Error('customErrorToClient')
      }

      if(account.provider ==='google') {
        try {
          await userDB()
          const userExist = await User.findOne({email: profile.email})
          if(userExist){
            user.role = userExist.role
            
          }          

          if(!userExist){

            let u = new User( {name: profile.name, email: profile.email, image: profile.picture } )
            await u.save()
            user.role = u.role            

          }

        } catch (error) {
          console.log(error)
          return false          
        }
     }

     return true

   }
  }

})