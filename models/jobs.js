var mongoose = require('mongoose');

var JobSchema = mongoose.Schema({
    user: String,
    title: String,
    description: String,
    ZIP: String,
    category: String,
    date: {
        day: String,
        month: String,
        year: String
    }
});

mongoose.model('Job', JobSchema);