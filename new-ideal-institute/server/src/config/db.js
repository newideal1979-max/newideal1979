import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to server/.env — get it from MongoDB Atlas > Connect > Drivers."
    );
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err.message);
  });
}
