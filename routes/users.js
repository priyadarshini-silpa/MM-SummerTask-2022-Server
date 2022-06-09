var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* POST for signup */
router.post('/signup/', (req, res, next) =>{
  User.find({ email : req.body.email})
      .exec()
      .then(user =>{
        if(user.length>=1){
          return res.status(422).json({
            message: "email noy unique"
          });
        }
        else{
          bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
              return res.status(500).json({
                error: err
              });
            }
            else{
              const user = new User({
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result =>{
                  console.log(result);
                  res.status(201).json({
                    message : " User created"
                  });
                })
                .catch(err =>{
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                })
        }
      });
    }
  })
});

router.post('/signin/',(req,res,next)=>{
  User.find({ email: req.body.email})
      .exec()
      .then(user=>{
        if(user.length>1){
          return res.status(401).json({
            message: "Authentication Failed!"
          })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
          if(err){
            return res.status(401).json({
              message: "Authentication Failed!"
            });
          }
          if(result){
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            }, process.env.JWT_KEY,{
              expiresIn: "1h"
            })
            return res.status(200).json({
              message: "Authentication Successful!",
              token : token
            })
          }
          return res.status(401).json({
            message: "Authentication Failed!"
          })
        })
      })
})
module.exports = router;