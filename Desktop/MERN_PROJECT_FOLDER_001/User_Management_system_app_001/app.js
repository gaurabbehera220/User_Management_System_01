const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mysql = require('mysql')



require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


// Mysql connection
const pool = mysql.createPool({
    connectionLimit : 500,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if(err) throw err ; // Not Connected!
    console.log('Connected as Id : ' + connection.threadId);
})



// Parsing Middleware
// parse application/x-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

// Parse application/json
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Templating Engine
app.engine('hbs', exphbs.engine( {extname:'.hbs', defaultLayout: "main" }));
app.set('view engine', 'hbs');

// Router
const routes = require('./server/routes/userRoute');
app.use('/', routes)


app.listen(port, () => console.log(`App Listening on port ${port}`));

