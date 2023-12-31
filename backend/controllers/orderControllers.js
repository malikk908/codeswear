import getRawBody from 'raw-body';
import Order from '@/models/Order';
import Product from '@/models/Product';
import pincodes from '../../pincodes.json'


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

        //check pincode serviceablitiyty
        if(!Object.keys(pincodes).includes(req.body.pincode)){
            res.status(400).json({success: false, dontClearCart: true, "error":"Sorry, your pincode is not serviceable"})
            return
        }
        

        //check cart tempering, OOS check

        let product, sumTotal=0
        if(req.body.subTotal <= 0){
            res.status(400).json({success: false, "error":"Your cart is empty, please build your cart & try again"})
            return
        }
        for(let i in items){
            sumTotal += items[i].price * items[i].qty
            product = await Product.findOne({slug: i})
            if(product.availableQty < items[i].qty){
                res.status(400).json({success: false, "error":"Some items in your cart have gone out of stock. Your cart has been cleared, please try again"})
                return
            }
            if(product.price != items[i].price){
                res.status(400).json({success: false, "error":"The price of some items in your cart has changed. Your cart has been cleared, please try again"})
                return
            }
        }
        if(sumTotal !== req.body.subTotal){
            res.status(400).json({success: false, "error":"The price of some items in your cart has changed, please clear cart & try again"})
            return
        }


        if(req.body.phone.length !== 10){
            res.status(400).json({success: false, dontClearCart: true, "error":"Please enter your 10 digit phone number"})
            
            return
        }

        if(req.body.pincode.length !== 6){
            res.status(400).json({success: false, dontClearCart: true, "error":"Please enter your 6 digit pincode"})
            return
        }


        try {
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({

                line_items: line_items,
                mode: 'payment',
                // success_url: `${req.headers.origin}/?success=true`,
                success_url: `${req.headers.origin}/ordersuccess?sessionId={CHECKOUT_SESSION_ID}`,
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

            let products = order.orderItems

            for(let i = 0; i < products.length; i++){
                await Product.findOneAndUpdate({slug: products[i].productId}, {$inc :{"availableQty": - products[i].quantity }})
            }


            res.status(201).json({ success: true });
            
        }


    } catch (error) {
        console.log(error)
    }
}