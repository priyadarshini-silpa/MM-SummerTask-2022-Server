var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary').v2;

const mongoose = require('mongoose');
mongoose.Types.ObjectId.isValid('all');
const Article = require('../models/article');
const auth = require('../auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: "success",
    message: "Home Page"
  });
});

/* GET all the articles */
router.get('/api/article/', function(req, res, next){
  Article.find()
    .select('title content _id')
    .exec()
    .then(docs => {
      const response = {
        count : docs.length,
        articles: docs.map(doc =>{
          return{
            //title: doc.title,
            //content: doc.content,
            _id: doc._id,
            request: {
              type: 'GET',
              url: "localhost:3000/article/api/"+ doc._id
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/* GET a particular article page. */
router.get('/api/article/:id', function(req, res, next){
  const id = req.params['id'];
  Article.findById(id)
    .select('title content _id viewCount')
    .exec()
    .then(doc =>{
      console.log(doc);
      if(doc){
        res.status(200).json(doc);
        Article.findOneAndUpdate({ _id: id}, { $inc: {'viewCount': 1 } })
        .exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
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

/* GET trending section. */
router.get('/api/article/trending', function(req, res, next){
  res.json({
    status: "success",
    message: "Trending articles"
  });
});

/* POST request: CREATE article */
router.post('/api/article/', auth, function(req, res, next){

  const articleNew = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  //cloudinary.v2.uploader.upload("/home/my_image.jpg", function(error, result) {console.log(result, error)});
  articleNew
    .save()
    .then(result =>{
    console.log(result);
    res.json({
      status: "201",
      message: "article was uploaded.",
      createdArticle : {
        title: result.title,
        content: doc.content,
        _id: doc._id,
        request: {
          type: 'GET',
          url: "localhost:3000/article/api/"+ result._id
    }}});
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

/* PUT request : Update an article */
router.put("/api/article/:id", auth, (req, res, next) =>{
  const id = req.params['id'];
  const updateOps = {};
  for ( const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Article.updateMany({ _id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
})

/* DELETE : Removing a particular article */
router.delete('/api/article/:id', auth, function(req, res, next){
  Article.deleteOne()
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/* POST : Liking an article */
router.post("/api/article/:id/like", (req, res, next) =>{

  const id = req.params['id'];
  Article.findOneAndUpdate({ _id: id}, { $inc: {'like': 1 } })
        .exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
            error: err
          });
        })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
})

/* DELETE : Unliking an article */
router.delete("/api/article/:id/like", (req, res, next) =>{

  const id = req.params['id'];
  Article.findOneAndUpdate({ _id: id}, { $inc: {'like': -1 } })
        .exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err =>{
          console.log(err);
          res.status(500).json({
            error: err
          });
        })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
})

module.exports = router;