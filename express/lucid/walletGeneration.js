import { Blockfrost, Lucid } from "lucid-cardano";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import CryptoJS from 'crypto-js';
import Genesis from "../schema/genesisModel.js";

// Path to .env
// Run the following command to generate what is needed
// node --env-file=/home/gandalfg/Cardano/plutus-vasil/emurgo-labs/tasos-database-express/express/.env walletGeneration.js
///home/gandalfg/Cardano/plutus-vasil/emurgo-labs/tasos-database-express/express/.env
const SECRET = process.env.SECRET_KEY;
const NETWORKID = process.env.BLOCKFROST_PROVIDER_ID;
const NETWORKURL = process.env.BLOCKFROST_PROVIDER_URL;
console.log(SECRET, NETWORKID, NETWORKURL)
const lucid = await Lucid.new(
    new Blockfrost(NETWORKURL, NETWORKID),
    "Preview",
);

const privateKey = lucid.utils.generatePrivateKey(); // Bech32 encoded private key
const wallet = lucid.selectWalletFromPrivateKey(privateKey);

// Encrypt the PrivateKey before pushing it to DB
const privateKeyEncrypted = CryptoJS.AES.encrypt(privateKey, SECRET).toString();

// public Address
const publicAddress = await lucid.wallet.address();

console.log(privateKeyEncrypted, publicAddress, 'Encrypted Private Key and Public Address');

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

try {

    await Genesis.create({ publicAddress, privateKeyEncrypted });

} catch (error) {
    console.log(error);
}