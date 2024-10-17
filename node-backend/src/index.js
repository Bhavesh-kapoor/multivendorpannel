import app from "./app.js";
import env from 'dotenv';
env.config();


try {
    app.listen(process.env.PORT, () => {
        console.log(`server is running at ${process.env.PORT}`);
    })
} catch (err) {
    console.log(err);
}

