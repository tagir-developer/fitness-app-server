const { buildSchema } = require('graphql');
const test = require('./test.graphql');

const schema = buildSchema(test);

// const schema = buildSchema(`

// 	type User {
// 		id: ID!
// 		userName: String
// 		email: String!
// 		password: String!
// 		age: Int
// 	}

// 	input UserInput {
// 		email: String!
// 		password: String!
// 	}

// 	type Query {
// 		getAllUsers: [User]!
// 		getUser(id: ID!): User!
// 	}

// 	type Mutation {
// 		createUser(user: UserInput!): User!
// 	}

// `);

module.exports = schema;
