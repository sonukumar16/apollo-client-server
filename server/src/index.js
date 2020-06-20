import { ApolloServer } from 'apollo-server';
import isEmail from 'isemail';
import fs from "fs";
import path from "path";

// import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import LaunchAPI from './datasources/launch';
import UserAPI from './datasources/user';
import { createStore } from './utils';

// import schema flies 
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf8");

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
});

// here we are sync the database so that tables are created first.
store.db.sync({ force: false });

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  playground: true,
  engine: {
    apiKey: "service:spaceX-trip-booking:OTRIajXbym7QoEwAptXQEA",
  },
});

server
  .listen()
  .then(({ url }) => console.log(`🚀  app running at ${url}`));
