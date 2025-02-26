import { AddressOrPair } from "@polkadot/api/types";

export interface TimePoint {
    height: number;
    index: number;
}

export enum Chain {
    Polkadot = "Polkadot",
    Kusama = "Kusama"
}

export type ReferendumId = number;