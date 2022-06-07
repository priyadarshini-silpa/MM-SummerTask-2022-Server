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
  const id = req.params['id'];
  Article.findById(id)
    .exec()
    .then(doc =>{
      console.log(doc);
      if(doc){
        res.status(200).json(doc);
      }
      else {
        res.status(404).json({ message: 'No valid entry found'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

/* GET all the articles */
router.get('/api/article/', function(req, res, next){
  Article.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
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
router.post('/api/article', function(req, res, next){

  const articleNew = new Article({
    //_id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content
  });
  articleNew
    .save()
    .then(result =>{
    console.log(result);
    res.json({
      status: "200",
      message: "article was uploaded.",
      createdArticle : articleNew
    });
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});
module.exports = router;