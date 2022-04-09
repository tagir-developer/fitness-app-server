const usersResolvers = require('./users');

const rootResolver = {};

const resolvers = [rootResolver, usersResolvers];

module.exports = resolvers;
