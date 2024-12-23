async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    // console.log(data);

    const connections = data.split('\r\n').map(c => c.split('-'));

    const networkGraph = createGraph(connections);

    console.log('NetWork graph: ', networkGraph);


    const tripleConnections = new Set();
    for(const [pc, connections] of Object.entries(networkGraph)){
        // check if connected pc are connected between them
        if(!pc.startsWith('t')) continue;
        let _connections = connections.slice();
        for(const pc_1 of _connections){
            for(const pc_2 of _connections){
                if(pc_1 == pc_2) continue;
                if(isConnected(pc_1, pc_2)){
                    const tripleConnection = [pc, pc_1, pc_2];
                    tripleConnection.sort();
                    tripleConnections.add(tripleConnection.join(','))
                }
            }
        }

    }
    console.log(`Part 1: there are ${tripleConnections.size} possible sets!`);



    const parties = new Set();
    for(const [pc, connections] of Object.entries(networkGraph)){
        // check if connected pc are connected between them
        if(!pc.startsWith('t')) continue;
        let _connections = connections.slice();
        for(const pc_1 of _connections){
            for(const pc_2 of _connections){
                if(pc_1 == pc_2) continue;

                if(isConnected(pc_1, pc_2)){
                    const tripleConnection = [pc, pc_1, pc_2];
                    tripleConnection.sort();
                    tripleConnections.add(tripleConnection.join(','))
                } else {
                    // "remove" from list
                    _connections.splice(_connections.indexOf(pc_2), 1);
                }
            }
        }

        _connections = [pc, ..._connections];
        // save list
        _connections.sort();
        parties.add(_connections.join(','));
    }
    // get biggest party
    let biggestParty = [];
    for(const party of parties.keys()){
        if(party.length > biggestParty.length){
            biggestParty = party;
        }
    }
    console.log(`Part 2: the password is: ${biggestParty}`);
    
    
    

    function isConnected(pc_1, pc_2){
        return networkGraph[pc_1].includes(pc_2);
    }

    function createGraph(connections){
        const netWork = {};
        for(const connection of connections){
            const pc_1 = connection[0];
            const pc_2 = connection[1];
            if(!netWork[pc_1]){
                netWork[pc_1] = [];
            }
            netWork[pc_1].push(pc_2);

            if(!netWork[pc_2]){
                netWork[pc_2] = [];
            }
            netWork[pc_2].push(pc_1);
        }
        return netWork;
    }
}




main();