// import getRawBody from 'raw-body';

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const items = req.body.items
//     const line_items = Object.keys(items).map((k) => {
//       return {
//         price_data: {
//           currency: "pkr",
//           product_data: {
//             name: items[k].name
//           },
//           unit_amount: items[k].price * 100,
//         },
//         quantity: items[k].qty,      
//       }
//     })
//     try {
//       // Create Checkout Sessions from body params.
//       const session = await stripe.checkout.sessions.create({
//         // line_items: [
//         //   {
//         //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         //     price: 'price_1NifBWFTFDaLpcKq3QIueL7h',
//         //     quantity: 1,
//         //   },
//         // ],
//         line_items: line_items,
//         mode: 'payment',
//         success_url: `${req.headers.origin}/?success=true`,
//         cancel_url: `${req.headers.origin}/?canceled=true`,
//       });
//       // res.redirect(303, session.url);
//       res.status(200).json({
//         url: session.url
//       })
//     } catch (err) {
//       res.status(err.statusCode || 500).json(err.message);
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }

// export const webhook = async (req, res) => {
//   try {

//     const rawBody = await getRawBody(req)
//     const signature = req.headers['stripe-signature']

//     const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)

//     if(event.type === 'checkout.session.completed'){
//       const session = event.data.object;

//       const line_items = await stripe.checkout.sessions.listLineItems(session.id)

//       console.log(line_items);
//     }

//   } catch (error) {
//     console.log(error)
//   }
// }