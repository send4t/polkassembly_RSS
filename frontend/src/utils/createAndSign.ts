import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress, cryptoWaitReady, encodeMultiAddress } from "@polkadot/util-crypto";
import { createTestKeyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { ALICE, APP_NAME, BALANCE, BOB, KUSAMA_PROVIDER, PASEO_PROVIDER, SS58_FORMAT, THRESHOLD } from "./constants";
import { AddressOrPair } from "@polkadot/api/types";
import { Chain, ReferendumId } from "./types";


export async function createAndSign(
    multisig: AddressOrPair[], 
    network: Chain, 
    id: ReferendumId,
    vote: boolean,
    conviction: number = 6,
): Promise<void> {
    await web3Enable(APP_NAME);

    // Get accounts from Talisman wallet
    const accounts = await web3Accounts();
    const account = accounts[0];

    const wsProvider = new WsProvider(KUSAMA_PROVIDER);
    const api = await ApiPromise.create({ provider: wsProvider });
    //api.consts.system.ss58Prefix.toHuman()
    const senderAddress = encodeAddress(account.address, SS58_FORMAT);
    const injector = await web3FromAddress(senderAddress);

    /* Mimir Configuration */
    const config = {
        clientGateway: 'https://mimir-client.mimir.global', // Replace with actual API endpoint
        chain: 'polkadot'
    };
    /** */

    // Create multisig address
    const multisigAddress = encodeMultiAddress(
        [ALICE, BOB],
        THRESHOLD,
    );

    // Prepare request payload

    // Create signature

    // Prepare final request

    // Send request
    
    const maxWeight = {
        refTime: api.createType('Compact<u64>', 2000000000),
        proofSize: api.createType('Compact<u64>', 2000000)
    };    

    // Create the  multisig call
    const threshold = 2;
    const otherSignatories = multisig
        .filter((address) => address !== senderAddress)
        .sort();
console.log("Other signatories: ", otherSignatories)
    const maybeTimepoint = null;
console.log("Api.txt ", api.tx)
console.log(Object.keys(api.tx.convictionVoting));

    const call = api.tx.convictionVoting.vote(
        id,
        { Standard: {
            vote: { aye: vote, conviction: 1 },
            balance: BALANCE
        }}
    );

const balance = await api.query.system.account("Ht96h36AiW7x2PEEpR7Xkhxtue4KxfAccsMjHbHfDSi468R");
console.log("Ht96h36AiW7x2PEEpR7Xkhxtue4KxfAccsMjHbHfDSi468R", balance.toHuman());

console.log("Call JSON:", JSON.stringify(call.toHuman()));
console.log("Call Hex:", call.toHex());
const callHex = call.toHex();
console.log("Encoded Call Hex:", callHex);
const proxies = await api.query.proxy.proxies(senderAddress);
console.log("Proxies:", proxies.toHuman());

    
    // Create the multisig transaction
    const multisigCall = api.tx.multisig.asMulti(
        threshold,
        otherSignatories,
        maybeTimepoint,
        call,
        maxWeight
    );

    try {
        const txHash = await multisigCall.signAndSend(
            senderAddress, 
            { signer: injector.signer }
        );

        
        findTxBlock(api, txHash.toHex()).then((result) => {
            if (result) {
                console.log(`Transaction included in block ${result.blockNumber} at index ${result.index}`);

                const url = `http://localhost:3000/sign?network=${network}&refid=${id}&multisig=${multisig}&height=${result.blockNumber}&index=${result.index}`;
                console.log("Url: ", url);
            } else {
                console.log("Transaction not found within the given retries.");
            }
        }).catch(console.error);

        

        console.log('Transaction submitted with hash:', txHash.toHex());
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

async function findTxBlock(api: ApiPromise, txHash: string, maxRetries = 150, interval = 100) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}: Checking for transaction...`);

        // Get the latest block
        const latestHeader = await api.rpc.chain.getHeader();
        const latestBlockHash = await api.rpc.chain.getBlockHash(latestHeader.number.toBigInt());
        const signedBlock = await api.rpc.chain.getBlock(latestBlockHash);
        const blockNumber = latestHeader.number.toNumber();

        // Get all events for this block
        await api.query.system.events.at(latestBlockHash);

        for (let index = 0; index < signedBlock.block.extrinsics.length; index++) {
            const extrinsic = signedBlock.block.extrinsics[index];

            if (extrinsic.hash.toHex() === txHash) {
                console.log(`✅ Transaction found in block #${blockNumber}, index: ${index}`);
                return { blockNumber, index };
            }
        }

        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, interval)); // Wait before retrying
        } else {
            console.log(`❌ Transaction not found after ${maxRetries} attempts.`);
            return null;
        }
    }
}
