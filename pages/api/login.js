// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");


const handler = async (req, res) => {
    if (req.method == 'POST') {
        console.log(req.body)
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            let encryptedPass = CryptoJS.AES.decrypt(user.password, 'secret123');
            let originalPass = encryptedPass.toString(CryptoJS.enc.Utf8);

            if (req.body.email == user.email && req.body.password == originalPass) {
                res.status(200).json({ success: true, name: user.name, email: user.email })

            } else {
                res.status(200).json({ success: false, error: 'Invalid Credentials' })

            }


        } else {
            res.status(200).json({ success: false, error: 'User Not Found' })
        }


    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }

}

export default connectDb(handler)
