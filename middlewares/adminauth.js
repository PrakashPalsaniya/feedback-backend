const jwt = require('jsonwebtoken');
const User = require('../models/user.js');



const adminauth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log("Token received:", token);

  if (!token) return res.status(401).json({ message: 'Please Register/Login To Proceed' });

  try {
    const decoded = jwt.verify(token, 'zzz');
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminauth;
