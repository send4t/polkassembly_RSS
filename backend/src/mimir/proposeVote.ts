import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import {
  cryptoWaitReady,
  encodeAddress,
  encodeMultiAddress,
} from "@polkadot/util-crypto";
import { stringToHex } from "@polkadot/util";
import {
  BALANCE,
  KUSAMA_PROVIDER,
  KUSAMA_SS58_FORMAT,
  MIMIR_URL,
  MNEMONIC,
  POLKADOT_SS58_FORMAT,
  THRESHOLD,
} from "../utils/constants";
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
  multisig: string,
  network: Chain,
  id: ReferendumId,
  vote: SuggestedVote,
  conviction: number = 1
): Promise<void> {
  try {
    if (!MNEMONIC) throw "Please specify MNEMONIC in .env!";
    if (!multisig)
      throw "Please specify POLKADOT_MULTISIG and/or KUSAMA_MULTISIG in .env!";

    await cryptoWaitReady();

    let ss58Format = POLKADOT_SS58_FORMAT;
    if (network === Chain.Kusama) ss58Format = KUSAMA_SS58_FORMAT;

    const wsProvider = new WsProvider(KUSAMA_PROVIDER);
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: "sr25519" });
    const sender = keyring.addFromMnemonic(MNEMONIC);
    const senderAddress = encodeAddress(sender.address, ss58Format);

    console.log("Multisig address: ", multisig);

    // Prepare request payload
    let call;
    if (vote === SuggestedVote.Abstain) {
      call = api.tx.convictionVoting.vote(id, {
        Split: {
          aye: 0,
          nay: 0,
          abstain: BALANCE,
        },
      }).method;
    } else {
      call = api.tx.convictionVoting.vote(id, {
        Standard: {
          vote: {
            aye: vote === SuggestedVote.Aye,
            conviction: conviction,
          },
          balance: BALANCE,
        },
      }).method;
    }

    const callHex = call.toHex();

    const payload = {
      calldata: callHex,
      timestamp: Date.now(),
    };

    const message = [
      "Sign for mimir batch\n",
      `Call Data: ${payload.calldata}\n`,
      `Address: ${multisig}\n`,
      `Timestamp: ${payload.timestamp}`,
    ].join("");

    const signature = sender.sign(stringToHex(message));
    const signatureHex = `0x${Buffer.from(signature).toString("hex")}`;

    const request = {
      ...payload,
      signature: signatureHex,
      signer: senderAddress,
    };

    const chain = network.toLowerCase();

    const response = await fetch(
      `${MIMIR_URL}/v1/chains/${chain}/${multisig}/transactions/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    wsProvider.disconnect();

    let result;

    try {
      result = await response.json();
    } catch (error) {
      const text = await response.text();
      throw new Error(`Response was not JSON. Text content: ${text}`);
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }

    if (!result) {
      throw new Error("Response body is empty");
    }

    console.log("Transaction result: ", result);

    return result;
  } catch (error) {
    console.error("Failed to upload transaction: ", error);
    throw error;
  }
}
