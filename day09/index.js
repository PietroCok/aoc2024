async function main() {
    // const data = await getData('input_test.txt');
    const data = await getData('input.txt');

    // console.log(data);

    const disk = [];

    let id = 0;
    for (let [index, char] of data.split('').entries()) {
        if (index % 2 == 0) {
            addToDisk(disk, id, Number(char))
            id++;
        } else {
            addToDisk(disk, '.', Number(char))
        }
    }

    console.log('Starting disk allocation: ', disk.join(''));

    // part 1 solution
    // compactDisk(disk);

    // part 2 solution
    compactWholeFiles(disk);
    console.log("Compressed disk: ", disk, disk.join(''));

    let checksum = getCheckSum(disk);
    console.log('disk checksum: ', checksum);

}

function addToDisk(disk, value, n) {
    for (let i = 0; i < n; i++) {
        disk.push(value);
    }
}

function compactDisk(disk) {
    let firstFree = disk.indexOf('.');
    while (firstFree >= 0) {
        let file = getLastFile(disk)
        if (file[0] < firstFree) {
            break;
        }

        // move file to first free space
        disk[file[0]] = '.';
        disk[firstFree] = file[1];

        firstFree = disk.indexOf('.');
    }

    console.log("Compressed disk: ", disk.join(''));
}

function compactWholeFiles(disk, fileId = null) {

    while (fileId >= 0) {
        // use fileId to identify the file to check for
        // get last file with start and end index
        let file = [];
        for (let i = disk.length - 1; i >= 0; i--) {
            if (disk[i] != '.' && (fileId == null || fileId == disk[i])) {
                if (file.length == 0) {
                    fileId = disk[i];
                    file.push(i);
                }
            } else {
                if (file.length > 0) {
                    file.push(i + 1);
                    break;
                }
            }
        }
        let fileLength = file[0] - file[1] + 1;
        // console.log('Trying to find space for file: ' + fileId);

        // find free space large enough for selected file size
        let firstFree = getFirstFree(disk, 0, file[1], fileLength);

        if (firstFree.length > 0) {
            write(disk, firstFree[0], firstFree[0] + fileLength - 1, fileId);
            write(disk, file[1], file[0], '.');
            console.log(`FileId: ${fileId} moved from index ${file[1]} to index ${firstFree[0]}`);            
        } else {
            console.log('Space not found for fileid: ' + fileId);

        }
        fileId--;
    }
}

function getFirstFree(disk, startIndex, endIndex, size) {
    let free = [];
    if (startIndex >= endIndex) return free;
    for (let i = startIndex; i < disk.length; i++) {
        if (disk[i] == '.' && free.length == 0) {
            free.push(i);
        } else if (disk[i] != '.' && free.length > 0) {
            free.push(i - 1);
            let freeSpace = free[1] - free[0] + 1;
            if (freeSpace >= size && free[0] < endIndex) {
                return free;
            } else {
                return getFirstFree(disk, i, endIndex, size);
            }
        }
    }

    return free;
}

function write(disk, start, end, char) {
    for (let i = start; i <= end; i++) {
        disk[i] = char;
    }
}

function getCheckSum(disk) {
    let res = 0;
    for (let [index, id] of disk.entries()) {
        if (id != '.'){
            res += index * id;
        }
    }
    return res;
}

function getLastFile(disk) {
    for (let i = disk.length - 1; i >= 0; i--) {
        if (disk[i] != '.') {
            return [i, disk[i]]
        }
    }
}

main();
