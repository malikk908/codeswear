const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const items = req.body.items
    console.log(items)
    const line_items = Object.keys(items).map((k) => {
      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: items[k].name
          },
          unit_amount: items[k].price * 100,
        },
        quantity: items[k].qty,      
      }
    })
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // line_items: [
        //   {
        //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //     price: 'price_1NifBWFTFDaLpcKq3QIueL7h',
        //     quantity: 1,
        //   },
        // ],
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      // res.redirect(303, session.url);
      res.status(200).json({
        url: session.url
      })
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}