const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Sentiment = require('sentiment');
const connectDB = require('../../lib/db.js') ;

const User = require('./../../models/user.js');
const Feedback = require('./../../models/feedback.js');
const adminauth = require('./../../middlewares/adminauth.js');

const app = express();
const sentiment = new Sentiment();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',  
  credentials: true     
}));

connectDB();

app.get('/api/me', adminauth, (req, res) => {
  const { email, firstName, lastName, _id } = req.user;
  res.json({ user: { email, firstName, lastName, _id } });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
});



app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    const token = jwt.sign({ email }, 'zzz', { expiresIn: '1h' });
    res.cookie('token', token);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email }, 'zzz', { expiresIn: '1h' });
    res.cookie('token', token);

    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/api/feedback', async (req, res) => {
  const { pageId, content, category } = req.body;

  if (!pageId || !content) {
    return res.status(400).json({ message: 'Missing feedback data' });
  }

  try {
    const feedback = new Feedback({ pageId, content, category });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/admin/dashboard', adminauth, async (req, res) => {
  try {
    const user = req.user;
   

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      admin: {
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
    
      },
      feedbacks,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/api/admin/feedback/:id', adminauth, async (req, res) => {
  const feedbackId = req.params.id;

  try {
 const feedback = await Feedback.findOne({pageId : feedbackId });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }



    await Feedback.deleteOne({pageId : feedbackId});
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting feedback' });
  }
});



app.post('/api/analyze-sentiment', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "No text provided" });

  const result = sentiment.analyze(text);
  res.json(result);
});



app.listen(3005, () => {
  console.log('Server is running on http://localhost:3000');
});
