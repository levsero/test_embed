import { stopWords } from 'mixin/stopWords';

export var stopWordsFilter = function(str) {
  var words = str.replace(/[!"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, ' ').split(' ');

  words = _.filter(words, function(word) {
    if (stopWords.indexOf(word.toLowerCase()) === -1) {
      return word;
    }
  });

  return words.join(' ');
};

