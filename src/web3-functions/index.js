/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const EthUtil = require('ethereumjs-util');
const Bip39 = require('bip39');
const Hdkey = require('hdkey');
const keythereum = require('keythereum');
const BigInt = require('big-integer');
const { contractFunctions } = require('./constants');

const REACT_APP_API_URL_WEB3 = 'https://evm-testnet.nexis.network/'

let web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));

export const getBalance = async (address) => {
	const res = await web3.eth.getBalance(address);
	return res;
}

export const isConnected = async () => {
	if (!web3) return false;
	return !!await web3.eth.getNodeInfo();
}

export const setProvider = async () => {
	const prov = new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || '');
	if (!web3) {
		web3 = new Web3(prov);
	} else {
		web3.setProvider(prov);
	}
}

export const getKeystore = (privateKey, password) => {
	if (!web3) throw new Error('not inialized');

	return web3.eth.accounts.encrypt(privateKey, password);
};

export const getDelegate = (from, delegateAddress, sfc) => {
	return new Promise(resolve => {
		sfc.methods.delegations(delegateAddress).call({ from }, function (error, result) {
			if (!error) resolve(result);
			console.log(error, 'errorerror getDelegate');
		});
	});
}

export const validateKeystore = (keystore, password) => {
	if (!web3) throw new Error('not inialized');

	return web3.eth.accounts.decrypt(keystore, password);
};

export const getPrivateKey = (keystore, password) =>
	new Promise(resolve =>
		keythereum.recover(password, keystore, dataRes => {
			resolve(dataRes instanceof Buffer ? EthUtil.bufferToHex(dataRes) : null);
		})
	);

const getCurrentEpoch = (from, sfc) => {
	return new Promise(resolve => {
		sfc.methods.currentEpoch().call({ from }, function (error, result) {
			if (!error) {
				resolve(result);
			}
			console.log(error, 'errorerror getCurrentEpoch');
		});
	});
}

export const estimateFee = async ({ from, to, value, memo }) => {


	const gasPrice = await web3.eth.getGasPrice();
	const gasLimit = await web3.eth.estimateGas({
		from,
		to,
		value: Web3.utils.toHex(Web3.utils.toWei(value, 'ether')),
		data: Web3.utils.asciiToHex(memo)
	});

	const fee = Web3.utils.fromWei(
		BigInt(gasPrice.toString())
			.multiply(BigInt(gasLimit.toString()))
			.toString()
	);

	return fee;
}

export const getDelegationPendingRewards = async (from, delegateAddress) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));
	const sfc = new web3.eth.Contract(contractFunctions, '0xfc00face00000000000000000000000000000000');
	const info = await Promise.all([
		getCurrentEpoch(from, sfc),
		getDelegate(from, delegateAddress, sfc) || {}
	]);
	const maxEpochs = Number(info[0]) - 1;
	const fromEpoch = info[1].paidUntilEpoch;
	return new Promise(resolve => {
		sfc.methods
			.calcDelegationRewards(delegateAddress, fromEpoch, maxEpochs)
			.call({ from }, function (error, result) {
				if (result) {
					resolve({
						pendingRewards: parseFloat(result['0']) / Math.pow(10, 18),
						data: info[1]
					});
				} else {
					resolve({ pendingRewards: 0, data: info[1] });
				}
			});
	});
}

export const delegateStake = ({ amount, publicKey, privateKey, validatorId, isWeb = false }) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));
	const web3Sfc = new web3.eth.Contract(contractFunctions, '0xfc00face00000000000000000000000000000000');
	return transfer({
		from: publicKey,
		to: '0xfc00face00000000000000000000000000000000',
		value: amount,
		memo: web3Sfc.methods.createDelegation(validatorId).encodeABI(),
		privateKey,
		gasLimit: 200000,
		web3Delegate: web3,
		isWeb
	});
}

export const restoreWallet = async (privateKey) => {
	const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
	return wallet;
}

export const getTransactionFee = async (gasLimit) => {
	const gasPrice = await web3.eth.getGasPrice();
	const fee = Web3.utils.fromWei(
		BigInt(gasPrice.toString())
			.multiply(BigInt(gasLimit.toString()))
			.toString()
	);
	return fee;
}

export const transfer = async ({
	from,
	to,
	value,
	memo = '',
	privateKey,
	gasLimit = 44000,
	web3Delegate = '',
	isWeb
}) => {
	const useWeb3 = web3Delegate || web3;
	const nonce = await useWeb3.eth.getTransactionCount(from);
	const gasPrice = await useWeb3.eth.getGasPrice();

	const rawTx = {
		from,
		to,
		value: Web3.utils.toHex(Web3.utils.toWei(value, 'ether')),
		gasLimit: Web3.utils.toHex(gasLimit),
		gasPrice: Web3.utils.toHex(gasPrice),
		nonce: Web3.utils.toHex(nonce),
		data: memo,
		chainId:2370
	};



	const bufferData = EthUtil.addHexPrefix(privateKey)
	const privateKeyBuffer = EthUtil.toBuffer(privateKey);
	const tx = new Tx(rawTx);
	tx.sign(privateKeyBuffer);
	const serializedTx = tx.serialize();
	const res = await useWeb3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);
	if (isWeb) {
		localStorage.setItem('txHash', res.transactionHash);
	}

	return res;
}

export const delegateUnstake = async (publicKey, privateKey, isWeb = false) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));
	const web3Sfc = new web3.eth.Contract(contractFunctions, '0xfc00face00000000000000000000000000000000');
	return transfer({
		from: publicKey,
		to: '0xfc00face00000000000000000000000000000000',
		value: '0',
		memo: web3Sfc.methods.prepareToWithdrawDelegation().encodeABI(),
		privateKey,
		gasLimit: 200000,
		web3Delegate: web3,
		isWeb
	});
}

export const withdrawDelegateAmount = async (publicKey, privateKey, isWeb = false) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));
	const web3Sfc = new web3.eth.Contract(contractFunctions, '0xfc00face00000000000000000000000000000000');
	return transfer({
		from: publicKey,
		to: '0xfc00face00000000000000000000000000000000',
		value: '0',
		memo: web3Sfc.methods.withdrawDelegation().encodeABI(),
		privateKey,
		gasLimit: 200000,
		web3Delegate: web3,
		isWeb,
	});
}

export const mnemonicToKeys = async (mnemonic) => {
	const seed = await Bip39.mnemonicToSeed(mnemonic);
	const root = Hdkey.fromMasterSeed(seed);
	const addrNode = root.derive("m/44'/60'/0'/0/0");
	const pubKey = EthUtil.privateToPublic(addrNode._privateKey);
	const addr = EthUtil.publicToAddress(pubKey).toString('hex');
	const publicAddress = EthUtil.toChecksumAddress(addr);
	const privateKey = EthUtil.bufferToHex(addrNode._privateKey);
	return { publicAddress, privateKey };
};

export const privateKeyToKeys = (privateKey) => {
	const privateKeyBuffer = EthUtil.toBuffer(privateKey);
	const pubKey = EthUtil.privateToPublic(privateKeyBuffer);
	const addr = EthUtil.publicToAddress(pubKey).toString('hex');
	const publicAddress = EthUtil.toChecksumAddress(addr);
	return { publicAddress, privateKey };
};

export const getAccount = async (address) => {
	// eslint-disable-next-line no-return-await
	return await fetch(`https://evm-testnet.nexscan.io/api/v2/addresses/${address}`);
}

export const estimateFeeMobile = async (value) => {
	let fee;
	if (web3 && web3.eth) {
		const gasPrice = await web3.eth.getGasPrice();
		const gasLimit = value;
		fee = Web3.utils.fromWei(
			BigInt(gasPrice.toString())
				.multiply(BigInt(gasLimit.toString()))
				.toString()
		);
	}
	return fee;
}


