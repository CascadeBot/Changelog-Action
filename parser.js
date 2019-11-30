const { getColor } = require('./colors.js');

function parseTitle(str) {
    return {
        data: {
            title: str,
        }
    };
}

function parseDescription(str) {
    return {
        data: {
            description: str
        }
    }
}

function parseColor(str) {
    return {
        data: {
            color: getColor(str)
        }
    }
}

function parseImage(str) {
    return {
        data: { 
            image: {
                url: str
            }
        }
    }
}

function parseFooter(str) {
    return {
        data: {
            footer: {
                text: str
            }
        }
    }
}

function parseField(str) {
    return {
        key: 'fields',
        data: [{
            name: str.substring(0, str.indexOf("\n")),
            value: str.substring(str.indexOf("\n") + 1)
        }]
    };
}

const commands = {
    "t": parseTitle,
    "d": parseDescription,
    "c": parseColor,
    "i": parseImage,
    "f": parseField,
    "if": parseField,
    "fo": parseFooter
};

function handleCommand(currentCommand, currentScope, outputEmbed) {
    const output = commands[currentCommand](currentScope.trim());
    if (typeof output.key === 'undefined') {
        outputEmbed = {...outputEmbed, ...output.data};
    } else {
        if (Array.isArray(output.data)) {
            if (typeof outputEmbed[output.key] === 'undefined')
                outputEmbed[output.key] = [];
            outputEmbed[output.key] = [...outputEmbed[output.key], ...output.data];
        } else if (typeof output.data === 'object') {
            if (typeof outputEmbed[output.key] === 'undefined')
                outputEmbed[output.key] = {};
            outputEmbed[output.key] = {...outputEmbed[output.key], ...output.data};
        }
    }
    return (outputEmbed);
}

function getEmbedsFromBody(body) {
    let parsingChangelog = false
    let currentCommand = "";
    let currentScope = "";
    let outputEmbeds = [];
    let outputEmbed = {};
    
    body = body.replace("\r", "");
    body.split("\n").forEach(line => {
        console.log(line);
        if (line === "[changelog]") {
            if (parsingChangelog) {
                if (currentCommand.length !== 0)
                    outputEmbed = handleCommand(currentCommand, currentScope, outputEmbed);
                outputEmbeds.push(outputEmbed);
                currentScope = "";
                currentCommand = "";
                outputEmbed = {};
            }
            parsingChangelog = true;
            return;
        }
        if (!parsingChangelog) return;

        if (line.startsWith(";")) {
            let command = line.substring(1, line.indexOf(" "));
            let arg = line.substring(line.indexOf(" ") + 1);

            if (currentCommand.length !== 0) {
                outputEmbed = handleCommand(currentCommand, currentScope, outputEmbed);
                currentScope = "";
            }
            currentCommand = command;
            currentScope += currentScope.length === 0 ? arg : "\n" + arg;
        }
        else
            currentScope += currentScope.length === 0 ? line : "\n" + line;
    });
    if (currentCommand.length !== 0)
        outputEmbed = handleCommand(currentCommand, currentScope, outputEmbed);
    outputEmbeds.push(outputEmbed);
    return outputEmbeds;
}

module.exports = {
    getEmbedsFromBody,
}