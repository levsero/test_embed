const fs = require('fs');
const onlyScripts = require('./util/scriptFilter');
const tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
