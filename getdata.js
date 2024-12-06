async function getData(filePath){
    const data = fetch(filePath).then(res => res.text());
    return data;
}