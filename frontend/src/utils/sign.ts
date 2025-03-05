import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress } from "@polkadot/util-crypto";
import { ALICE, APP_NAME, BALANCE, KUSAMA_PROVIDER, PASEO_PROVIDER, SS58_FORMAT } from "./constants";
import { AddressOrPair } from "@polkadot/api/types";
import { Chain, ReferendumId } from "./types";


export async function sign(
    multisig: AddressOrPair[], 
    network: Chain, 
    id: ReferendumId,
    vote: boolean,
    conviction: number = 6,
    height: number,
    index: number
): Promise<void> {
    await web3Enable(APP_NAME);

    // Get accounts from Talisman wallet
    const accounts = await web3Accounts();
    const account = accounts[0];

    const wsProvider = new WsProvider(KUSAMA_PROVIDER);
    const api = await ApiPromise.create({ provider: wsProvider });
    const senderAddress = encodeAddress(account.address, SS58_FORMAT);
    const injector = await web3FromAddress(senderAddress);
    
    // Correctly structure max_weight
    const maxWeight = {
        refTime: api.createType('Compact<u64>', 2000000000),
        proofSize: api.createType('Compact<u64>', 2000000)
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
    const call = api.tx.convictionVoting.vote(
        id,
        { Standard: {
            vote: { aye: vote, conviction: 1 },
            balance: BALANCE
        }}
    );
    
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