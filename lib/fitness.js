var _ = require('lodash');
var ss = require('simple-statistics');
var data = require('./data');

var fitness = function(entity) {

  var newFitness = 0;
  _.forEach(entity, function(group){
    newFitness += groupFitness(group);
  });

  return newFitness;
};

var groupFitness = function(groupMembers){

  // let fitness for a group be between 0 and 1
  var newFitness = 0;

  // gender ------------
  var idealGenderDistribution = 0.5;
  var genders = _.map(groupMembers, function(memberId){
    return data.getMemberData(memberId).gender;
  });

  var genderAvg = ss.mean(genders);
  var genderDistance = ss.max([idealGenderDistribution, genderAvg]) - ss.min([idealGenderDistribution, genderAvg]);
  var genderPercent = (idealGenderDistribution - genderDistance)/idealGenderDistribution;
  var genderFitness = Math.log(genderPercent*10) / Math.log(10); // this should max out at 1

  // date preferences -------------
  // Find most common preference in group.
  var dayPreferences = [];
  var countMembersWithDayPreferences = 0;
  _.each(groupMembers, function(memberId){
    var memberDayPreferences = data.getMemberData(memberId).dayPreferences;
    if (memberDayPreferences.length > 0){
      countMembersWithDayPreferences++;

      _.each(memberDayPreferences, function(day){
        dayPreferences.push(day);
      });
    }
  });

  var dayFitness = 1;
  if (dayPreferences.length > 0){
    var dayPercent = 1;
    var dayMode = ss.mode(dayPreferences);

    // Maximize percentage of people in group that chose that among their list of choices.
    var matchingDays = 0;
    _.each(dayPreferences, function(day){
      if (day == dayMode){
        matchingDays++;
      }
    });

    dayPercent = matchingDays/countMembersWithDayPreferences;
    if (dayPercent > 1){
      console.log("DAY PERCENT ERROR!!!!");
    }
    dayFitness = Math.log(dayPercent*10) / Math.log(10); // this should max out at 1
  }

  // location preferences -------------
  // Find most common preference in group.
  var locationPreferences = [];
  var countMembersWithLocationPreferences = 0;
  _.each(groupMembers, function(memberId){
    var memberLocationPreferences = data.getMemberData(memberId).locationPreferences;
    if (memberLocationPreferences.length > 0){
      countMembersWithLocationPreferences++;

      _.each(memberLocationPreferences, function(location){
        locationPreferences.push(location);
      });
    }
  });

  var locationFitness = 1;
  if (locationPreferences.length > 0){
    var locationPercent = 1;
    var locationMode = ss.mode(locationPreferences);

    // Maximize percentage of people in group that chose that among their list of choices.
    var matchingLocations = 0;
    _.each(locationPreferences, function(location){
      if (location == locationMode){
        matchingLocations++;
      }
    });

    locationPercent = matchingLocations/countMembersWithLocationPreferences;
    if (locationPercent > 1){
      console.log("LOCATION PERCENT ERROR!!!!");
    }
    locationFitness = Math.log(locationPercent*10) / Math.log(10); // this should max out at 1
  }

  // compute final fitness score -----------
  // apply weights to each facet
  // make sure the max possible is 1
  newFitness = 0.3*genderFitness + 0.35*dayFitness + 0.35*locationFitness;

  return newFitness;
};

module.exports = fitness;
