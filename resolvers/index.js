const exerciseResolvers = require('./exercises');
const trainingProgramResolvers = require('./trainingPrograms');
const usersResolvers = require('./users');

const rootResolver = {};

const resolvers = [
  rootResolver,
  usersResolvers,
  trainingProgramResolvers,
  exerciseResolvers,
];

module.exports = resolvers;
