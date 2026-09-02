
import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import authRouter from "./routes/auth.router.js"


const app = express();
app.use(express.json()); //json data pass
app.use(cors());
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Db Connect ")
  } catch (error) {
    console.log(`Db error ${error}`)
  }
}
app.use("/api/v1/auth", authRouter);   // 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`server is running on port ${PORT}`);
})