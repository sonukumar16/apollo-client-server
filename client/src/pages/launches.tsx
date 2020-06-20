import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';
import { RouteComponentProps } from '@reach/router';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

interface LaunchesProps extends RouteComponentProps { }


/* Fragment :-
When we have two GraphQL operations that contain the same fields, 
we can use a fragment to share fields between them.
Fragments are a helpful tool that you'll use a lot as you're building GraphQL queries and mutations
*/
// Here we are making a fragment so that we can share among Queries and Mutations.
// Steps:-
/* 
1. Define fragment on Schema Types
2. Use step-1's fragment in your Query/Mutation as spread operator.
3. Also add Fragment GQL in your Mutaion/Query.
*/
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {  
    id
    isBooked
    rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        } 
  } 
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
      ... LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore // it's helper for pagination
  } = useQuery<GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables>(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />

        ))}
      {
        data.launches &&
        data.launches.hasMore && (
          <Button
            onClick={() => fetchMore({
               variables: { // it's required beause we are sending a value to Query.
                after: data.launches.cursor,
              },
              // function to tell Apollo how to update the list of launches in the cache
              updateQuery: (prev, {
                fetchMoreResult, ...reset
              }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches: {
                    ...fetchMoreResult.launches,
                    launches: [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches
                    ]
                  }
                }
              }
            })}
          >Load More</Button>
        )
      }
    </Fragment>
  );
}

export default Launches;

