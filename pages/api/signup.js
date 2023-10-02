// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");


const handler = async (req, res) => {
    if (req.method == 'POST') {
        try {

            const { name, email } = req.body

            let u = new User({ name, email, password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTOJS_SECRET).toString() })
            await u.save()            

            res.status(200).json({ success: true })

        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }

}

export default connectDb(handler)
