require('dotenv').config();
const UserSchema = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const PostModel = require('../models/post.model');
const cloudinary = require('cloudinary').v2;


const upload = multer({ storage: multer.memoryStorage() });

// function to create a new User instance or signup 
async function createUser(req, res) {
  const userDetails = { ...req.body };
  // password will be hash on the schema object
  try {
    const newUser = new UserSchema(userDetails);

    const savedUser = await newUser.save();

    res.status(200).json({ message: "User created successfully!" });
    return savedUser;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// function to login the existing user
async function loginUser(req, res) {
  try {

    const { username, password } = req.body;
    const user = await UserSchema.findOne({ username });
    if (!user) {
      res.status(400).json('Invalid username or email');
    }
    // Compare password using bcrypt.compare
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(400).json('Invalid password!');
    }
    // logging in
    jwt.sign({ username, id: user._id }, process.env.SECRET_KEY, { expiresIn: '6h' }, (err, token) => {
      // if (err) console.err(err);
      res.status(200).json({
        token: token,
        id: user._id,
        username,
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


// Configure Cloudinary with your credentials (replace with your actual values)     
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const uploadFile = async (req, res) => {
  try {
    // Ensure file is uploaded and available in req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const localFilePath = req.file?.buffer;
    if(!localFilePath) {
      return res.status(400).json('No image file uploaded');
    }
    const { title, summary, content } = req.body;
    const token = req.headers.authorization;
    // Verify JWT token
    const userData = await jwt.verify(token, process.env.SECRET_KEY);
    if (!userData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Upload the image to Cloudinary
    let result;
    if (localFilePath) {
      result = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
        folder: 'Blog-images',
        overwrite: false,
      });
    }
    // Create new post
    const newPost = new PostModel({
      title,
      summary,
      content,
      cover: result.secure_url,
      author: userData.id,
    });
    await newPost.save();
    res.status(200).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  } finally {
    // Clean up temporary files if needed
    // fs.unlinkSync(localFilePath);
  }
};



// function to getting all posts
const getAllPosts = async (req, res) => {
  const posts = await PostModel.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.status(200).json(posts);
}
// function to get single post
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.fileById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
  }
}

// function to update a post
async function updatePost(req, res) {
  const localFilePath = req.file?.buffer;
  
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', 
      folder: 'Blog-images', 
      overwrite: false,
    });


    const token = req.headers.authorization;
    const { title, summary, content, id } = req.body;
    const userData = await jwt.verify(token, process.env.SECRET_KEY);

    const postData = await PostModel.findById(id);
    if (!postData) {
      return res.status(404).json('Post not found');
    }

    const isAuthor = postData.author.toString() === userData.id;
    if (!isAuthor) {
      return res.status(403).json('You are not the author of this post');
    }

    const updatedData = {
      title,
      summary,
      content,
      cover: result.secure_url,
      author: userData.id,
    };

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, author: userData.id }, // Specify the condition to update the correct post
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json('Post not found or you are not the author');
    }
    res.status(200).json('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({'error: ':error.message});
  } finally {
    // fs.unlinkSync(localFilePath);
  }
}

// function to delete a post
async function deletePost(req, res) {
  const postId = req.params.id;
  const token = req.headers.authorization;
  const userData = jwt.verify(token, process.env.SECRET_KEY);

  const postData = await PostModel.findById(postId);
  if (!postData) {
    return res.status(404).json('Post not found');
  }

  const isAuthor = postData.author.toString() === userData.id;
  if (!isAuthor) {
    return res.status(403).json('You are not the author of this post');
  }

  await PostModel.deleteOne({ _id: postId });

  return res.status(200).json('Post deleted successfully');
}

// logout user
const logoutUser = (req, res) => {
  res.json('ok');
}
module.exports = { createUser, loginUser, logoutUser, uploadFile, getAllPosts, getPost, updatePost, deletePost };