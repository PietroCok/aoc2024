
async function main() {
  const url = './input.txt';
  // const url = './input_test.txt';

  let data = await fetch(url).then((res) => {
    if (res.ok) {
      return res.text();
    }
  });

  console.log(data);

  //part1(data);
  part2(data);
}

function part1(data){
  const str = 'XMAS';
  const rev = 'SAMX';
  let count = 0;

  const lines = getLines(data);
  console.log(lines);
  
  const colums = getColumns(data);
  console.log(colums);

  const diagonals = getDiagonals(data, str.length);
  console.log(diagonals);
 
  for(let line of lines){
    count += countOccurences(line, str);
    count += countOccurences(line, rev);
  }

  for(let colum of colums){
    count += countOccurences(colum, str);
    count += countOccurences(colum, rev);
  }

  for(let diag of diagonals){
    count += countOccurences(diag, str);
    count += countOccurences(diag, rev);
  }
  
  console.log(count);
}

function part2(data){
  const lines = getLines(data);
  console.log(lines);

  const valid_patterns = [
    'MMSS', 'SMMS', 'SSMM', 'MSSM'
  ];

  
  let count = 0;
  let a = 0;
  for(let i = 1; i < lines.length -1 ; i++){
    console.log('row: ', i);
    
    for(let j = 1; j < lines[i].length - 1; j++){
      if(lines[i].charAt(j) == 'A'){
        a++;
        let top_left = lines[i-1].charAt(j-1);
        let top_right = lines[i-1].charAt(j+1);
        let bottom_left = lines[i+1].charAt(j-1);
        let bottom_right = lines[i+1].charAt(j+1);

        let pattern = top_left + top_right + bottom_right + bottom_left;

        console.log(pattern, valid_patterns.includes(pattern));
        
        count += valid_patterns.includes(pattern);        
      }
    }
  }

  console.log(a, count);
  // total possibile 4867
  // 279 -> low
  // 494 -> low
}


function getLines(string){
  return string.split('\r\n');
}

function getColumns(string){
  
  const lines = getLines(string);
  const colums = [];
  for(let i = 0; i < lines[0].length; i++){
    const tmp = []
    for(let j = 0; j < lines.length; j++){
      tmp.push(lines[j][i]);
    }
    colums.push(tmp.join(""));
  }

  return colums;
}

function getDiagonals(string, maxLength){
  let lines_A = getLines(string);
  let lines_B = [...lines_A];
  let startCount = lines_A.length - 1;
  let endCount = 0;
  for(let i = 0; i < lines_A.length; i++){
    for(let j = 0; j < startCount; j++){
      lines_A[i] = '*' + lines_A[i];
      lines_B[i] += '*';
    }

    for(let j = 0; j < endCount; j++){
      lines_A[i] += '*';
      lines_B[i] = '*' + lines_B[i];
    }
    startCount--;
    endCount++;
  }
  
  let col_A = getColumns(lines_A.join("\r\n"));
  let col_B = getColumns(lines_B.join("\r\n"));

  return [...col_A, ...col_B]
}

function countOccurences(string, keyword){
  let regex = new RegExp(keyword, 'g');
  return string.match(regex)?.length | 0;
}

main();


