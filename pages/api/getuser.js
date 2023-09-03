// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import connectDb from "@/middleware/mongoose"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
import jwt from "jsonwebtoken";


const handler = async (req, res) => {
    const token = req.body.token;
    if(token){
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            let email = data.email

            let user = await User.findOne({email: email})

            const {name, address, phone, pincode} = user
            

            res.status(200).json({ name, email, address, phone, pincode })
    
        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
            
        } 

    }
    return   
   

}

export default connectDb(handler)
