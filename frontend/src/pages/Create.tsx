import { useEffect, useState } from 'react';
import { AddressOrPair } from '@polkadot/api/types';
import { Chain, ReferendumId } from '../utils/types';
import { createAndSign } from '../utils/createAndSign';
import { validateChain } from '../utils/utils';
import logo from '../logo.svg';
import '../App.css';


export default function Create() {
    const [multisig, setMultisig] = useState<AddressOrPair[]>([]);
    const [referendumId, setReferendumId] = useState<ReferendumId>();
    const [network, setNetwork] = useState<Chain>();
    const vote = true;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theMultisigList = params.get('multisig');
        const refId = params.get('refid');
        const nw = params.get('network');

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
    }, []);

    const startCreate = async () => {
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

        await createAndSign(multisig, network, referendumId, vote, 6);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={startCreate}>Create & Sign</button>
            </header>
        </div>
    );
}