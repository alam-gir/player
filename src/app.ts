import express, {Application} from "express"
import authRoutes from "./routes/auth.routes.ts"
import dotenv from 'dotenv'

dotenv.config()

const app : Application = express();

app.use(express.json({limit: '3mb'}));
app.use(express.urlencoded({extended: true, limit: '3mb'}));

app.use("/auth", authRoutes );

export default app