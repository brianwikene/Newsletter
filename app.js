// jshint esversion: 6;
const express = require('express'); // Express
const bodyParser = require('body-parser'); //HTML conversor
const request = require('request'); // Make simple https calls

const app = express();
//const port = 3000;

let apiKey = "edfc62bed2e9f6c03968ef1b206073e7-us4"; //Here your API key from Mailchimp
let listID = "9fa1b2b739"; //Here your list id

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){

    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: "https://us4.api.mailchimp.com/3.0/lists/" + listID,
        method: "POST",
        headers: {
            "Authorization": "BrianWikene " + apiKey
        },
        body: jsonData
    };

    request(options, function(error, response, body){
        if (error) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            console.log(response.statusCode);
                if(response.statusCode === 200){
                    res.sendFile(__dirname + "/success.html");
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
        }
    })
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening at ${port}`);
 });
