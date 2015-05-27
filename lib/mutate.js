// return entity mutated

var _ = require('lodash');

module.exports = function(entity){

  // randomly swap two members
  var group1 = entity[_.random(entity.length - 1)];
  var memberIndex1 = _.random(group1.length -1);

  // NOTE: sometimes group2 may be the same as group 1, but that's probably ok
  var group2 = entity[_.random(entity.length - 1)];
  var memberIndex2 = _.random(group2.length -1);

  // swap
  // var memberClone1 = _.clone(group1[memberIndex1]);
  var memberClone1 = group1[memberIndex1];
  group1[memberIndex1] = group2[memberIndex2];
  group2[memberIndex2] = memberClone1;

  // console.log(entity);
  return entity
};
