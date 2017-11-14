const _ = require('underscore');
const logger = require('logtown')('RegexExtractor');

/**
 * Extracts regular expressions
 */
class RegexExtractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    this.dimension = parameters.dimension;
    this.regex = parameters.regex;
  }

  /**
   * Computes entities from a sentence
   * @async
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>} the entities
   */
  async compute(sentence) {
    logger.debug('compute', sentence);
    const m = this.regex.exec(sentence);
    if (m) {
      return [m[0]];
    } else {
      return [];
    }
  }
}

module.exports = WsExtractor;
