var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
    date: {
        day: String,
        month: String,
        year: String
    }
});

mongoose.model('Message', MessageSchema);