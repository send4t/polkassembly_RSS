import { Chain, Origin, TimelineStatus } from "../types/properties";

export function getValidatedOrigin(origin: string | undefined): Origin {
    if (!origin) return  Origin.NoOriginInformationAvailable;

    if (Object.values(Origin).includes(origin as Origin)) {
      return origin as Origin;
    }
  
    // probably return NoOriginInformationAvailable here as well
    throw new Error(`Invalid origin: ${origin}`);
}

export function getValidatedStatus(status: string | undefined): TimelineStatus {
    if (!status) throw new Error("No VoteStatus found");            // probably return some default value, but this way we are not saying incorrect things

    if (Object.values(TimelineStatus).includes(status as TimelineStatus)) {
        return status as TimelineStatus;
    }

    throw new Error(`Invalid vote status: ${status}`);
}

/** Fetch DOT/USD exchange rate */
export async function fetchDotToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
        const data = await response.json();
        return data.polkadot.usd || 0;
    } catch (error) {
        console.error('Error fetching DOT/USD rate:', (error as any).message);
        throw error;
    }
}

/** Fetch KUS/USD exchange rate */
export async function fetchKusToUsdRate(): Promise<number> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd');
        const data = await response.json();
        return data.kusama.usd || 0;
    } catch (error) {
        console.error('Error fetching KUS/USD rate:', (error as any).message);
        throw error;
    }
}

/** Calculate requested amount (in $) */ 
export function calculateReward(content: any, rate: number,  network: Chain): number {

    if (content.beneficiaries && content.beneficiaries.length > 0) {
        const beneficiary = content.beneficiaries[0];
        if (content.assetId === '1984' || content.assetId === '1337') {
            const usdtAmount = Number((BigInt(beneficiary.amount) / BigInt(1e6)).toString());

            console.log(`${usdtAmount} ${assetIdToTicker(content.assetId)}`);
            return usdtAmount;
        }
    }
    
    if (content.proposer && content.requested) {
        let nativeAmount = BigInt(0);
        if (network === Chain.Polkadot) nativeAmount = BigInt(content.requested) / BigInt(1e10);
        if (network === Chain.Kusama) nativeAmount = BigInt(content.requested) / BigInt(1e12);

        const scaledRate = Math.round(rate * 100);
        const usdAmount = (nativeAmount * BigInt(scaledRate)) / BigInt(100);
        const usdValue = Number(usdAmount)//.toFixed(2);

        console.log(`$${usdValue} USD`);
        return usdValue;
    }
    
    console.log('No reward information available');
    return 0;
}

function assetIdToTicker(assetId: string): string {
    if (assetId === '1337') return 'USDC';
    if (assetId === '1984') return 'USDT';
    //throw "Unknown AssetId";
    return 'NaN';
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}