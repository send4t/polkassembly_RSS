import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress, encodeMultiAddress } from "@polkadot/util-crypto";
import { stringToHex } from '@polkadot/util';
import { ALICE, APP_NAME, BALANCE, BOB, CHARLOTTE, KUSAMA_PROVIDER, MIMIR_URL, SS58_FORMAT, THRESHOLD } from "../utils/constants";
import { AddressOrPair } from "@polkadot/api/types";
import { Chain, ReferendumId } from "../types/properties";


/** 
 * Sends transaction to Mimir, where it can be batched with other transactions, then signed.  
 * The transaction should be created by a [Proposer](https://docs.mimir.global/advanced/proposer). 
 * @param multisig - Array of addresses that are part of the multisig.
 * @param network - Network to send the transaction to. Can be Kusama or Polkadot.
 * @param id - Referendum ID.
 * @param vote - True for aye, false for nay.
 * @param conviction - Conviction value for the vote. Default is 1.
 */
export async function proposeVoteTransaction(
    multisig: AddressOrPair[], 
    network: Chain, 
    id: ReferendumId,
    vote: boolean,
    conviction: number = 1,
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

    // Create multisig address
    const multisigAddress = encodeMultiAddress(
        [ALICE, BOB, CHARLOTTE],
        THRESHOLD,
    );

    // Prepare request payload
    const call = api.tx.convictionVoting.vote(
        id,
        { Standard: {
            vote: { 
                aye: vote, 
                conviction: conviction
            },
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
        const chain = network.toLowerCase();

        const response = await fetch(
            `${MIMIR_URL}/v1/chains/${chain}/${multisigAddress}/transactions/batch`,
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