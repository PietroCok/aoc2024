async function main(){
    const data = await getData('input_test.txt');
    //console.log(data);

    const orderRules = data.split('\r\n\r\n')[0].split('\r\n').map(o => o.split('|'));
    const pages = data.split('\r\n\r\n')[1].split('\r\n').map( p => p.split(','));
    
    console.log(orderRules);
    console.log(pages);
    
    


    
}


main();