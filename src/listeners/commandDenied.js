const { Listener } = require('@sapphire/framework');

class CommandDeniedListener extends Listener {
  run(error, { message }) {
    message.delete();
  }
}

module.exports = { CommandDeniedListener }