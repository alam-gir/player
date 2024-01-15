import express, {Application} from "express"
import authRoutes from "./routes/auth.routes.ts"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app : Application = express();

app.use(express.json({limit: '3mb'}));
app.use(express.urlencoded({extended: true, limit: '3mb'}));
app.use(cookieParser())

app.use("/auth", authRoutes );


export default app