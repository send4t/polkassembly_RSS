import { ApiPromise } from "@polkadot/api";
import { Chain, TimePoint } from "./types";

export async function getTransactionDetails(api: ApiPromise, txHash: string): Promise<TimePoint | null> {
    const blockHash = await api.rpc.chain.getBlockHash(txHash);
    const block = await api.rpc.chain.getBlock(blockHash);  
    const blockHeight = block.block.header.number.toNumber();
  
    // Go through the extrinsics in the block and find the one matching the txHash
    let txIndex = -1;
    block.block.extrinsics.forEach((extrinsic, index) => {
        if (extrinsic.hash.toHex() === txHash) {
        txIndex = index;
        }
    });

    if (txIndex !== -1) {
        console.log(`Transaction found in block ${blockHash.toHex()} with height ${blockHeight}, index ${txIndex}`);
        return {
            height: blockHeight,
            index: txIndex
        }
    } else {
        console.log('Transaction not found');
        return null;
    }
}

export function validateChain(input: string): Chain {
    console.log("start")
    if (Object.values(Chain).includes(input as Chain)) {
        console.log("Validated network:", input);
        return input as Chain;
    } else {
        throw new Error(`Invalid network: ${input}`);
    }    
}