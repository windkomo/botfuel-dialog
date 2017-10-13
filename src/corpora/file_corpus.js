const fs = require('fs');
const Corpus = require('./corpus');

class FileCorpus extends Corpus {
  constructor(label, dirname, separator = ',') {
    super();
    this.dirname = dirname;
    this.label = label.toLowerCase();
    this.separator = separator;
    this.init();
  }

  init() {
    this.matrix = fs
      .readFileSync(this.getFileCorpusPath(), 'utf8') // TODO: async?
      .toString()
      .split('\n')
      .filter(Boolean) // remove any empty line
      .map(row => row.split(this.separator));
  }

  getFileCorpusPath() {
    const label = this.label;
    const paths = [
      `${this.dirname}/corpus/${label}.corpus`,
      `${this.dirname}/corpus/${label}`,
      `${__dirname}/corpus/${label}.corpus`,
      `${__dirname}/corpus/${label}`,
    ];
    return paths.find(fs.existsSync) || null;
  }
}

module.exports = FileCorpus;
