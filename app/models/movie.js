const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entryFormat = new Schema({
    movieName: {
        type: String,
        required: true,
    },
    genre: {
        type: String, 
        required: true,
        enum: ['thriller', 'horror', 'comdey', 'romance', 'sci-fi', 'action']
    },
    plot: {
        type: String,
        required: true
    },
    duration: { 
        type: String, 
        required: false 
    },
    why: {
        type: String,
        required: true
    },
    thumbUp: {
        type: Number,
        required: true
    }
});

const Movie = mongoose.model('Movie', entryFormat); // Mongoose model is called 'Mood'
// I can use the 'moods' collection in MongoDB using the Mood model. The model is automatically pluralized by Mongoose -_-

module.exports = Movie;