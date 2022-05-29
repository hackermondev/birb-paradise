const { Velocity } = require('velocity-api');

class Perspective {
    /**
     *
     * @param { String } apiKey
     */
    constructor(apiKey) {
        this.velocity = new Velocity(apiKey);
    }

    /**
     *
     * @param { String } text
     */
    async analyzeSpam(text) {
        const analysis = await this.velocity.processMessage(text, {
            attributes: ['SPAM'],
            languages: ['en'],
            doNotStore: true,
        });
        return analysis.SPAM;
    }
}

module.exports = { Perspective };
