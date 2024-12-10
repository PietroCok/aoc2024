
async function main() {
  const url = './input.txt';

  let data = await fetch(url).then((res) => {
    if (res.ok) {
      return res.text();
    }
  });

  let reports = data.split('\r\n');
  reports = reports.map(r => {
    return r.split(' ').map(str => Number(str));
  })

  //console.log(reports);
  //return
  let count = 0;
  for(const [index, rep] of reports.entries()){
    console.log(index, rep, checkReport(rep));
    
    count += checkReport(rep);
  }
  console.log(count);
}

function checkReport(report) {
  //console.log('cheking report: ', report);
  
  let isOrdered = true;
  let isValidDiff = true;
  let isModified = false;

  if(!checkOrdered(report)){
    //console.log('unsafe => order');
    for(let i = 0; i < report.length; i++){
      //console.log('retry => new report', report.toSpliced(i, 1));
      if(checkOrdered(report.toSpliced(i, 1))){
        // check for diff
        if(checkDiff(report.toSpliced(i, 1))){
          report.splice(i, 1);
          isOrdered = true;
          isModified = true;
          break;
        }
      }
      isOrdered = false;
    }
  }
  if (!isOrdered) {
    //console.log(report, 'unsafe => order');
    return false;
  }
  
  if(!checkDiff(report)){
    isValidDiff = false;
    if(!isModified){
      //console.log('unsafe => diff');
      for(let i = 0; i < report.length; i++){
        //console.log('retry => new report ', report.toSpliced(i, 1));
        if(checkDiff(report.toSpliced(i, 1))){
          report.splice(i, 1);
          isValidDiff = true;
          break;
        }
        isValidDiff = false;
      }
    }
  }
  if (!isValidDiff) {
    //console.log(report, 'unsafe => diff');
    return false;
  }

  //console.log(report, 'safe');
  return true;
}

function checkOrdered(report) {
  // check for all decreasing or all incresing
  const asc = report.toSorted((a, b) => a - b);
  const desc = report.toSorted((a, b) => b - a);

  // check sort
  if (!compareArr(report, asc) && !compareArr(report, desc)) {
    return false;
  }
  return true;
}

function compareArr(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function checkDiff(report){
  for (let i = 0; i < report.length - 1; i++) {
    let curr = report[i];
    let next = report[i + 1];
    let diff = Math.abs(next - curr);
    if (diff > 3 || diff < 1) {
      return false;
    }
  }
  return true;
}

main();


// 318 -> low

// 569 -> high