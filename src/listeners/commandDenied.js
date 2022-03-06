const { Listener } = require('@sapphire/framework');

class CommandDeniedListener extends Listener {

  /**
   * 
   * @param { Error } error 
   * @param { String } message 
   */
  run(error, { message }) {
    message.delete();
    console.log(`error name logging: ${error.name}`);
  }
}

module.exports = { CommandDeniedListener }