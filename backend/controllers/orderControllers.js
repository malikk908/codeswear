import getRawBody from 'raw-body';
import Order from '@/models/Order';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export const checkoutSession = async (req, res) => {
    if (req.method === 'POST') {
        const items = req.body.items
        const line_items = Object.keys(items).map((k) => {
            return {
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: items[k].name,
                        metadata: {
                            productId: k,
                            size: items[k].size,
                            variant: items[k].variant
                        }
                    },
                    unit_amount: items[k].price * 100,
                },
                quantity: items[k].qty,
            }
        })
        const orderId = req.body.oid;
        const address = req.body.address;


        try {
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({

                line_items: line_items,
                mode: 'payment',
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
                customer_email: req.body.email,
                metadata: { orderId, address }
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

async function getCartItems(line_items) {
    return new Promise((resolve, reject) => {
        let cartItems = [];

        line_items?.data?.forEach(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);
            const productId = product.metadata.productId;
            const size = product.metadata.size;
            const variant = product.metadata.variant;


            cartItems.push({
                productId: productId,
                name: product.name,
                size: size,
                variant: variant,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
            });

            if (cartItems.length === line_items?.data.length) {
                resolve(cartItems);
            }
        });
    });
}

export const webhook = async (req, res) => {
    try {

        const rawBody = await getRawBody(req)
        const signature = req.headers['stripe-signature']

        const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id)

            console.log(line_items);

            const orderItems = await getCartItems(line_items);
            const userEmail = session.customer_email;
            const amountPaid = session.amount_total / 100;
            const orderId = session.metadata.orderId;
            const address = session.metadata.address;

            const paymentInfo = {
                id: session.payment_intent,
                status: session.payment_status,
                amountPaid,
            };

            const orderData = {
                email: userEmail,
                orderId,
                paymentInfo,
                orderItems,
                address

            };

            const order = await Order.create(orderData);
            res.status(201).json({ success: true });
        }

        // check if the cart is tempered with

        // check if the cart items are out of stock



    } catch (error) {
        console.log(error)
    }
}