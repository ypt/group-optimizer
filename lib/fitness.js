var _ = require('lodash');
var ss = require('simple-statistics');
var data = require('./data')

var fitness = function(entity) {

  var newFitness = 0
  _.forEach(entity, function(group){
    newFitness += groupFitness(group);
  });

  return newFitness;
};


var groupFitness = function(groupMembers){
  // date preference 1
  var dateChoices = _.map(groupMembers, function(item){
    return data.getMemberData(item)[1]; //this is the first choice date
  });

  var dateStdDev = ss.standard_deviation(dateChoices)

  // location preference
  var locationChoices = _.map(groupMembers, function(item){
    return data.getMemberData(item)[3]; //this is the first choice date
  });

  var locationStdDev = ss.standard_deviation(locationChoices);

  // TODO:
  // * group size
  // * evenly distribute gender
  // * evenly distribute new and old members
  // * probability of attendence

  // sum up the various aspects of fitness
  var newFitness = 1/(1+dateStdDev) + 1/(1+locationStdDev)
  // var newFitness = 1/(1+locationStdDev)

  return newFitness;
};

module.exports = fitness;
