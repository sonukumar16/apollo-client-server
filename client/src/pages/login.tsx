import React from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { LoginForm, Loading } from "../components";
import ApolloClient from "apollo-client";
import * as LoginTypes from "./__generated__/login";

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  /* One of the main functions of React Apollo is that it puts your ApolloClient instance on React's context. Sometimes,
   we need to access the ApolloClient instance to directly call a method that isn't exposed by the 
  @apollo/react-hooks helper components. The useApolloClient hook can help us access the client. */
  const client: ApolloClient<any> = useApolloClient();
  const [login, { loading,error }] = useMutation<
    LoginTypes.login,
    LoginTypes.loginVariables
  >(LOGIN_USER, {
    onCompleted({ login }) {
      localStorage.setItem("token", login as string);
      client.writeData({ data: { isLoggedIn: true } }); // to write local data to the Apollo cache
    },
  });
  if(loading) return <Loading />
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
