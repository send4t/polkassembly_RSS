import { useEffect, useState } from 'react';
import { AddressOrPair } from '@polkadot/api/types';
import { Chain } from '../utils/types';
import logo from '../logo.svg';
import '../App.css';
import { sign } from '../utils/sign';
import { validateChain } from '../utils/utils';


export default function Sign() {
    const [multisig, setMultisig] = useState<AddressOrPair[]>([]);
    const [referendumId, setReferendumId] = useState<number>();
    const [network, setNetwork] = useState<Chain>();
    const [height, setHeight] = useState<number>();
    const [index, setIndex] = useState<number>();
    const vote = true;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theMultisigList = params.get('multisig');
        const refId = params.get('refid');
        const nw = params.get('network');
        const height = params.get('height');
        const ix = params.get('index');

        if (theMultisigList) {
            const multisigArr = theMultisigList.split(',');
            setMultisig(multisigArr);
            console.log("Multisig members:", multisigArr);
        }
        if (refId) {
            setReferendumId(Number(refId));
            console.log("Referendum ID:", refId);
        }
        if (nw) {
            const validNw = validateChain(nw);
            setNetwork(validNw);
        }
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

        await sign(multisig, network, referendumId, vote, 6, height, index);
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
