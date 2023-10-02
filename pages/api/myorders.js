// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Order from "@/models/Order"
import connectDb from "@/middleware/mongoose"


const handler = async (req, res) => {
    const email = req.body.email;
    let orders = await Order.find({email: email})

    res.status(200).json({ orders})


}

export default connectDb(handler)
