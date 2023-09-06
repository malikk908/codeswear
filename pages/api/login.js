// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');


const handler = async (req, res) => {
    if (req.method == 'POST') {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            let encryptedPass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET);
            let originalPass = encryptedPass.toString(CryptoJS.enc.Utf8);

            if (req.body.email == user.email && req.body.password == originalPass) {
                var token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

                res.status(200).json({ success: true, token })

            } else {
                res.status(200).json({ success: false, error: 'Invalid Credentials' })

            }


        } else {
            res.status(400).json({ success: false, error: 'User Not Found' })
        }


    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }

}

export default connectDb(handler)
