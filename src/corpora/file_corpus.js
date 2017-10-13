const fs = require('fs');
const Corpus = require('./corpus');

class FileCorpus extends Corpus {
  constructor(path, separator = ',') {
    super();
    this.path = path;
    this.separator = separator;
    this.init();
  }

  init() {
    this.matrix = fs
      .readFileSync(this.path, 'utf8') // TODO: async?
      .toString()
      .split('\n')
      .filter(Boolean) // remove any empty line
      .map(row => row.split(this.separator));
  }
}

module.exports = FileCorpus;
