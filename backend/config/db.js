import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://anuragparihar7089:DeSmonD708@cluster0.reg9ikm.mongodb.net/food').then(()=>console.log("DB Connected"));
}