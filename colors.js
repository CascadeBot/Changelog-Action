const colors = {
    blue: '#232323',
};

function getColor(name) {
    if (name.startsWith('#'))
        return parseInt(name.replace('#', ''), 10);
    let color = colors[name.toLowerCase()];
    if (typeof color === 'undefined')
        return (false);
    color = color.replace('#', '');
    return parseInt(color, 10);
}

module.exports = {
    colors,
    getColor,
};
