// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const handler = async (req, res) => {
    if (req.method == 'GET') {
        try {
            const {sessionId} = req.query

            const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent', 'line_items.data.price.product']
            })

            return res.status(200).json(checkoutSession)
            
        } catch (error) {
            console.log(error)
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
    }

}

export default handler
