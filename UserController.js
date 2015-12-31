var path = require('path');

UserController = function() {};

UserController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var file = req.files.file;
    console.log(file.name);
    console.log(file.type);
    console.log(file)
    console.log(file.fieldName)

    for(i=file.path.length;i>0;i--) {
    	if(file.path[i]=="\\"){
    		break
    	}
    }
    var filename = file.path.substring(i+1,file.path.length);
    console.log(filename)

    res.json({url:'/profileimages/'+filename})
   
}

module.exports = new UserController();