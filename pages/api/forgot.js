// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Forgot from "@/models/Forgot"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {

    //Check if the user exists in database

    //send email to the user

    if (req.body.sendMail) {

        let token = `123`

        let forgot = new Forgot({
            email: req.body.email,
            token: token
        })
        await forgot.save()

        let email = `We have sent you this email in response to your request to reset your password on Codeswear/com.

  <br/><br/>

  To reset your password, please follow the link below:

  <a href="https://codeswear.com/forgot?token=${token}">Click here to reset your password</a>

  <br/><br/>

  We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by going to your My Account Page.

  <br/><br/>`

        res.status(200).json({ success: true, token })


    } else {
        //Reset password

        try {

            // let email = req.body.email
            let password = req.body.password
            let token = req.body.token

            try {
                let forgot = await Forgot.findOne({ token: token })

                await User.findOneAndUpdate({ email: forgot.email }, { password: CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET).toString() })

                res.status(200).json({ success: true, message: 'Password updated successfully' })

            } catch (error) {
                res.status(400).json({ success: false, message: 'Session Expired, try again' })

            }


        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
        }

    }

}

export default connectDb(handler)

