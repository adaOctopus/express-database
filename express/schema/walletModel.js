import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    token: {
        type: String,
        required: true,
        default: "ADA"
    }
}, { timestamps: true });


const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;