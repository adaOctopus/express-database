import mongoose from "mongoose";

const stripeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: "usd"
    },
    cardType: {
        type: String,
        required: true
    },

}, { timestamps: true });


const StripeS = mongoose.model('StripeS', stripeSchema);
export default StripeS;