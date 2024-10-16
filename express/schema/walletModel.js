import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
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