var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Article = require('../models/article');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: "success",
    message: "Home Page"
  });
});

/* GET a particular article page. */
router.get('/api/article/:id', function(req, res, next){
  res.json({
    status: "success",
    message: "Article Page"
  });
});

/* GET all the articles */
router.get('/api/article/:id', function(req, res, next){
  res.json({
    status: "success",
    message: "List of all articles"
  });
});

/* GET trending section. */
router.get('/api/article/trending', function(req, res, next){
  res.json({
    status: "success",
    message: "Trending articles"
  });
});

/* POST request: CREATE article */
router.post('/api/article/', function(req, res, next){

  const articleNew = new Article({
    //_id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content
  });
  articleNew
    .save()
    .then(result =>{
    console.log(result);
  })
    .catch(err => console.log(err));
  res.json({
    status: "200",
    message: "article was uploaded."
  });
});
module.exports = router;