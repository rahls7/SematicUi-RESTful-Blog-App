var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost/restful_blog_app');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());

// Mongoose/Model config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({title: 'TestBlog', image: 'https://www.w3schools.com/css/trolltunga.jpg', body: 'This is a test Blog. Hopefully it will work'})

//RESTful routes

app.get('/', function(req, res) {
    res.redirect('/blog');
});

//Index Route
app.get('/blog', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

//New Route
app.get('/blog/new', function(req, res) {
   res.render('new'); 
});

//Create route
app.post('/blog', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
        if(err) {
            res.render('new');
        } else {
            res.redirect('/blog');
        }
    });
});

//Show Route
app.get('/blog/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect('/blog');
        }else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//Edit Route
app.get('/blog/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blog')
        }else {
               res.render('edit', {blog: foundBlog}); 
        }
    });
});


//Update Route
app.put('/blog/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect('/blog');
        }else {
            res.redirect('/blog/' + req.params.id);
        }
    });
});

app.delete('/blog/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/blog');
        } else {
            res.redirect('/blog');
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server is running');
});