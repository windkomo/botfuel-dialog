/**
 * Adapts messages.
 */
class Adapter {
  constructor(bot, config) {
    console.warn('Adapter.constructor', '<bot>', config);
    this.config = config;
    this.bot = bot;
  }

  async play(userMsgs) {
    console.warn('Adapter.play', userMsgs);
    throw new Error('Not implemented!');
  }

  async run() {
    console.warn('Adapter.run');
    throw new Error('Not implemented!');
  }

  /**
   * @param botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    console.warn('Adapter.send', botMessages);
    throw new Error('Not implemented!');
  }
}

module.exports = Adapter;
