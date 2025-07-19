
const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://prakash8290682001:<k7lHE1XzTNRa5V67>@cluster0.xs7spfb.mongodb.net/feedback?retryWrites=true&w=majority&appName=Cluster0', {
 // useNewUrlParser: true,
   // useUnifiedTopology: true,
//});

const feedbackSchema = new mongoose.Schema({
  pageId: { type: String, required: true }, 
  content: { type: String, required: true },
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
});

module.exports =  mongoose.models.Feedback|| mongoose.model('Feedback', feedbackSchema);
