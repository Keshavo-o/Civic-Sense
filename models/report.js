const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // reference to User
    required: true
  },
  name :{
    type: String,
    default:"User"
  },
  text: {
    type: String,
    required: true,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const reportSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 280
  },
  image: {
    type: String,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  department: String,
  title: String,
  category: String,
  priority: String,
  location: String,
  geolocation: {
  type: {
    type: String,
    enum: ['Point'], // GeoJSON
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    default: [0, 0] // Default coordinates
  }
},
latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  map_me_dikhana: {
    type: Boolean,
    default: false
  },
  status:{
    type :String,
    default : "Pending"
  }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
