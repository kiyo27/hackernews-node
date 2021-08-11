// const { ApolloServer } = require('apollo-server-express')
const { ApolloServer, PubSub } = require('apollo-server')
const express = require('express')
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// apollo-server v3.0
// const { PubSub } = require('graphql-subscriptions')
const Subscription = require('./resolvers/Subscription')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const prisma = new PrismaClient()
const pubsub = new PubSub()

const resolvers = {
  Query,
  Mutation,
  Subscription,
  // Subscription: {
  //   newLink: {
  //     subscribe: () => pubsub.asyncIterator('NEW_LINK'),
  //     resolve: (payload, args, context, info) => {
  //       // console.log(args)
  //       // console.log(context)
  //       console.log(payload)
  //       return payload
  //     },
  //   }
  // },
  User,
  Link,
}

// async function startApolloServer () {

//   const typeDefs = fs.readFileSync(
//     path.join(__dirname, 'schema.graphql'),
//     'utf8'
//   )
//   const schema = makeExecutableSchema({ typeDefs, resolvers })

//   const server = new ApolloServer({
//     schema,
//     context: ({ req }) => {
//       return {
//         ...req,
//         prisma,
//         pubsub,
//         userId:
//           req && req.headers.authorization
//             ? getUserId(req)
//             : null
//       }
//     },
//   })
  
//   await server.start()
//   const app = express()
//   server.applyMiddleware({
//     app,
//     path: '/'
//   })
//   const httpServer = createServer(app)

//   const subscriptionServer = SubscriptionServer.create({
//     schema,
//     execute,
//     subscribe,
//   }, {
//     server: httpServer,
//     path: server.graphqlPath
//   });

//   // ['SIGINT', 'SIGTERM'].forEach(signal => {
//   //   process.on(signal, () => subscriptionServer.close())
//   // })
  
//   const PORT = 4000
//   httpServer.listen(PORT, () =>
//     console.log(`Server is now running on http://localhost:${PORT}`)
//   )
// }

// startApolloServer()


// ======== apollo-server ver 2.0 ======== 

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  },
  subscriptions: {
    onConnect: (connectionParams) => {
      if (connectionParams.authToken) {
        return {
          prisma,
          userId: getUserId(
            null,
            connectionParams.authToken
          )
        };
      } else {
        return {
          prisma
        };
      }
    }
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
