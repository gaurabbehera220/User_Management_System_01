const mysql = require('mysql')

// connection pool
const pool = mysql.createPool({
    connectionLimit : 500,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});


// view users
exports.view = (req, res) => {
    // connect db
 pool.getConnection((err, connection) => {
     if(err) throw err ; // Not Connected!
     console.log('Connected as Id : ' + connection.threadId);

     // User the connection
     connection.query('SELECT * FROM User WHERE status = "active"', (err, rows) => {
        // When done with the connection release it
        connection.release()
        if(!err) {
            res.render('home', { rows });
        }else{
            console.log(err);
        }
        console.log('The data from the user table : \n', rows)
     })
 })
};


// Find user by search
exports.find = (req, res) => {
        // connect db
 pool.getConnection((err, connection) => {
    if(err) throw err ; // Not Connected!
    console.log('Connected as Id : ' + connection.threadId);

    let searchTerm = req.body.search ;
    // User the connection
    connection.query('SELECT * FROM User WHERE first_name LIKE ? OR last_name LIKE ?',[ '%'+ searchTerm + '%','%'+ searchTerm + '%'], (err, rows) => {
       // When done with the connection release it
       connection.release()
       if(!err) {
           res.render('home', { rows });
       }else{
           console.log(err);
       }
       console.log('The data from the user table : \n', rows)
    })
});
};



exports.form = (req, res) => {
    res.render('add-user');
}


// Add new user
exports.create = (req, res) => {

    const {first_name, last_name, email, phone, comments} = req.body;

    // connect db
pool.getConnection((err, connection) => {
if(err) throw err ; // Not Connected!
console.log('Connected as Id : ' + connection.threadId);

// User the connection
connection.query('INSERT INTO User SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?' ,[ first_name, last_name, email, phone, comments], (err, rows) => {
   // When done with the connection release it
   connection.release()
   if(!err) {
       res.render('add-user', { alert: 'User added successfully'});
   }else{
       console.log(err);
   }
   console.log('The data from the user table : \n', rows)
})
});
};


// Edit User
exports.edit = (req, res) => {

     // connect db
 pool.getConnection((err, connection) => {
    if(err) throw err ; // Not Connected!
    console.log('Connected as Id : ' + connection.threadId);

    // User the connection
    connection.query('SELECT * FROM User WHERE id = ?',[req.params.id], (err, rows) => {
       // When done with the connection release it
       connection.release()
       if(!err) {
           res.render('edit-user', { rows });
       }else{
           console.log(err);
       }
       console.log('The data from the user table : \n', rows)
    })
})
};



// Update User
exports.update = (req, res) => {
    const {first_name, last_name, email, phone, comments} = req.body;
    // connect db
pool.getConnection((err, connection) => {
   if(err) throw err ; // Not Connected!
   console.log('Connected as Id : ' + connection.threadId);

   // User the connection
   connection.query('UPDATE User SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',[first_name, last_name, email, phone, comments,req.params.id], (err, rows) => {
      // When done with the connection release it
      connection.release()
      if(!err) {
        pool.getConnection((err, connection) => {
            if(err) throw err ; // Not Connected!
            console.log('Connected as Id : ' + connection.threadId);
             // User the connection
             connection.query('SELECT * FROM User WHERE id = ?',[req.params.id], (err, rows) => {
                // When done with the connection release it
                 connection.release()
                 if(!err) {
                    res.render('edit-user', { rows, alert:` ${first_name} has been updated.` });
                }else{
           console.log(err);
       }
       console.log('The data from the user table : \n', rows)
    });
    });
     }else{
          console.log(err);
      }
      console.log('The data from the user table : \n', rows)
   })
})
}



// Delete User
exports.delete = (req, res) => {

    // connect db
pool.getConnection((err, connection) => {
   if(err) throw err ; // Not Connected!
   console.log('Connected as Id : ' + connection.threadId);

   // User the connection
   connection.query('UPDATE User SET status = ? WHERE  id = ?',['removed',req.params.id], (err, rows) => {
      // When done with the connection release it
      connection.release()
      if(!err) {
          res.redirect('/');
      }else{
          console.log(err);
      }
      console.log('The data from the user table : \n', rows)
   })
})
};



// View all
exports.viewall = (req, res) => {
    // connect db
 pool.getConnection((err, connection) => {
     if(err) throw err ; // Not Connected!
     console.log('Connected as Id : ' + connection.threadId);

     // User the connection
     connection.query('SELECT * FROM User WHERE id= ?',[req.params.id], (err, rows) => {
        // When done with the connection release it
        connection.release()
        if(!err) {
            res.render('view-user', { rows });
        }else{
            console.log(err);
        }
        console.log('The data from the user table : \n', rows)
     })
 })
};
