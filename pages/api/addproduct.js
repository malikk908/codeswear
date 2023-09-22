// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Product from "@/models/Product"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    try {
        if (req.method == 'POST') {
            console.log(req.body)
            
                let p = new Product({
                    title: req.body.title,
                    desc: req.body.description,
                    slug: req.body.slug,                
                    img: req.body.image,
                    category: req.body.category,
                    size: req.body?.size,
                    color: req.body?.color,
                    price: req.body.price,
                    availableQty: req.body.quantity
                })
                await p.save()
            
            res.status(200).json({ success: true, message: 'Product added successfully' })
    
        }
        else {
            res.status(400).json({ error: "This method is not allowed" })
        }
        
    } catch (error) {
        console.log(error)
        res.status(401).json(error)

    }
    

}

export default connectDb(handler)
