* Apollo provides a DataSource class that we can extend to handle interaction logic for a particular type of data source.

* The RESTDataSource class automatically caches responses from REST resources with no additional setup. We call this feature *partial query caching*.

# Resolver 
* A resolver is a function that's responsible for populating the data for a single field in your schema. Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source.

* A resolver function returns one of the following:

 . Data of the type required by the resolver's corresponding schema field (string, integer, object, etc.)
 . A promise that fulfills with data of the required type

 *Signature of resolver* 
   fieldName: (parent, args, context, info) => data;