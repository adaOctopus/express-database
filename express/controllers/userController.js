import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/userModel.js';
import mongoose from 'mongoose';


export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists in database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash The User's Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        // Save The User To The Database
        const newUser = await User.create({ username, password: hashedPassword });

        return res.status(201).json({ message: "User Created Successfully", newUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

// export const login = async (req, res) => {

//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             return res.status(400).json({ message: 'Please provide all required fields' });
//         }

//         const existingUser = await User.findOne({ username })
//     }
// }


// Connect to DB
// Connect to DB
const urlConnection = process.env.MONGODB_URL;
mongoose.set("strictQuery", false);
mongoose.connect(`${urlConnection}`);
const connect = mongoose.connection;
if (!connect) {
    console.log("Error connecting db");
} else {
    connect.on("open", () => {
        console.log("MongoDB connected...");
    });

}