import { stopWords } from 'mixin/stopWords';

export var filter = function(str) {
  var words;

  str = str.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,' ')
           .replace(/\s{2,}/g,' ');

  words = str.match(/[^\s]+|\s+[^\s+]$/g);

  _.forEach(words, function(word, i) {
    _.forEach(stopWords, function(stopWord) {
      if(word.toLowerCase() === stopWord) {
        words[i] = '';
      }
    });
  });

  str = words.join(' ');

  return str;
};

