/* export const service = {
  // Must match the name of your graph in Graph Manager
  name: 'spaceX-trip-booking',
  // EITHER THIS
  endpoint: {
    url: 'http://localhost:4000',
  },
  // OR THIS
  localSchemaFile: './src/schema.gql',
}; */

module.exports = {
  service: {
    // Must match the name of your graph in Graph Manager
    name: 'spaceX-trip-booking',
    // EITHER THIS
    endpoint: {
      url: 'http://localhost:4000',
    },
    // OR THIS
    localSchemaFile: './src/schema.gql',
  },
};
