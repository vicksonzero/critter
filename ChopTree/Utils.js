exports.indent = function (str, char, level) {
    return str.split('\n')
        .map(line => char.repeat(level) + line)
        .join('\n')
        ;
}