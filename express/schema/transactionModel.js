import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    walletName: {
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
    secretHash: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });


const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;