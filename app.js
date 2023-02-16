const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();
const PORT = process.env.PORT || 3000;

// Config app to use EJS
app.set('view engine', 'ejs');

// Allow the req.body to be used
app.use(bodyParser.urlencoded({ extended: true }));

// Allow the server to run static files
app.use(express.static(__dirname + '/public'));

// Create a mongoDB DB called blogDB
mongoose.connect('mongodb://localhost:27017/blogDB');

// Create a Schema for the posts
const postSchema = {
  title: {
    type: String,
    require: [true, 'Posts needs to have a Title']
  },
  content: {
    type: String,
    require: [true, 'Posts needs to have a Content']
  }
};

// Moongose convert Post into posts automatically
const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
  // Get all the posts from the db and render on the main page
  Post.find({}, (err, posts) => {
    res.render('home', {
      homeStartingContent,
      posts
    });
  });
});

app.get('/about', (req, res) => {
  res.render('about', { aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  // Create a new post and save to the db
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  // Will only redirect when the post has been created
  post.save(err => {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.get('/posts/:postId', (req, res) => {
  const requestedPostId = req.params.postId;

  // Find post by the id passed on the url as a param and render the page
  Post.findOne({ _id: requestedPostId }, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content
    });
  });
});

app.listen(PORT, () => console.log('Server started on port 3000'));
