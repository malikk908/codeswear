import { createRouter } from "next-connect";
import connectDb from "@/middleware/mongoose";
import { webhook } from "@/backend/controllers/orderControllers";


const router = createRouter();

connectDb();

export const config = {
    api: {
      bodyParser: false,
    },
  };


router.post(webhook);


export default router.handler();