import Wallet from "../schema/walletModel.js";
import mongoose from "mongoose";


// Fetch all wallets from MongoDB collection
export const getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find({});
        if (!wallets) {
            res.status(404).json({ message: 'Wallet not found' });
        } else {
            res.status(200).json(wallets);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Fetch individual wallets from MongoDB collection
export const getWallet = async (req, res) => {
    const walletId = req.params.id;
    try {
        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            res.status(404).json({ message: 'Wallet not found' });
        } else {
            res.status(200).json(wallet);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Add a wallet to MongoDB collection
export const addWallet = async (req, res) => {
    const { name, balance, token } = req.body;
    // This is when postmant sends bulk raw data
    if (name === undefined || balance === undefined || token === undefined) {
        //return res.status(400).json({ message: 'Please provide all required fields' });
        console.log(req.body);
        try {
            const newWallet = await Wallet.create(req.body);
            res.status(201).json(newWallet);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        try {
            const newWallet = await Wallet.create({ name, balance, token });
            res.status(201).json(newWallet);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

// Update a wallet in MongoDB collection
export const updateWallet = async (req, res) => {
    console.log('tico')
    console.log(req.body.id)
    try {
        const { id } = req.params;
        const wallet = await Wallet.findByIdAndUpdate(id, req.body);
        console.log(wallet);
        res.status(200).json(wallet);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteWallet = async (req, res) => {
    console.log('tico')
    const walletId = req.params.id;
    console.log(walletId, ": walletId");
    try {
        if (!walletId) {
            res.status(404).json({ message: 'Wallet not found' });
        } else {
            await Wallet.findByIdAndDelete(walletId);
            res.status(200).json({ message: 'Wallet deleted' });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

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
