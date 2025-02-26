import { useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { AddressOrPair } from '@polkadot/api/types';
import { Chain } from '../utils/types';
import { ALICE, SS58_FORMAT } from '../utils/constants';
import { encodeAddress } from '@polkadot/util-crypto';
import logo from '../logo.svg';
import '../App.css';
import { sign } from '../utils/sign';


export default function Sign() {
    const [multisig, setMultisig] = useState<AddressOrPair[]>([]);
    const [referendumId, setReferendumId] = useState<number>();
    const [network, setNetwork] = useState<Chain>();
    const [height, setHeight] = useState<number>();
    const [index, setIndex] = useState<number>();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const height = params.get('height');
        const ix = params.get('index');

        // Decode the call data JSON and callHash, and log them to the console
        if (height) {
            setHeight(Number(height));
            console.log("Height:", height);
        }
        if (ix) {
            setIndex(Number(ix));
            console.log("Index:", ix);
        }
    }, []);

    const startSign = async () => {
        if (multisig.length < 1) {
            console.error("Multisig array can not be empty!");
            return;
        }
        if (!referendumId) {
            console.error("Referendum ID is required!");
            return;
        }
        if (!network) {
            console.error("Network is required");
            return;
        }
        if (!height || !index) {
            console.error("Index and height are necesarry!");
            return;
        }

        await sign(multisig, network, referendumId, height, index);
    }

    
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={startSign}>Sign</button>
            </header>
        </div>
    );
}
