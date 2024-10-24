import mongoose from "mongoose";

const genesisSchema = new mongoose.Schema({
    publicAddress: {
        type: String,
        required: true,
        // unique: true
    },
    privateKeyEncrypted: {
        type: String,
        required: true
    }
}, { timestamps: true });


const Genesis = mongoose.model('Genesis', genesisSchema);
export default Genesis;