import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady, encodeAddress, encodeMultiAddress } from "@polkadot/util-crypto";
import { stringToHex } from '@polkadot/util';
import { BALANCE, KUSAMA_PROVIDER, KUSAMA_SS58_FORMAT, MIMIR_URL, MNEMONIC, POLKADOT_SS58_FORMAT, THRESHOLD } from "../utils/constants";
import { Chain, ReferendumId, SuggestedVote } from "../types/properties";


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
    multisig: string[], 
    network: Chain, 
    id: ReferendumId,
    vote: SuggestedVote,
): Promise<void> {
    try {
        if (!MNEMONIC) throw "Please specify MNEMONIC in .env!";
        if (!multisig) throw "Please specify POLKADOT_MULTISIG and/or KUSAMA_MULTISIG in .env!";

        await cryptoWaitReady();

        let ss58Format = POLKADOT_SS58_FORMAT;
        if (network === Chain.Kusama) ss58Format = KUSAMA_SS58_FORMAT;

        const wsProvider = new WsProvider(KUSAMA_PROVIDER);
        const api = await ApiPromise.create({ provider: wsProvider });
        const keyring = new Keyring({ type: "sr25519" });
        const sender = keyring.addFromMnemonic(MNEMONIC);
        const senderAddress = encodeAddress(sender.address, ss58Format);

        const multisigAddress = encodeMultiAddress(
            multisig,
            THRESHOLD,
        );
        console.log('Multisig address: ', multisigAddress);

        // Prepare request payload
        const call = api.tx.convictionVoting.vote(
            id,
            { Split: {
                aye: vote === SuggestedVote.Aye ? BALANCE : 0, 
                nay: vote === SuggestedVote.Nay ? BALANCE : 0,
                abstain: vote === SuggestedVote.Abstain ? BALANCE : 0,
            }}
        ).method;
        const callHex = call.toHex();

        const payload = {
            calldata: callHex,
            timestamp: Date.now()
        }

        const message = [
            'Sign for mimir batch\n',
            `Call Data: ${payload.calldata}\n`,
            `Address: ${multisigAddress}\n`,
            `Timestamp: ${payload.timestamp}`
        ].join('');

        const signature = sender.sign(stringToHex(message));
        const signatureHex = `0x${Buffer.from(signature).toString('hex')}`;

        const request = {
            ...payload,
            signature: signatureHex,
            signer: senderAddress
        };

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
        wsProvider.disconnect();

        return result;

    } catch (error) {
        console.error('Failed to upload transaction: ', error);
        throw error;
    }
}
