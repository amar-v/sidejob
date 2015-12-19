var mongoose = require('mongoose');

var ConversationSchema = mongoose.Schema({
    id: String,
    messages: {
    	id: String,
    	sender: String,
    	message: String,
    	time: {
    		date: String,
    		time: String
    	}
    }
});

mongoose.model('Conversation', ConversationSchema);