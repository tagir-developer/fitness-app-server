const exerciseResolvers = require('./exercises');
const muscleResolvers = require('./muscles');
const trainingProgramResolvers = require('./trainingPrograms');
const usersResolvers = require('./users');

const rootResolver = {};

const resolvers = [
  rootResolver,
  usersResolvers,
  trainingProgramResolvers,
  exerciseResolvers,
  muscleResolvers,
];

module.exports = resolvers;
