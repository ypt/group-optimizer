// Using the following crossover algorithm:
// http://www.otlet-institute.org/wikics/Grouping_Genetic_Algorithms.html#toc-Section-5
// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.56.344&rep=rep1&type=pdf
//
// 1. A crossing site is chosen in each parent.
// 2. The bins selected by the crossing site of one parent are inserted at the
//    crossing site of the second parent. At this stage, some objects may appear
//    in more than one bin.
// 3. The existing bins containing objects that are already in the inserted bins
//    are eliminated, i.e. some objects are no longer in a bin. If some bins are
//    empty, they are also removed from the solution.
// 4. The objects left aside are reinserted into the solution.

var _ = require('lodash');

var crossover = function(a, b) {
  // create child 1
  // choose crossing points
  var cxa1 = _.random(a.length - 1);
  var cxa2 = _.random(a.length - 1);

  var cloneA = _.clone(a, true);
  var cloneB = _.clone(b, true);

  // insert items from parent a crossing point into parent b
  var itemsToInsert = _.slice(cloneA, _.min([cxa1, cxa2]), _.max([cxa1, cxa2]));
  var son = crossoverInsert(cloneB, itemsToInsert);

  // create child 2
  // insert items from parent b crossing point into parent a
  var cxb1 = _.random(b.length - 1);
  var cxb2 = _.random(b.length - 1);

  var cloneA2 = _.clone(a, true);
  var cloneB2 = _.clone(b, true);

  // insert items from parent a crossing point into parent b
  var itemsToInsert2 = _.slice(cloneB, _.min([cxb1, cxb2]), _.max([cxb1, cxb2]));
  var daughter = crossoverInsert(cloneA2, itemsToInsert2);

  return [son, daughter];

};

var crossoverInsert = function(oldSet, newGroups){

  // The data structure for `oldSet` looks something like this:
  // [
  //   [1, 5, 3, 4], // this is a representation of a group, with member ids
  //   [2, 6, 7, 16],
  //   ...
  // ]

  // The data structure for `newGroups` looks something like this:
  // [
  //   [3, 4, 7, 8], // this is a representation of a group, with member ids
  //   [2, 6, 14, 10],
  //   ...
  // ]

  var newSet = _.clone(oldSet, true);
  var groupsToInsert = _.clone(newGroups, true);

  if (groupsToInsert.length < 1){
    return newSet;
  }

  // remove any current group with duplicate items in new items to insert
  var groupsRemoved = [];
  var membersToRemove = _.flatten(groupsToInsert);

  _.each(membersToRemove, function(memberId){
    // remove group if it contains the member
    var newGroupRemoved = _.remove(newSet, function(group){
      return _.indexOf(group, memberId) > -1;
    });

    // save the groups removed here
    if (newGroupRemoved.length > 0){
      groupsRemoved.push(newGroupRemoved[0]);
    }

  });

  // insert new groups into set
  _.each(groupsToInsert, function(group){
    newSet.push(group);
  });

  // re-insert missing members into set
  // we can clean up groupsRemoved using membersToRemove to find these
  var membersRemoved = _.flatten(groupsRemoved);
  var membersToReinsert = _.difference(membersRemoved, membersToRemove);

  _.each(membersToReinsert, function(memberId){
    // randomly choose a group to re-insert the member
    var i = _.random(newSet.length - 1);
    newSet[i].push(memberId);
  });

  return newSet;
};

module.exports = crossover;
