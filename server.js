/**
 * Express Server.js  to create REST API
 * @Author Chetan Hebsur.
 * @Place  Hyderabad (india).
 */

const elasticsearch = require('elasticsearch'); // npm i elasticsearch --save --force

/**
 * set absolute path of JAVE_HOME at environment variables.
 * windows : Set Download elasticsearch.zip file and extract it into 'C' drive and run elasticsearch.bat file inside extracted folder.
 * Linux : Set Download elasticsearch.tar.gz file and extract it and start service. ref: ElasticSearch.com.
 * Once set up completed terminal will popup and start listening to localhost:9200.
 */ 

//Connecting ElasticSearch Local Server, if you want to connect to ElasticHosting or any cloud? mention host URL and Bearer token or IAM credentials
const client = new elasticsearch.Client({
   host:'http://localhost:9200',
   log:'trace'
});

//require Express and basic utilities of express and body-parser
const express = require( 'express' );
const app = express();
const bodyParser = require('body-parser');
const path = require( 'path' );


// ping the client to be sure Elasticsearch is up
client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });


// use the bodyparser as a middleware  
app.use(bodyParser.json())

// set port for the app to listen on
app.set( 'port', process.env.PORT || 3000 );

// enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Consuming GET Request.
app.get('/search', function (req, res){
    // Set the search criteria payload.
    let body = {
      size: 200,
      from: 0, 
      query: {
        match: {
            'Column Name of Your Dataset': req.query.q
        }
      }
    }

    // Pass the payload body with index name AND type
  client.search({index:'{IndexName}',  body:body, type:'{IndexType}'})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

});


// Final step to start your server..
app.listen( app.get( 'port' ), function(){
  console.log( 'server listening on port ' + app.get( 'port' ));
});

// We made it.