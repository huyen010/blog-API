const Joi = require('joi');
var express = require('express');
// require('express-async-errors');
var app = express();
const mongoose = require('mongoose');
const redis = require('redis');
const fileUpload = require('express-fileupload')
const client = redis.createClient(6379)

// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});
async function A(){
  await client.connect();
  // await client.set('key', 1);
  // const value = await client.get('key');
  // console.log(value);
}
A();
global.redisClient = client;
const { Socket } = require('socket.io');
const http = require('http').Server(app);
const io = require('socket.io')(http);
global.io = io;
const categories = require('./routes/Categories');
const cateAdmin = require('./routes/CateAdmin');
const users = require('./routes/Users');
const admins = require('./routes/Admin');
const auth = require('./routes/authUser');
const post = require('./routes/Posts');
const postAdmin = require('./routes/postAdmin');
const authadmin = require('./routes/authAdmin');
const comment = require('./routes/Comment');
const commentadmin = require('./routes/CommentAdmin');
const like = require('./routes/Like');
require('dotenv').config();
const error = require('./middleware/error');
mongoose.connect('mongodb://127.0.0.1:27017/blog')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));
// app.use('/uploads', express.static('uploads'));
// app.use(fileUpload({
//   useTempFiles: true,
//   limits: {fileSize: 50 * 2024 * 1024}
// }))
app.use(express.json());
app.use('/api/v1/web/categories',categories);
app.use('/api/v1/cms/categories',cateAdmin);
app.use('/api/v1/web/users',users);
app.use('/api/v1/cms/users',admins)
app.use('/api/v1/web/auth',auth);
app.use('/api/v1/cms/auth',authadmin)
app.use('/api/v1/web/posts',post);
app.use('/api/v1/web/comment',comment);
app.use('/api/v1/web/reaction',like);
app.use('/api/v1/cms/posts',postAdmin);
app.use('/api/v1/cms/comments',commentadmin);
io.on('connection', (socket) => {
  // const userid = '1bxsx';
  // socket.join(userid);
  socket.on("disconnect", function(){
    console.log("disconnect");
  });

  socket.on("message", function(data){
    socket.emit('reply', data);
  });
  socket.on("login",function(data){
    console.log(data);
    socket.join(data);
  })
});
const port = process.env.PORT || 3002;
http.listen(port, () => console.log('Socket listening on port...'+port));