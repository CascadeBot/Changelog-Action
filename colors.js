const colors = {
    green: '#84D6A2',
    orange: '#FFBB5F',
    blue: '#989FFF',
    red: '#FF7474',
    black: '#000000'
};

function getColor(name) {
    if (name.startsWith('#'))
        return parseInt(name.replace('#', ''), 16);
    let color = colors[name.toLowerCase()];
    if (typeof color === 'undefined')
        return 0;
    color = color.replace('#', '');
    return parseInt(color, 16);
}

module.exports = {
    colors,
    getColor,
};
