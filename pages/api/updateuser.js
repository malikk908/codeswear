// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import connectDb from "@/middleware/mongoose"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"


const handler = async (req, res) => {
    const email = req.body.email;
    
        try {           

            let user = await User.findOneAndUpdate({email: email}, {name: req.body.name, address: req.body.address, pincode: req.body.pincode, phone: req.body.phone})                

            res.status(200).json({ success: true })
            
    
        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
            
        } 

    
    return   
   

}

export default connectDb(handler)
