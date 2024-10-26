import dotenv from "dotenv"
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailOptions=(receiverEmail,subject,htmlContent)=>{
  const mailOptions ={
    from:{
      name: "multivendor",
      address:process.env.ADMIN_EMAIL
    },
    to:receiverEmail,
    subject:subject,
    html:htmlContent
  }
return(mailOptions)
}
export {transporter,mailOptions};
