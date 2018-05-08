// MongoDB

const MongoClient = require('mongodb').MongoClient

var db

// adding body-parser
const bodyParser= require('body-parser')

//connects express
const express = require('express');
const app = express();


app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

//shows message in terminal after running node server.js to let you know express is running
// app.listen(3000, function() {
//   console.log('listening on 3000')
// })

//express get request
// app.get('/', function(req, res) {
//   res.send('Hello World')
// })
// Note: request and response are usually written as req and res respectively.
//es6
// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

//  we serve an index.html page back to the browser
// use the sendFile method that’s provided by the res object.
// have to take out the res.send request that adds hello world text
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
//   // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
//   // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
// })

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

// app.post('/quotes', (req, res) => {
//   console.log(req.body)
// })


//connecting MongoDB
// start our servers only when the database is connected



MongoClient.connect('mongodb://alaing:noel1129@ds141406.mlab.com:41406/to_do_db', (err, client) => {
  if (err) return console.log(err)
  db = client.db('to_do_db') // whatever your database name is
  app.listen(3000, () => {
    // get rid of older one to make it work
    console.log('listening on 3000')
  })
})

// MongoClient.connect('link-to-mongodb', (err, database) => {
//   // ... start the server
// })

//adding quotes collection
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

//reading the quotes from db

app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find()

  db.collection('quotes').find().toArray(function(err, results) {
  console.log(results)
  // send HTML file populated with quotes here
})
})

app.use(bodyParser.json())

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
