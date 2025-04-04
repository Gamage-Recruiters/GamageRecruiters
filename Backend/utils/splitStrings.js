function splitString (str) {
    if(!str) {
        return 'enter a string';
    }

    const part1 = str.split(' ')[0];
    const part2 = str.split(' ')[1];

    return [part1, part2];
}

module.exports = splitString;