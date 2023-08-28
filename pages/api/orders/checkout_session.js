import { createRouter } from "next-connect";
import connectDb from "@/middleware/mongoose";

import { checkoutSession } from "@/backend/controllers/orderControllers";


const router = createRouter();

connectDb()


router.post(checkoutSession);



export default router.handler();