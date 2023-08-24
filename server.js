const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const jwt = require('jsonwebtoken');
const session = require("express-session");
require("dotenv").config();
const app = express();
const JWT_SECRET = 'AdityaIsagoodb$oy'
const PORT = process.env.PORT || 3000;
const initializePassport = require("./passportConfig");

// const express = require('express');
const bodyParser = require('body-parser');
// const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log("flash error:",req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any error that might occur during logout
      console.error(err);
    }
    // Redirect or respond as needed
    res.render("index", { message: "You have logged out successfully" });
  });
});


app.post("/users/register", async (req, res) => {
  
  // let { name, email, password, bio } = req.body;

  // let errors = [];

  // const errors = validationResult(req);
  const { name, email, password, bio } = req.body;
  console.log({name, email, password, bio});
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    // try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt)
      // const secPass = await bcrypt.hash(req.body.password, salt)
      
      // const user = await User.create({
      //     username: req.body.name,
      //     password: secPass,
      //     email: req.body.email,
      // });

      const data = {
          user:{
              email:email
          }
      }

      pool.query(
        `SELECT * FROM users
          WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log("error in serer:",err);
          }
          console.log("results are",results.rows);
  
          if (results.rows.length > 0) {
            return res.render("register", {
              message: "Email already registered"
            });
          } else {
            pool.query(
              `INSERT INTO users (username, email, user_password, user_bio)
                  VALUES ($1, $2, $3, $4)
                  RETURNING user_id, user_password`,
              [name, email, secPass, bio],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log("rows of results are:",results.rows);
                req.flash("success_msg", "You are now registered. Please log in");
                // res.redirect("/users/login");
              }
            );
          }
        }
      );

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken})
      
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
});

app.post("/users/login",async(req,res) => {
  let success = false;
  // const errors = validationResult(req);
  // if(!errors.isEmpty())
  // {
  //     return res.status(400).json({ errors: errors.array()})
  // }
  //////////////////////////////////////////////////////////////////////////////
  const {email, password} = req.body;
  console.log({password,email})
  pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log("credentials are:",results.rows);

      if (results.rows.length > 0) {

        const user = results.rows[0];
        console.log("user_password:",user.user_password);
        console.log("password:",password);
        bcrypt.compare(password, user.user_password, (err, isMatch) => {
          console.log("1")
          if (err) {
            console.log("error:",err);
          }
          if (isMatch) {
            console.log("2");
            const data = {
              user:{
                  id:user.user_id
              }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true
            res.json({success, authToken})
          } else {
            //password is incorrect
            console.log("3");
            success = false
            return res.status(400).json({success, error:"Please try to login with correct credentials"});
          }
        });
      } else {
        // No user
        return done(null, false, {
          message: "No user with that email address"
        });
      }
    }
  );
})
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



const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  if(!token)
  {
      res.status(401).send({error : "Please authenticate  using a valid token"})
  }
  try {
      const data = jwt.verify(token, JWT_SECRET);
      console.log("data:",data);
      req.user = data.user;
      console.log("reqested user:",req.user)
      next();
  } catch (error) {
      res.status(401).send({error : "Please authenticate  using a valid token"})
  }
  
}

app.post('/users/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user_id is the correct column name

    // Query the PostgreSQL database to retrieve the user
    const query = 'SELECT user_id, username, email, user_bio FROM users WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    delete user.user_password; // Assuming you don't want to send the password back

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server error' });
  }
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next(); 
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query(`select * from users`,(err,results) => {
  if(!err){
    console.log("new results are:",results.rows);
  } else{
    console.log("error occured")
  }
  console.log("me execute ho gya")
})