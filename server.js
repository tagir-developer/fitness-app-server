require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./utils/database');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const graphqlResolver = require('./resolvers');
const tokenService = require('./service/tokenService');

const PORT = process.env.PORT || 5000;

const app = express();

const schema = makeExecutableSchema({
  typeDefs: loadSchemaSync('schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  }),
  resolvers: graphqlResolver,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   // извлечь токен из заголовков запроса
//   const token = req.header('Authorization');

//   // TODO: верифицировать токен

//   // TODO: привязать пользователя

//   // позже мы можем обратиться к свойству isAuthenticated
//   // в функциях распознавания, чтобы проверить,
//   // был ли пользователь аутентифицирован
//   req.isAuthenticated = Boolean(token);

//   // вызовите следующее промежуточное программное обеспечение
//   // когда пользователь либо аутентифицирован, либо нет
//   next();
// });

// app.use((req, res, next) => {
//   try {
//     const authorizationHeader = req.headers.authorization;

//     console.log('Значение - authorizationHeader', authorizationHeader);

//     if (!authorizationHeader) {
//       return next(new Error(401, 'Пользователь не авторизован'));
//     }

//     const newAccessToken = authorizationHeader.split(' ')[1];

//     if (!newAccessToken) {
//       return next(new Error(401, 'Пользователь не авторизован'));
//     }

//     const userData = tokenService.validateAccessToken(newAccessToken);

//     if (!userData) {
//       return next(new Error(401, 'Пользователь не авторизован'));
//     }

//     req.user = userData;
//     req.isAuthenticated = true;

//     next();
//   } catch (e) {
//     return next(new Error(401, 'Пользователь не авторизован'));
//   }
// });

app.use((req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  const isNotAuthenticatedHandler = (req, next) => {
    req.user = null;
    req.isAuthenticated = false;
    next();
  };

  if (!authorizationHeader) {
    return isNotAuthenticatedHandler(req, next);
  }

  const newAccessToken = authorizationHeader.split(' ')[1];

  if (!newAccessToken) {
    return isNotAuthenticatedHandler(req, next);
  }

  const userData = tokenService.validateAccessToken(newAccessToken);

  if (!userData) {
    return isNotAuthenticatedHandler(req, next);
  }

  req.user = userData;
  req.isAuthenticated = true;
  next();
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

async function start() {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
