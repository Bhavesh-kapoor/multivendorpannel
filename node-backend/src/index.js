import app from "./app.js";
import env from 'dotenv';
env.config();
import connectToDatabase from "./db/connection.js";

try {
    await connectToDatabase().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is running at ${process.env.PORT}`);
        })
    })

} catch (err) {
    console.log(err);
}

