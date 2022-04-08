const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./utils/database');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolver');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const PORT = process.env.PORT || 5000;

const app = express();

// const schema = makeExecutableSchema({
//   typeDefs: `type Query {
//     _empty: String
//   }`,
//   resolvers: {},
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
  })
);

async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
