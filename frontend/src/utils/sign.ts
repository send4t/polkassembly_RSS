import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress } from "@polkadot/util-crypto";
import { ALICE, APP_NAME, SS58_FORMAT } from "./constants";
import { AddressOrPair } from "@polkadot/api/types";
import { Chain, ReferendumId } from "./types";


export async function sign(
    multisig: AddressOrPair[], 
    network: Chain, 
    id: ReferendumId,
    height: number,
    index: number
): Promise<void> {
    await web3Enable(APP_NAME);

    // Get accounts from Talisman wallet
    const accounts = await web3Accounts();
    const account = accounts[0];

    const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com');
    const api = await ApiPromise.create({ provider: wsProvider });
    const senderAddress = encodeAddress(account.address, SS58_FORMAT);
    const injector = await web3FromAddress(senderAddress);
    
    // Correctly structure max_weight
    const maxWeight = {
        refTime: api.createType('Compact<u64>', 1000000000),
        proofSize: api.createType('Compact<u64>', 1000000)
    };    

    // Example multisig call with max_weight
    const threshold = 2;
    const otherSignatories = multisig
            .filter((address) => address !== senderAddress)
            .sort();
    const maybeTimepoint = {
        height,
        index
    };
    const call = api.tx.balances.transferAllowDeath(ALICE, 10000000000);
    
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

        console.log('Transaction submitted with hash:', txHash.toHex());
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}