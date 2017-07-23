//connecting to mongo db

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+process.env.mongoDBUsername+':'+process.env.mongoDBPassword+'@ds119223.mlab.com:19223/locations');
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    fs.readFile('./index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }         
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();  
	});   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

app.get('/', function(req, res) {
    fs.readFile('./index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }         
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();  
	});
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

var Location = mongoose.model('Location', 
				{ emailId: String,
				  lat : Number,
				  long : Number
			   });

//Creating post method for saving location
router.route('/locations').post(function(req, res) {


    var myLocation = new Location();
    myLocation.emailId = req.body.emailId;
    myLocation.lat = req.body.lat;
    myLocation.long = req.body.long;  
    res.setHeader('Access-Control-Allow-Origin', '*');

    //try to find first
    Location.findOne({emailId : req.body.emailId }, function(err, location) {
        if (err){
        	res.send(err);
        	return;
        }
        if(location){
        	location.lat = myLocation.lat;
        	location.long = myLocation.long;
        	location.save(function(err) {
		        if (err)
		            res.send(err);
		        res.json({ message: 'Location updated.' });
		    });
        }else{
        	// save the bear and check for errors
		    myLocation.save(function(err) {
		        if (err)
		            res.send(err);
		        res.json({ message: 'Location saved.' });
		    });
        }
    });

});

//Get the location by email id
router.route('/locations/:emailId').get(function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
    Location.findOne({emailId : req.params.emailId }, function(err, location) {
        if (err)
            res.send(err);
        res.json(location);
    });
});



