import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady, encodeAddress, encodeMultiAddress } from "@polkadot/util-crypto";
import { stringToHex } from '@polkadot/util';
import { BALANCE, KUSAMA_PROVIDER, KUSAMA_SS58_FORMAT, MIMIR_URL, MNEMONIC, POLKADOT_SS58_FORMAT, THRESHOLD } from "../utils/constants";
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
    multisig: string[], 
    network: Chain, 
    id: ReferendumId,
    vote: boolean,
    conviction: number = 1,
): Promise<void> {
    try {
        if (!MNEMONIC) throw "Please specify MNEMONIC in .env!";
        if (!multisig) throw "Please specify MULTISIG in .env!";
  network = Chain.Kusama; // !!
        await cryptoWaitReady();

        let ss58Format = POLKADOT_SS58_FORMAT;
        if (network === Chain.Kusama) ss58Format = KUSAMA_SS58_FORMAT;

        const wsProvider = new WsProvider(KUSAMA_PROVIDER);
        const api = await ApiPromise.create({ provider: wsProvider });
        const keyring = new Keyring({ type: "sr25519" });
        const sender = keyring.addFromMnemonic(MNEMONIC);
        console.log('ss58: ', ss58Format);
        const senderAddress = encodeAddress(sender.address, ss58Format);
        console.log('Sender address: ', senderAddress);

        // Create multisig address
        const multisigAddress = encodeMultiAddress(
            multisig,
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

        // Create signature using backend-side Polkadot code
        const message = [
            'Sign for mimir batch\n',
            `Call Data: ${payload.calldata}\n`,
            `Address: ${multisigAddress}\n`,
            `Timestamp: ${payload.timestamp}`
        ].join('');

        const signature = sender.sign(stringToHex(message));
        const signatureHex = `0x${Buffer.from(signature).toString('hex')}`;

        // Prepare final request
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
        return result;
    } catch (error) {
        console.error('Failed to upload transaction: ', error);
        throw error;
    }
}
