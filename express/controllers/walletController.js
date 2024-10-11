// @desc Get the wallets info
// @ GET api/wallets

let wallets = [{
    id: 1,
    name: 'Niki',
    balance: 1000
}, {
    id: 2,
    name: 'Eternality',
    balance: 1000
}]

// Fetch all wallets
export const getWallets = (req, res) => {
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
        // wallets.slice, returns up to the specified liimit
        res.status(200).json(wallets.slice(0, limit));
    } else {
        res.status(200).json(wallets);
    }
}

// Fetch a single wallet
export const getWallet = (req, res) => {
    const walletId = parseInt(req.params.id);
    const singleWallet = wallets.find(wallet => wallet.id === walletId);
    if (singleWallet) {
        res.status(200).json(singleWallet);
    } else {
        res.status(404).json({ message: 'Wallet not found' });
    }
}

// Add a wallet
export const addWallet = (req, res) => {
    const { name, balance } = req.body;
    console.log(req.body)
    if (!name || !balance) {
        res.status(400).json({ message: 'Please enter name and balance' });
    } else {
        const newWallet = {
            id: wallets.length + 1,
            name,
            balance
        }
        wallets.push(newWallet);
        res.status(201).json(newWallet);
    }
}

// Update wallet Balance
export const updateWallet = (req, res) => {
    const walletId = parseInt(req.params.id);
    const wallet = wallets.find(wallet => wallet.id === walletId);
    if (!wallet) {
        res.status(404).json({ message: 'Wallet not found' });
    } else {
        const { name, balance } = req.body;
        wallet.name = name || wallet.name; // if nothing added keep the same.
        wallet.balance = balance || wallet.balance;
        res.status(200).json(wallet);
    }

}

// Delete a wallet

export const deleteWallet = (req, res) => {
    const walletId = parseInt(req.params.id);
    const identifyWalletToRemove = wallets.find(wallet => wallet.id === walletId);

    if (!identifyWalletToRemove) {
        res.status(404).json({ message: 'Wallet not found' });
    } else {
        wallets = wallets.filter(wallet => wallet.id !== walletId);
        res.status(200).json({ message: 'Wallet removed' });
    }
}
