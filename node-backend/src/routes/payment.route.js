import { Router } from "express";
import paytmRoutes from "../payment/paytm/routes/paytmRoutes.js";
import phonepeRoutes from "../payment/phonepay/routes/phonePayRoutes.js";

const route = Router();

route.use("/paytm", paytmRoutes);

route.use("/phonepe", phonepeRoutes);

export default route;
