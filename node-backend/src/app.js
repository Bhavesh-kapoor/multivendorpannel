import express from 'express';
import authenticationRoute from './routes/auth.route.js';
import { index } from './controllers/admin/dashboard.controller.js';
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));




// AUTH ROUTES 
app.use('/auth',authenticationRoute);
app.get('/admin/dashboard',index)






export default app;