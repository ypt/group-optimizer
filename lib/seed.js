// generate member ids using the index

var _ = require('lodash');
var data = require('./data');

module.exports = function(){

  var memberIds = _.map(data.getUserData().dataSet, function(value, index){
    return index;
  });
  var newGroups = [];

  var shuffledMemberPool = _.shuffle(memberIds);
  var groupSize = shuffledMemberPool.length/data.getUserData().totalGroups;

  while (shuffledMemberPool.length > 0) {
    var newGroup = [];

    while (newGroup.length <= groupSize && shuffledMemberPool.length > 0) {
      newGroup.push(_.pullAt(shuffledMemberPool, 0)[0]);
    }

    newGroups.push(newGroup);
  }

  return newGroups
};
