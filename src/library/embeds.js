const { MessageEmbed } = require('discord.js');

class CoolEmbeds extends MessageEmbed {
    constructor(user = null, color = Colors.Neutral) {
        super();
        if (user) this.setUser(user);
        if (color) this.setColor(color);

        this.setTimestamp();
    }

    setUser(user) {
        // this.setThumbnail(user.displayAvatarURL())
        this.setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL(),
        });
    }
}

function ErrorEmbed(text, user) {
    const e = new MessageEmbed();
    e.setDescription(text);
    e.setColor(Colors.Error);
    e.setFooter(`Requested by ${user.tag}`);

    return e;
}

function SimpleEmbed(text, user) {
    const e = new MessageEmbed();
    e.setDescription(text);
    e.setColor(Colors.Success);
    e.setFooter(`Requested by ${user.tag}`);

    return e;
}

const Colors = {
    Success: '#10ffff',
    Error: '#FF0000',
    Neutral: '#FFFF00',
};

module.exports = { CoolEmbeds, ErrorEmbed, SimpleEmbed, Colors };
