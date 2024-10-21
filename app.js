const express = require('express');
const mongoose = require('mongoose');
const Blog = require("./models/blog.js");
const axios = require('axios');
// express app
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded());
// listen for requests

const mdb = "mongodb+srv://lol:lol123@cluster0.ntvtwfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mdb)
  .then((result) => {app.listen(3000)})
  .catch((err) => console.log(err))
// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews')

app.use((req,res,next) => {
  console.log(req.url);
  next();}
)

app.get('/add-blog',(req,res)=>{
  const blog = new Blog({
    title: "jck",
    snippet: "hello world",
    body: "more about me"
  });
  blog.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    });
})

app.get("/getblogs",(req,res)=>{
  Blog.find()
    .then(result =>{res.send(result);})
    .catch(err => {console.log(err);});
});
app.get('/', (req, res) => {
  const blogs = Blog.find()
    .then(result =>{
      res.render('index', { title: 'Home', blogs:result });
    })
    .catch(err=>{
      console.log(err)
    });
  
  
});
app.post("/",(req,res)=>{
  const blog = new Blog(req.body);
  blog.save()
    .then(res.redirect("/"))
    .catch(err=>(console.log(err)));

});

app.delete('/')
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' })
});

app.get('/blogs/create', (req, res) => {
  res.render('createp', { title: 'Create a new blog' });
});

app.get('/:id',(req,res) =>{
  const id = req.params.id;
  Blog.findById(id)
  .then((result)=>{
    res.render("details", {title:"details",blog: result})
  })
  .catch(err=>{
    console.log(err)
  });
  
})

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
