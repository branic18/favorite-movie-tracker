module.exports = function(app, passport, db) {

// normal routes =============================================================== 

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    const Movie = require('./models/movie'); // importing the Movie model from the mongoose schema

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) { 
      
      db.collection('movies')
          .find()  
          .sort({ thumbUp: -1 })  
          .toArray((err, result) => { 
              if (err) return console.log(err); 
              res.render('profile.ejs', {  
                  user: req.user,   
                  movies: result,   
              });
          });
    });
  

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// movie board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('movies').insertOne({movieName: req.body.movieName, genre: req.body.genre, plot: req.body.plot, duration: req.body.duration, why: req.body.why, thumbUp: 0}, (err, result) => { // save a new document to database
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/profile/:movieId', (req, res) => {
      const { ObjectId } = require('mongodb');  // Correctly import ObjectId
  
      const movieId = req.params.movieId;
      const { thumbUp } = req.body; 
  
      // Converting the movieId string into ObjectId after it's assigned
      const movieObjectId = new ObjectId(movieId);
  
      console.log('Received movieId:', movieId);
      console.log('Received thumbUp:', thumbUp);
  
      // Is thumbUp is a valid number?
      if (isNaN(thumbUp)) {
          return res.status(400).send('Invalid thumbUp value');
      }
  
      db.collection('movies').findOneAndUpdate(
          { _id: movieObjectId },  // ffind the movie by ObjectId
          {
              $set: {
                  thumbUp: thumbUp  // updating the thumbUp field
              }
          },
          { returnDocument: 'after' },  
          (err, result) => {
              if (err) {
                  console.error('Error updating thumb count:', err); 
                  return res.status(500).send('Error updating thumb count');
              }
              res.json(result.value);  
          }
      );
  });
  
  
  

  app.delete('/profile/:movieId', (req, res) => {
    const ObjectId = require('mongodb').ObjectId;
    const movieId = req.params.movieId; 

    const movieObjectId = new ObjectId(movieId);

    db.collection('movies').findOneAndDelete(
        { _id: movieObjectId },
        (err, result) => {
            if (err) {
                return res.status(500).send('Error deleting movie');
            }

            if (!result.value) {
                return res.status(404).send('Movie not found');
            }

            res.send('Movie deleted successfully');
        }
    );
});

// This is for the movie detail if the user selects on a movie
app.get('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const ObjectId = require('mongodb').ObjectId;

  db.collection('movies').findOne({ _id: new ObjectId(movieId) }, (err, result) => {
      if (err) return res.status(500).send('Error fetching movie');
      if (!result) return res.status(404).send('Movie not found');
      res.json(result); 
  });
});


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') }); // Find out what flash method is
        }); // User sees the response

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', { // looks in passport file , uses the user model on line 7, then look in user.js file (hash is here, you never want to store passwords in plain text. You always ant to hash it)
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages. Show the user why they failed
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) // If authenticated return it
        return next(); // Function built into express

    res.redirect('/'); // If not redirect the user to the homepage
}
