import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { encodeAddress, cryptoWaitReady, encodeMultiAddress } from "@polkadot/util-crypto";
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
    if (!injector || !injector.signer || !injector.signer.signRaw) {
        throw new Error('Unable to create injector');
    }

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
    const call = api.tx.convictionVoting.vote(
        id,
        { Standard: {
            vote: { aye: vote, conviction: 1 },
            balance: BALANCE
        }}
    );
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
        data: u8aToHex(Buffer.from(message, 'utf-8')),
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
        return result;
    } catch (error) {
        console.error('Failed to upload transaction: ', error);
        throw error;
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
