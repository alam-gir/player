import  app  from "./app";
import connectDB from "./lib/dbConect";

const port : Number = 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log("server start at- ", port);
    })
})