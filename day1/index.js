


async function getInput(){
  const url = './input.txt';

  let data = await fetch(url).then((res) => {
    if(res.ok){
      return res.text();
    }
  });

  let leftCol = [], rightCol = [];

  data = data.replaceAll(/\s+/g, " ").split(" ");

  data = data.map(x => Number(x));

  for(let i = 0; i < data.length; i++){
    if(i % 2 == 0){
      leftCol.push(data[i])
    } else {
      rightCol.push(data[i])
    }
  }

  leftCol = leftCol.sort();
  rightCol = rightCol.sort();

  let dist = 0;

  for(let i = 0; i < leftCol.length; i++){
    dist += Math.abs(leftCol[i] - rightCol[i]);
  }

  console.log(dist)



  // calculate similarty score
  let score = 0;
  for(let num of leftCol){
    score += num * count(num, rightCol)
  }
  console.log(score);
  
}

function count(input, list){
  let n = 0;
  for(let num of list){
    if(num == input){
      n++;
    }
  }
  return n;
}

getInput();