import gql from "graphql-tag";
import { ApolloCache } from "apollo-cache";
import { GET_CART_ITEMS } from "./pages/cart";

import * as GetCartItemTypes from "./pages/__generated__/GetCartItems";
import * as LaunchTileTypes from "./pages/__generated__/LaunchTile";
import { Resolvers } from "apollo-client";

// Schema
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

type ResolverFn = (
  parent: any,
  agrs: any,
  {
    cache,
  }: {
    cache: ApolloCache<any>;
  }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}
interface AppResolvers extends Resolvers {
  // we will updte this with our app's resolver
  Launch: ResolverMap;
  Mutation: ResolverMap;
}

// Resolvers
export const resolvers: AppResolvers = {
  Launch: {
    isInCart: (launch: LaunchTileTypes.LaunchTile, _, { cache }): boolean => {
      const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({
        query: GET_CART_ITEMS,
      });
      if (queryResult) {
        return queryResult.cartItems.includes(launch.id);
      }
      return false;
    },
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }: { id: string }, { cache }): string[] => {
      const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems, any>({
        query: GET_CART_ITEMS,
      });
      if (queryResult) {
        const { cartItems } = queryResult;
        const data = {
          cartItems: cartItems.includes(id)
            ? cartItems.filter((i) => i !== id)
            : [...cartItems, id],
        };
        cache.writeQuery({ query: GET_CART_ITEMS, data });
        return data.cartItems;
      }
      return [];
    },
  },
};
