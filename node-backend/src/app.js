import express from 'express';
import authenticationRoute from './routes/auth.route.js';
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));




// AUTH ROUTES 
app.use('/auth',authenticationRoute);







export default app;