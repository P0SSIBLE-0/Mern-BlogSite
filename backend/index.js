const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const {
  createUser,
  loginUser, 
  logoutUser,
  uploadFile,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require('./controllers/user')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const multer = require('multer');
const PostModel = require('./models/post.model');
// const uploadMiddleware = multer({ dest: 'uploads/' })

// Configure Multer storage using Cloudinary storage engine
// const cloudinaryStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'temp/'); // Temporary folder for uploaded files on server (optional)
//   },
//   filename: (req, file, cb) => {
//     const filename = `${Date.now()}-${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage: cloudinaryStorage });
const uploadMiddleware = multer({ storage: multer.memoryStorage() });// for deployment only vercel to avoid serverless crash


const PORT =  3000;
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.get('/post/:id', async(req, res) => {
  const {id} = req.params;
  const postInfo = await PostModel.findById(id).populate('author',['username', '_id']);
  res.json(postInfo);
});

app.get('/', (req, res) => {
  res.status(200).json({message: "wellcome!"});
})
app.get('/posts', getAllPosts);

app.post('/signup', createUser);

app.post('/login', loginUser)

app.post('/logout', logoutUser);

app.get('/profile', (req, res) => {
  const token = req.headers.authorization;
  
  jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // If verification is successful, send the decoded information as the response
    res.json(info);
  });
});


app.post('/post',uploadMiddleware.single('file'), uploadFile);
app.put('/post',uploadMiddleware.single('file'), updatePost );
app.delete('/post/:id', deletePost);

// connecting to database with mongoose
mongoose.connect(process.env.MONGO_URL).then(() =>{
  console.log("database connected!")
}).catch((err) => {
  console.log(err)
})

app.listen(PORT, () => {
  console.log("listening on port " +PORT);
});