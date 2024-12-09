
async function main() {
  const url = './input.txt';

  let data = await fetch(url).then((res) => {
    if (res.ok) {
      return res.text();
    }
  });

  data = data.match(/(do\(\))|(don't\(\))|(?<=mul\()\d{1,3},\d{1,3}(?=\))/mg);

  //console.log(data);

  let result = 0;
  let valid = true;
  for(let ins of data){
    if(ins == "don't()"){
      valid = false;
    }else if(ins == "do()"){
      valid = true;
    } else {
      if(valid){
        ins = ins.split(",");
        result += ins[0] * ins[1];
      }
    }
  }

  console.log(result);

}



main();
