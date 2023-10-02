// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import connectDb from "@/middleware/mongoose"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"


const handler = async (req, res) => {
    const email = req.body.email;
    
        try {            

            let user = await User.findOne({email: email})

            const {name, address, phone, pincode} = user
            

            res.status(200).json({ name, address, phone, pincode })
    
        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
            
        }      
  
       
   

}

export default connectDb(handler)
