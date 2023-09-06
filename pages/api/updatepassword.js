// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import connectDb from "@/middleware/mongoose"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
import jwt from "jsonwebtoken";
var CryptoJS = require("crypto-js");


const handler = async (req, res) => {
    const token = req.body.token;
    if (token) {
        try {

            const data = jwt.verify(token, process.env.JWT_SECRET)
            let email = data.email

            let user = await User.findOne({ email: email })

            if (user) {

                let encryptedPass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET);
                let originalPass = encryptedPass.toString(CryptoJS.enc.Utf8);

                if (req.body.epassword === originalPass) {
                    await User.findOneAndUpdate({ email: email }, { password: CryptoJS.AES.encrypt(req.body.npassword, process.env.CRYPTOJS_SECRET).toString() })

                    res.status(200).json({ success: true })
                } else {
                    res.status(400).json({ success: false, error: 'Incorrect Password' })
                }

            } else {
                res.status(400).json({ success: false, error: 'User Not Found' })
            }

        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
        }
    }
    return

}

export default connectDb(handler)
