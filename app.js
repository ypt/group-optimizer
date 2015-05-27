// https://github.com/ypt/genetic-js
'use strict';

var Genetic = require('genetic-js');
var _ = require('lodash');
var seed = require('./lib/seed');
var mutate = require('./lib/mutate');
var crossover = require('./lib/crossover');
var fitness = require('./lib/fitness');
var data = require('./lib/data')

var genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

// TODO:
// - test with more realistic data
// - refine fitness function
// - refactor into browser runnable version?
// - csv input
// - tests

genetic.seed = seed;
genetic.mutate = mutate;
genetic.crossover = crossover;
genetic.fitness = fitness;

genetic.generation = function(pop, generation, stats) {
  console.log(generation);
  console.log(pop[0].fitness);
  console.log(_.map(pop[0].entity, function(group){
    return _.map(group, function(memberId){
      return data.getMemberData(memberId);
    });
  }));;
};

var userData = data.getUserData();

var config = {
  "iterations": 100
  , "size": 250
  , "crossover": 0.3
  , "mutation": 0.3
  , "skip": 20
  , "webWorkers": false
};

genetic.evolve(config, userData);
