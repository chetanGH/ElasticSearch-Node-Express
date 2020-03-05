/**
 * @CreateIndex in this file, we will set index first and upload our data.
 * @UploadDATA  I hope you're going to upload multiple json documents.
 * 
 * */ 

const es = require('elasticsearch'); // Elastic Search NPM : npm i --save elasticsearch --force.

// Setting up client
const client = new es.Client({
    host: 'localhost:9200',
    log: 'trace'
});

// Creating Index for your JSON data.
client.indices.create({
    index: 'YOUR INDEX NAME'
}, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});

// Import your JSON dataset here.
const tests = require('./{YOURDATA.json}');

// declare an empty array called bulk
var bulk = [];

//loop through each ITEM and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index
tests.forEach(test =>{
   bulk.push({index:{ 
                 _index:"YOUR INDEX", 
                 _type:"INDEX TYPE",
             }          
         })
  bulk.push(test)
})


//perform bulk indexing of the data passed
client.bulk({body:bulk}, function( err, response  ){ 
    if( err ){ 
        console.log("Failed Bulk operation".red, err) 
    } else {
        
        console.log("Successfully imported %s".green, response); 
    } 
});