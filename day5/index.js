async function main(){
    const data = await getData('input.txt');
    //console.log(data);

    const orderRules = data.split('\r\n\r\n')[0].split('\r\n');
    const updates = data.split('\r\n\r\n')[1].split('\r\n').map( p => p.split(','));
    
    console.log('Ordering Rules: ', orderRules);
    console.log('Updates: ', updates);

    // ribalto le regole di ordinamento
    const wrongRules = orderRules.map(r => r.split('|')).map(r => r[1] + '|' + r[0]);
    console.log('Rules reversed', wrongRules);
    
    // controllo a due a due tutte le pagine di ogni update, se trovo una regola (ribaltata) che corrisponde alla coppia di pagine allora l'update non è in ordine corretto
    let count = 0;
    let isvalid;
    let invalidUpdates = [];
    for(let upd of updates){
        isvalid = true;
        for(let i = 0; i < upd.length; i++){
            for(let j = i; j < upd.length; j++){
                let c = upd[i] + '|' + upd[j];
                if(wrongRules.includes(c)){                    
                    isvalid = false;
                    break;
                }
                if(!isvalid){
                    break;
                }
            }
        }

        if(isvalid){
            //console.log(upd, 'valid');
            count += Number(upd[Math.floor(upd.length/2)]);
        } else {
            invalidUpdates.push(upd);
        }
    }

    console.log('Part 1 result: ', count);
    
    //console.log(invalidUpdates);
    
    let sorted;
    count = 0;
    for(let update of invalidUpdates){
        sorted = sortInvalid(update, wrongRules);
        //console.log(sorted);
        count += Number(update[Math.floor(update.length/2)]);
    }

    console.log('Part 2 result: ', count);
    
    
    
}

function sortInvalid(update, rules) {
    for (let i = 0; i < update.length; i++) {
        for (let j = i; j < update.length; j++) {
            let c = update[i] + '|' + update[j];
            if (rules.includes(c)) {
                let tmp = update[i];
                update[i] = update[j];
                update[j] = tmp;
            }
        }
    }
    return update;
}


main();