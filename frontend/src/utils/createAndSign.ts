import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress, cryptoWaitReady, encodeMultiAddress } from "@polkadot/util-crypto";
import { stringToHex, u8aToHex } from '@polkadot/util';
import { ALICE, APP_NAME, BALANCE, BOB, CHARLOTTE, KUSAMA_PROVIDER, PASEO_PROVIDER, SS58_FORMAT, THRESHOLD } from "./constants";
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
    const senderAddress = encodeAddress(account.address, SS58_FORMAT);
    const injector = await web3FromAddress(senderAddress);
    if (!injector || !injector.signer || !injector.signer.signRaw) {
        throw new Error('Unable to create injector');
    }

    /* Mimir Configuration */
    const config = {
        clientGateway: 'https://mimir-client.mimir.global', // Replace with actual API endpoint
        chain: 'kusama'
    };
    /** */

    // Create multisig address
    const multisigAddress = encodeMultiAddress(
        [ALICE, BOB, CHARLOTTE],
        THRESHOLD,
    );

    // Prepare request payload
    const call = api.tx.convictionVoting.vote(
        id,
        { Standard: {
            vote: { aye: vote, conviction: 1 },
            balance: BALANCE
        }}
    ).method;
    const callHex = call.toHex();

    const payload = {
        calldata: callHex,
        timestamp: Date.now()
    }

    // Create signature
    const message = [
        'Sign for mimir batch\n',
        `Call Data: ${payload.calldata}\n`,
        `Address: ${multisigAddress}\n`,
        `Timestamp: ${payload.timestamp}`
    ].join('');

    const signature = await injector.signer.signRaw({
        address: senderAddress,
        data: stringToHex(message), // would be good if this is just message
        type: 'bytes'
    });
    const signatureHex = signature.signature;

    // Prepare final request
    const request = {
        ...payload,
        signature: signatureHex,
        signer: senderAddress
    };

    // Send request
    try {
        const response = await fetch(
            `${config.clientGateway}/v1/chains/${config.chain}/${multisigAddress}/transactions/batch`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(request)
            }
        );
      
        const result = await response.json();
        console.log('Transaction result: ', result);
        return result;
    } catch (error) {
        console.error('Failed to upload transaction: ', error);
        throw error;
    }
}