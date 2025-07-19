const mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://prakash8290682001:<k7lHE1XzTNRa5V67>@cluster0.xs7spfb.mongodb.net/feedback?retryWrites=true&w=majority&appName=Cluster0', );

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    lastName: {
        type: String,
        required: true,

        trim: true,
        minlength: 2,
    },
}, { timestamps: true });


module.exports= mongoose.models.User || mongoose.model('User', userSchema);
