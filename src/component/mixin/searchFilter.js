import { stopWords } from 'mixin/stopWords';

export var filter = function(str) {
  var words = str.replace(/\W/g, ' ').split(' ');

  words = _.filter(words, function(word) {
    if(stopWords.indexOf(word.toLowerCase()) === -1) {
      return word;
    }
  });

  return words.join(' ');
};

