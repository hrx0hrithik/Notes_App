const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Th!$!$!ncr#pted$#cr#t'

// ROUTE 1: Create a User using : POST "/api/auth/createuser" . No login required

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password is less than 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;

    // if there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // Check the email already exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "This Email already exists" });
      }

      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)

      // Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data  = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);

      success= true;
      res.json({ success, authToken})
      // res.json(user);
      // res.json({"message": "New User Created"})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

//ROUTE 2: Authenticate a User using : POST "/api/auth/login" . No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ], async (req, res) => {
    let success = false;
    // if there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with correct credentials"})

      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials"})
      }

      const data  = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }


  })

  //ROUTE 3: Get loggedin User details using : POST "/api/auth/getuser" . Login required

  router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user);

  }  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
    })

module.exports = router;
