async function main() {
    // const data = await getData('test.txt');
    const data = await getData('input.txt');

    let splitted = data.split('\r\n\r\n');
    const patterns = splitted[0].split(', ');
    const designs = splitted[1].split('\r\n');

    const possibleDesigns = designs.reduce((sum , design) => sum + (isPossibleDesign(design, '') > 0 ? 1 : 0), 0) || 0;
    console.log(`Part 1: ${possibleDesigns} buildable designs`);

    let cache = new Map();
    const allPatternCombinations = designs.reduce((sum , design) => sum + getAllPossibilePatternCombination(design), 0) || 0;
    console.log(`Part 2: ${allPatternCombinations} possible combination`);
    

    // part 1 
    // is fast enough due to short circuit of || operator ( I thinks )
    function isPossibleDesign(design, pattern){
        // exit condition
        if(pattern == design){
            return true;
        }
        // get possible path for current section
        const _patterns = []
        for(const _pattern of patterns){
            if(design.slice(pattern.length).indexOf(_pattern) == 0){
                _patterns.push(_pattern);
            }
        }
        // no pattern found
        if(_patterns.length == 0){
            return false;
        } else {
            // recursive call to find next pattern of every pattern found
            let branches = false;
            for(const _pattern of _patterns){
                branches = branches || isPossibleDesign(design, pattern+_pattern);
            }
            return branches;
        }
    }

    // part 2 
    // used memoization to speed up recursion
    function getAllPossibilePatternCombination(design){
        cache = new Map();
        return getNextPattern(design, '');
    }
    

    function getNextPattern(design, pattern){
        // exit condition
        if(pattern == design){
            return 1;
        }
        if(cache.has(`${design}|${pattern}`)){
            return cache.get(`${design}|${pattern}`);
        }
        // get possible path for current section
        const _patterns = []
        for(const _pattern of patterns){
            if(design.slice(pattern.length).indexOf(_pattern) == 0){
                _patterns.push(_pattern);
            }
        }
        // no pattern found
        if(_patterns.length == 0){
            return 0;
        } else {
            let branches = 0;
            // recursive call to find next pattern of every pattern found
            for(const _pattern of _patterns){
                branches += getNextPattern(design, pattern+_pattern);
            }
            cache.set(`${design}|${pattern}`, branches);
            return branches;
        }
    }
}




main();