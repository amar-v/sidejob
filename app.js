var fs = require('fs');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var multer = require('multer');
var upload = multer({
    dest: 'public/uploads/'
});
var path = require('path');
var util = require('./config/util.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



var env = process.env.NODE_ENV || 'default';
var config = require('config');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    //console.log(socket.request.session);
  socket.on('chat message', function(msg){
    //Get and format time
    var dt = new Date();
    var hours = 0;
    if(dt.getHours()<10) {
        hours = '0'+dt.getHours()
    } else {
        hours = dt.getHours();
    }
    var minutes = 0;
    if(dt.getMinutes()<10) {
        minutes = '0'+dt.getHours()
    } else {
        minutes = dt.getMinutes();
    }
    var time = hours + ":" + minutes;
    //Emit message to all users
    io.emit('chat message', {'message':msg.message,'time':time,'user':msg.user,'id':msg.id, 'identifier':msg.identifier});
  });
});

// configure database
require('./config/database')(app, mongoose);

// bootstrap data models
fs.readdirSync(__dirname + '/models').forEach(function(file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

// Configuration for Paypal Rest API Module
try {
    var configJSON = fs.readFileSync(__dirname + "/config.json");
    var config = JSON.parse(configJSON.toString());
} catch (e) {
    console.error("File config.json not found or is invalid: " + e.message);
    process.exit(1);
}
//routes.init(config);

// configure express app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser('S3CRE7'));
app.use(flash());
app.use(session({
    secret: 'S3CRE7-S3SSI0N',
    saveUninitialized: true,
    resave: true
}));
app.use(express.static(path.join(__dirname, 'public')));
var test_user = require('./config/passport')(app, passport);    //Added var test_user = 
app.use(passport.initialize());
app.use(passport.session());
try {
    var configJSON = fs.readFileSync(__dirname + "/config.json");
    var config = JSON.parse(configJSON.toString());
} catch (e) {
    console.error("File config.json not found or is invalid: " + e.message);
    process.exit(1);
}
// configure routes
var routes = require('./routes/index');
var home = require('./routes/index');
var signin = require('./routes/signin');
var signup = require('./routes/signup');
var account = require('./routes/account');

app.use('/', home);   //commented out
app.use('/account', account);
app.use('/signin', signin);
app.use('/signup', signup);




// Requires multiparty 
multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty({autoFiles:true,uploadDir:path.join(__dirname + '/public/profileimages')});

// Requires controller
UserController = require('./UserController');

//console.log("This is object " + multipartyMiddleware)
// Example endpoint 
app.post('/uploadprofile', multipartyMiddleware, UserController.uploadFile);



/*var multer  = require('multer')
var upload = multer({ dest: 'upload_pictures/' })

app.post('/uploadprofile', multer({ dest: 'upload_pictures/'}).single('avatar'), function (req, res) {
    console.log(req.file)
})*/

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email']
    }),
    function(req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });
// configure error handlers

//ADDED CODE ********************************************************************

//MODELS
var User = mongoose.model('User');
var Job = mongoose.model('Job');
var Message = mongoose.model('Message');
var Conversation = mongoose.model('Conversation');


app.get('/message',function(req,res) {
    res.sendFile(__dirname+"/message.html");
});

app.get('/dashboard',function(req,res) {
    res.sendFile(__dirname+"/message.html");
});

/*var message = new Message({
    sender: 'Mark J',
    receiver: 'Julia B',
    text: 'How are you?',
    date: {
        day: '21',
        month: '01',
        year: '2015'
    }
});

message.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(message);
});*/

app.get('/test_messages', require('connect-ensure-login').ensureLoggedIn(),
    function(req,res) { 
        Message.find(function(err, movies) {
            if (err) {
              return res.send(err);
            }

            res.json(movies);
        });
    }
);


app.get('/test_users',function(req,res) {
    
    User.find(function(err, users) {
        if (err) {
          return res.send(err);
        }

        res.json(users);
    });
});

app.get('/signup',function(req,res) {
    res.sendFile(__dirname+"/signup.html");
});

app.get('/test_user',function(req,res) {
    res.json({'user':req.user.email});
});

app.get('/f_name',function(req,res) {
    res.json({'user':req.user.firstName});
});

app.get('/',function(req,res) {
    res.sendFile(__dirname+"/index.html");
});

app.get('/explore',function(req,res) {
    res.sendFile(__dirname+"/views/partial_explore.html");
});

app.get('/appliedjobs',function(req,res) {
    res.sendFile(__dirname+"/views/partial_jobs.html");
});

/*var job1 = new Job({
    user: 'test__12345@gmail.com',
    title: 'Job title 2',
    description: 'This is job description 2',
    ZIP: '11000',
    category: 'working',
    date: {
        day: '01',
        month: '04',
        year: '2015'
    }
});

job1.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(job1);
});*/

app.get('/partial',function(req,res) {
    res.sendFile(__dirname+"/views/partial_message.html");
});

app.get('/partial2',function(req,res) {
    res.sendFile(__dirname+"/views/partial_dashboard.html");
});

app.get('/logout', function (req, res){req.logout();req.session.destroy(function (err) {res.redirect('/');});});//*****************************************************************************

app.get('/explore',function(req,res) {
    res.sendFile(__dirname+"/views/partial_explore.html");
});

app.get('/profile',function(req,res) {
    res.sendFile(__dirname+"/views/partial_profile.html");
});
app.get('/explore-item',function(req,res) {
    res.sendFile(__dirname+"/views/partial_explore_item.html");
});

app.post('/getprofileinfo1',function(req,res) {
    User.find(function(a) {
        console.log(a);
    })
    
    res.json({
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@email.com',
        avatar: 'http://localhost:8001/profileimages/wSi3rtvaQJINs5Z3JMyY6-0w.jpg',
        address: 'San Francisco, CA',
        job: 'data scientist',
        topskills: ['js','python','css','HTML'],
        summary: 'user biography'
});
})

app.post('/getworkimages',function(req,res) {
    res.json({
        images: [
            "http://localhost:8001/profileimages/qmD6IphQN3nGu4-Tmp2ZgvPp.jpg",
            "http://localhost:8001/profileimages/wSi3rtvaQJINs5Z3JMyY6-0w.jpg"
        ]
    })
})


app.post('/getprofileinfo',function(req,res) {
    User.find({_id:req.session.passport.user},function(err, user) {
        if (err) {
          return res.send(err);
        }
        if(user[0]!=undefined) {
            var user_info = {
                firstname: user[0].firstName,
                lastname: user[0].lastName,
                email: user[0].email,
                avatar: 'http://' + req.headers.host + '/profileimages/' + user[0].avatar,
                address: user[0].address,
                position: user[0].position,
                topskills: user[0].skills,
                summary: user[0].summary
                
            };
        }
        
        console.log(user);
        console.log(user_info)
        res.json(user_info);
    });
})

app.get('/testing',function(req,res) {
    res.json({a: req.session.passport.users})
})

app.post('/updateprofile',function(req,res) {
    User.findOne({_id: req.session.passport.user},function(err,user) {
        console.log(req.body)
        if(req.body.summary!=null && req.body.summary!=undefined) {
            console.log(req.body.summary)
            user.summary = req.body.summary;
        }
        if(req.body.job!=null && req.body.job!=undefined) {
            console.log(req.body.job)
            user.job = req.body.job;
        }
        if(req.body.address!=null && req.body.address!=undefined) {
            console.log(req.body.address)
            user.address = req.body.address;
        }
        if(req.body.topSkills!=null && req.body.topSkills!=undefined) {
            console.log(req.body.topSkills)
            user.skills = req.body.topSkills;
        }

        
        user.save();
    });
    res.json({msg:'updated'})
})


app.post('/createjob', function(req,res) {
    var job = new Job({
        user: 'test__12345@gmail.com',
        title: req.body.title,
        description: req.body.description,
        ZIP: req.body.ZIP,
        category: req.body.categories,
        date: {
            day: '01',
            month: '04',
            year: '2015'
        }
    });

    job.save(function(err, thor) {
      if (err) return console.error(err);
      console.dir(job1);
    });
    res.json({msg:'success'});
})

app.get('/getjobs', function(req,res) {
    //res.json("CURRENT USER " + req.session.passport.user)
    /*Job.find({user:req.session.passport.user},function(err,job) {  //update email getter for security reasons
        console.log("CURRENT USER " + req.session.passport.user)
        res.json(job);
    })*/
    Job.find(function(err,job) {
        if (err) {
            res.json({msg:'Error'});
        }
        else {
            res.json(job);
        }
        
    })
});


require('./config/errorHandlers.js')(app);

// launch app server
var server = http.listen(8001);

module.exports = app;
