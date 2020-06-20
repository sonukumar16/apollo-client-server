import { ApolloClient  } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import React from "react";
import ReactDOM from "react-dom";
import gql from 'graphql-tag';

//import gql from 'graphql-tag'; // required for query through vanilla javascript

import { resolvers, typeDefs } from './resolvers';
import Pages from "./pages";
import Login from './pages/login';
import injectStyles from "./styles";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:4000",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: [],
  },
});


const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();



ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);




/*
// a query with vanilla JavaScript
client.query({
    query:gql`
    query GetLaunch {
        launch(id:56){
            id
            mission {
                name
            }

        }
    }
    `
}).then(result=> console.log("result---->>", result))
.catch(error => console.log("Error--->>", error)); */
