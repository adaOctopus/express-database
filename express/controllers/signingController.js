import mongoose from "mongoose";
import Genesis from "../schema/genesisModel.js";
import User from "../schema/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
import CryptoJS from "crypto-js";

// Steps
// 1. Check if the user provided their password correctly
// 2. If they did decrypt the key from the database
// 3. Use that key to sign a transaction constructed with lucid.
// 4. Do not return the private key in response decrypted, always encrypted.
// 5. Basically in every controller, check users password, if correct proceed with signing
// 6. also apart from the password check and decryption on backend, when the user signs it from frontend
// providing their password, also do a check with the cookies there. if jwt from DB == jwt from cookies, for increased security.


const SECRET = process.env.SECRET_KEY;
const NETWORKID = process.env.BLOCKFROST_PROVIDER_ID;
const NETWORKURL = process.env.BLOCKFROST_PROVIDER_URL
const USERID = process.env.USERID;

// From the genesis wallet:  addr_test1vqv3edq2k7yf0g2sdj04sm4v5z5knlvr74cqw7ahp3an27sey3lwn
// Send tADA to here addr_test1qpt8jjf0y64272aqka534xhf9400lecuxuuw2m44yrqzrfdhtk52gaz3zt7g2esxu9lqs5rwdm2sxtzaqu6ycqlmglyssqulam

const lucid = await Lucid(
    new Blockfrost(NETWORKURL, NETWORKID),
    "Preview",
);


export const decryptPrivateKey = async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check that the user exists, similar logic to login.
    const existingUser = await User.findOne({ username }, { password: 1 });
    if (!existingUser) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!passwordCorrect) {
        return res.status(400).json({ message: 'Invalid password, dont decrypt.' });
    }
    try {

        if (passwordCorrect) {
            const signingKey = await Genesis.findById(USERID, { publicAddress: 1, privateKeyEncrypted: 1 });
            // Decrypt
            const bytes = CryptoJS.AES.decrypt(signingKey.privateKeyEncrypted, SECRET);
            const originalKey = bytes.toString(CryptoJS.enc.Utf8);
            console.log('Address: ', signingKey.publicAddress)
            console.log('EncryptedKey: ', signingKey.privateKeyEncrypted);
            console.log('Decrypted: ', originalKey);
            const namiAddress = "addr_test1qpt8jjf0y64272aqka534xhf9400lecuxuuw2m44yrqzrfdhtk52gaz3zt7g2esxu9lqs5rwdm2sxtzaqu6ycqlmglyssqulam"
            lucid.selectWalletFromPrivateKey(originalKey);
            console.log('Signing with decrypted key')
            const tx = await lucid.newTx()
                .payToAddress(namiAddress, { lovelace: 5000000n })
                .complete();

            const txString = await tx.toString()

            const signedTx = await lucid.fromTx(txString).signWithPrivateKey(originalKey).complete();
            console.log('Signing with decrypted key2')
            //const assembledTx = await lucid.fromTx(txString).assemble([signedTx]).complete();
            const txHash = await signedTx.submit();
            res.status(200).json({ message: 'PrivateKeyDecrypted successfully', txHash })
        } else {
            res.status(400).json({ message: 'Nothing found to decrypt.' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error decrypting private key" });

    }

}