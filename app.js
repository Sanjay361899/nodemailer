import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/connectDB.js"
import router from "./routes/userRoutes.js"
const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
console.log(DATABASE_URL)
//cors
app.use(cors())

//connection
connectDB(DATABASE_URL)
//json
app.use(express.json())


app.use('/api',router)
app.listen(port, () => {
    console.log(`app is runing on localhost:${port}`)
})