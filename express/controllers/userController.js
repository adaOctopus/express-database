import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/userModel.js';
import mongoose from 'mongoose';

const SECRET = process.env.SECRET_KEY;


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });

        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        // console.log(req.user)
        return res.status(500).json({ message: "Error fetching users" });
    }
}

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

export const userLogin = async (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(username, password)
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ username }, { password: 1 });
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if the password is correct
        const passwordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: existingUser._id, username: existingUser.username },
            SECRET,
            { expiresIn: "365d" }
        );

        console.log(token)

        return res.status(200).json({ message: "User logged in successfully", data: existingUser, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error logging in" });
    }
}


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