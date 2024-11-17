import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path: "../.env",
});

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.on("ERROR", (error) => {
            console.error(`MongoDB connection failed! ERROR :: ${error}`);
        });
        app.listen(port, () => {
            console.log(`App is listening on PORT::${port}`);
        });
    })
    .catch((error) => {
        console.error(`MongoDB Connection failed! ERROR::${error}`);
    }); 