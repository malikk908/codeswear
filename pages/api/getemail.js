// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import connectDb from "@/middleware/mongoose"
import jwt from "jsonwebtoken";


const handler = async (req, res) => {
    const token = req.body.token;
    const data = jwt.verify(token, process.env.JWT_SECRET)
    let email = data.email

    res.status(200).json({ email })

}

export default handler
