// const { pool } = require("./dbConfig");
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// const { OAuth2Client } = require('google-auth-library');
// const JWT_SECRET = 'AdityaIsagoodb$oy'
// (req, res) => {
//   res.render("index");
// });

//  (req, res) => {
//   res.render("register.ejs");
// });

// (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log("flash error:",req.session.flash.error);
//   res.render("login.ejs");
// });

// (req, res) => {
//   console.log(req.isAuthenticated());
//   res.render("dashboard", { user: req.user.name });
// });





////////////////////////////////////////////////////////////////

// const googleClient = new OAuth2Client({
//   clientId: '515774685184-judv39nhmvssuseo283vd13ji7d2d4eh.apps.googleusercontent.com',
//   clientSecret: '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',
//   redirectUri: 'http://localhost:3000/auth/google/callback',
// });



//  (req, res) => {
//   res.redirect(googleClient.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
//   }));
// });

// Route for Google Sign-In Callback

//  async (req, res) => {
//   console.log("I am called")
//   try {
//     const { code } = req.query;
//     const { tokens } = googleClient.getToken(code);

//     // Get user information from Google
//     const userResponse = googleClient.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: "515774685184-judv39nhmvssuseo283vd13ji7d2d4eh.apps.googleusercontent.com",
//       url: 'https://www.googleapis.com/oauth2/v2/userinfo',
//       headers: {
//         Authorization: `Bearer ${tokens.access_token}`,
//       },
//     });

//     const { email, name, at_hash } = userResponse.payload;

//     // Check if the user already exists in your database
//     const userQuery = await pool.query(
//       `SELECT * FROM users WHERE email = $1`,
//       [email]
//     );

//     if (userQuery.rows.length > 0) {
//       const user = userQuery.rows[0];
//       const data = {
//         user: {
//           id: user.user_id,
//         }
//       }
//       const authToken = jwt.sign(data, JWT_SECRET);
//       return res.json({ success: true, authToken });
//     }

//     // If the user doesn't exist, create a new user
//     const newUserQuery = await pool.query(
//       `INSERT INTO users (username, email, user_password, user_bio)
//        VALUES ($1, $2, $3, $4)
//        RETURNING user_id`,
//       [name, email, at_hash, "default"]
//     );

//     const newUser = newUserQuery.rows[0];
//     const data = {
//       user: {
//         id: newUser.user_id,
//       }
//     }
//     const authToken = jwt.sign(data, JWT_SECRET);
    
//     return res.json({ success: true, authToken });

//   } catch (error) {
//     console.error("Google authentication error:", error);
//     res.status(500).json({ error: 'Internal Server error' });
//   }
// });


//  (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       // Handle any error that might occur during logout
//       console.error(err);
//     }
//     // Redirect or respond as needed
//     res.render("index", { message: "You have logged out successfully" });
//   });
// });


//  async (req, res) => {
  

//   const { name, email, password, bio } = req.body;
//   console.log({name, email, password, bio});

//       const salt = await bcrypt.genSalt(10);
//       const secPass = await bcrypt.hash(password, salt)


//       const data = {
//           user:{
//               email:email
//           }
//       }

//       pool.query(
//         `SELECT * FROM users
//           WHERE email = $1`,
//         [email],
//         (err, results) => {
//           if (err) {
//             console.log("error in serer:",err);
//           }
//           console.log("results are",results.rows);
  
//           if (results.rows.length > 0) {
//             return res.render("register", {
//               message: "Email already registered"
//             });
//           } else {
//             pool.query(
//               `INSERT INTO users (username, email, user_password, user_bio)
//                   VALUES ($1, $2, $3, $4)
//                   RETURNING user_id, user_password`,
//               [name, email, secPass, bio],
//               (err, results) => {
//                 if (err) {
//                   throw err;
//                 }
//                 console.log("rows of results are:",results.rows);
//                 req.flash("success_msg", "You are now registered. Please log in");
//                 // res.redirect("/users/login");
//               }
//             );
//           }
//         }
//       );

//     const authToken = jwt.sign(data, JWT_SECRET);
//     res.json({authToken})
// });


// async(req,res) => {
//   let success = false;
  
//   const {email, password} = req.body;
//   console.log({password,email})
//   pool.query(
//     `SELECT * FROM users WHERE email = $1`,
//     [email],
//     (err, results) => {
//       if (err) {
//         throw err;
//       }
//       console.log("credentials are:",results.rows);

//       if (results.rows.length > 0) {

//         const user = results.rows[0];
//         console.log("user_password:",user.user_password);
//         console.log("password:",password);
//         bcrypt.compare(password, user.user_password, (err, isMatch) => {
//           console.log("1")
//           if (err) {
//             console.log("error:",err);
//           }
//           if (isMatch) {
//             console.log("2");
//             const data = {
//               user:{
//                   id:user.user_id
//               }
//             }
//             const authToken = jwt.sign(data, JWT_SECRET);
//             success = true
//             res.json({success, authToken})
//           } else {
//             //password is incorrect
//             console.log("3");
//             success = false
//             return res.status(400).json({success, error:"Please try to login with correct credentials"});
//           }
//         });
//       } else {
//         // No user
//         return done(null, false, {
//           message: "No user with that email address"
//         });
//       }
//     }
//   );
// })

// const fetchuser = (req, res, next) => {
//   const token = req.header('auth-token');
//   if(!token)
//   {
//       res.status(401).send({error : "Please authenticate  using a valid token"})
//   }
//   try {
//       const data = jwt.verify(token, JWT_SECRET);
//       console.log("data:",data);
//       req.user = data.user;
//       console.log("reqested user:",req.user)
//       next();
//   } catch (error) {
//       res.status(401).send({error : "Please authenticate  using a valid token"})
//   }
  
// }


// ,async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user_id is the correct column name

//     // Query the PostgreSQL database to retrieve the user
//     const query = 'SELECT user_id, username, email, user_bio FROM users WHERE user_id = $1';
//     const { rows } = await pool.query(query, [userId]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const user = rows[0];
//     delete user.user_password; // Assuming you don't want to send the password back

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server error' });
//   }
// });


// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect("/users/dashboard");
//   }
//   next(); 
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/users/login");
// }

// pool.query(`select * from users`,(err,results) => {
//   if(!err){
//     console.log("new results are:",results.rows);
//   } else{
//     console.log("error occured")
//   }
//   console.log("me execute ho gya")
// })

//////////////////////////////////////////////////////////////////////////////

// Middleware
// passport.use(new GoogleStrategy({
//   clientID: "515774685184-judv39nhmvssuseo283vd13ji7d2d4eh.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: "http://localhost:3000/auth/google/callback"
//   },function (accessToken, refreshToken, profile, done) {
//     console.log("accessToken",accessToken);
//     console.log("refreshToken",refreshToken);
//     console.log(profile);
//     return done(null, profile)
//   }
// ))

// app.get('/auth/google/callback',
//   passport.authenticate('google', {failureRedirect: '/users/login'}),
//   function (req, res){
//     res.redirect('/');
//   }
// )


//////////////////////////////////////////////////////////////////////////////

// const errors = validationResult(req);
  // if(!errors.isEmpty())
  // {
  //     return res.status(400).json({ errors: errors.array()})
  // }
  //////////////////////////////////////////////////////////////////////////////

     // res.json(req.body);
  // } catch (error) {
  //     if (error.code === 11000) {
  //         return res.status(400).json({ error: 'Email already exists' });
  //     }
  //     res.status(500).json({ error: 'Server error' });
  // }

  // console.log("nepb",{
  //   name,
  //   email,
  //   password,
  //   bio
  // });

  // if (!name || !email || !password || !bio) {
  //   errors.push({ message: "Please enter all fields" });
  // }

  // if (password.length < 6) {
  //   errors.push({ message: "Password must be a least 6 characters long" });
  // }

  // if (password !== password2) {
  //   errors.push({ message: "Passwords do not match" });
  // }

  // if (errors.length > 0) {
  //   res.render("register", { errors, name, email, password, bio });
  // } else {
  //   let hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);
  //   // Validation passed
  //   pool.query(
  //     `SELECT * FROM users
  //       WHERE email = $1`,
  //     [email],
  //     (err, results) => {
  //       if (err) {
  //         console.log("error in serer:",err);
  //       }
  //       console.log("results are",results.rows);

  //       if (results.rows.length > 0) {
  //         return res.render("register", {
  //           message: "Email already registered"
  //         });
  //       } else {
  //         pool.query(
  //           `INSERT INTO users (username, email, user_password, user_bio)
  //               VALUES ($1, $2, $3, $4)
  //               RETURNING user_id, user_password`,
  //           [name, email, hashedPassword, bio],
  //           (err, results) => {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("rows of results are:",results.rows);
  //             req.flash("success_msg", "You are now registered. Please log in");
  //             res.redirect("/users/login");
  //           }
  //         );
  //       }
  //     }
  //   );
  // }


    // })


  /////////////////////////////////////////////////////////////////////////////////
//   const {email, password} = req.body;
//   try {
//       let user = await User.findOne({email});
//       if(!user)
//       {
//           return res.status(400).json({error:"Please try to login with correct credentials"});
//       }

//       const passwordCompare = await bcrypt.compare(password, user.password)
//       if(!passwordCompare)
//       {
//           success = false
//           return res.status(400).json({success, error:"Please try to login with correct credentials"});
//       }

//       const data = {
//           user:{
//               id:user.id
//           }
//       }
//       const authToken = jwt.sign(data, JWT_SECRET);
//       success = true
//       res.json({success, authToken})
//   } catch (error) {
//       if (error.code === 11000) {
//           return res.status(400).json({ error: 'Email already exists' });
//       }
//       res.status(500).json({ error: 'Internal Server error' });
//   }

//   "/users/login",
//   passport.authenticate("local", {
//     successRedirect: "/users/dashboard",
//     failureRedirect: "/users/login",
//     failureFlash: true
//   })
// );