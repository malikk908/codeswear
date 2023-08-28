const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    email: {type: String, required: true},
    orderId: {type: String, required: true},
    paymentInfo: {
        id: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },        
        amountPaid: {
          type: Number,
          required: true,
        },
      },
      orderItems: [
        {
          productId: {
            type: String,
            required: true,            
          },
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: String,
            required: true,
          },          
          price: {
            type: String,
            required: true,
          },
        },
      ],
    address: {type: String, required: true},
    status: {type: String, default: 'Processing'},

  }, {timestamps:true});

  export default mongoose.models.Order || mongoose.model("Order", OrderSchema);