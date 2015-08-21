// generate member ids using the index

var _ = require('lodash');
var data = require('./data');

module.exports = function(){

  var memberIds = _.map(data.getUserData().dataSet, function(value, index){
    return index;
  });

  var newGroups = [];
  var totalGroups = data.getUserData().totalGroups;

  for (var i = 0; i < totalGroups; i++) {
    newGroups.push([]);
  }

  var shuffledMemberPool = _.shuffle(memberIds);
  var groupSize = shuffledMemberPool.length/totalGroups;

  // rotate groups and randomly push members into each
  var j = 0;
  while (shuffledMemberPool.length > 0) {
    var newGroup = newGroups[j];
    newGroup.push(_.pullAt(shuffledMemberPool, 0)[0]);

    if (j < totalGroups - 1) {
      j++;
    }
    else {
      j = 0;
    }
  }

  return newGroups;
};
