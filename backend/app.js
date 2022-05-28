import mongoose from "mongoose";
import {} from "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";

(async function () {
     try {
          await mongoose.connect(process.env.DB_URL);
          console.log("Connected to database...");
     } catch (error) {
          console.log("Couldn't connect to database...");
          process.exit();
     }
})();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
     cors({
          origin: `http://localhost:3000`,
          credentials: true,
     })
);


app.use("/users", userRoutes);

app.use("/posts", postRoutes);
// app.use("/tags", tagRoutes);



app.get("*", (req, res) => {
     res.send("Not founddd").status(404);
});

app.listen(port, () => {
     console.log("Server running on port :", port);
});
