// https://github.com/ypt/genetic-js
/*jslint node: true */
'use strict';

var Genetic = require('genetic-js');
var _ = require('lodash');
var seed = require('./lib/seed');
var mutate = require('./lib/mutate');
var crossover = require('./lib/crossover');
var fitness = require('./lib/fitness');
var data = require('./lib/data');

var genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

// TODO:
// - tests

genetic.seed = seed;
genetic.mutate = mutate;
genetic.crossover = crossover;
genetic.fitness = fitness;

genetic.generation = function(pop, generation, stats) {
  console.log("Generation #" + generation.toString());
  console.log("Overall Fitness: " + pop[0].fitness.toString());

  // the last iteration
  if (generation == config.iterations - 1){
    console.log("Result:");

    var item = pop[0];

    var groupCount = 0;
    _.each(item.entity, function(group){
      groupCount++;

      var aggregateData = {
        male: 0,
        female: 0,
        mon: 0,
        tues: 0,
        wed: 0,
        thurs: 0,
        fri: 0,
        location1: 0,
        location2: 0,
        location3: 0,
        location4: 0,
        location5: 0
      };

      _.each(group, function(memberId){
        var memberData = data.getMemberData(memberId);

        // aggregate data for convenience

        if (memberData.gender === 0){
          aggregateData.male++;
        }
        else{
          aggregateData.female++;
        }

        _.each(memberData.dayPreferences, function(day){
          if (day == 1){
            aggregateData.mon++;
          }
          else if(day == 2){
            aggregateData.tues++;
          }
          else if(day == 3){
            aggregateData.wed++;
          }
          else if(day == 4){
            aggregateData.thurs++;
          }
          else if(day == 5){
            aggregateData.fri++;
          }
        });

        _.each(memberData.locationPreferences, function(location){
          if (location == 1){
            aggregateData.location1++;
          }
          else if (location == 2){
            aggregateData.location2++;
          }
          else if (location == 3){
            aggregateData.location3++;
          }
          else if (location == 4){
            aggregateData.location4++;
          }
          else if (location == 5){
            aggregateData.location5++;
          }
        });

        // print item details

        console.log(
          "Group " + groupCount.toString() + "\t" +
          memberData.fullName + "\t" +
          memberData.gender + "\t" +
          memberData.dayPreferences.toString() + "\t" +
          memberData.locationPreferences.toString()
        );
      });

      // print aggregate data
      console.log(aggregateData);
    });
  }
};

var config = {
  "iterations": 1500,
  "size": 250,
  "crossover": 0.3,
  "mutation": 0.3,
  "skip": 20,
  "webWorkers": false
};

// read data from file and start running the process when we're read in all the data
data.readCSV('input-data.csv', function(){
  var userData = data.getUserData();

  genetic.evolve(config, userData);
});
