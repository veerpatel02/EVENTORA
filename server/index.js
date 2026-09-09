
import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import authRouter from "./routes/auth.routes.js"
import eventsRouter from "./routes/events.routes.js"
import bookingRouter from "./routes/booking.routes.js"


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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/booking", bookingRouter);   // 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`server is running on port ${PORT}`);
})