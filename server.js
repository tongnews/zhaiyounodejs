// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var orm = require("orm");
var mongoose = require("mongoose");
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var hasher = require('password-hash');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.toString().split("/")[1])
  }
});
var upload = multer({ storage: storage });

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static('uploads'));

mongoose.connect('mongodb://115.159.199.49:27017/zhaiyou'); 
var User     = require('./app/models/user');
var Activity     = require('./app/models/activity');
var IntreTag     = require('./app/models/intreTag');
var IntreSpot     = require('./app/models/intreSpot');

app.set('superSecret', config.secret); // secret variable

//-------------------------------Add token protect for all -----------------------------------

// route middleware to verify a token
app.use('/api/t/',function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: '通行token证验证失败！' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var port = process.env.PORT || 80;

// routes will go here
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/info').get(function(req, res) {
    res.json({ message: '欢迎使用宅游API!!!' });   
});

//USER API
//router.route('/user/:user_id')
//	.get(function(req, res) {
//		req.models.User.find({id:req.params.user_id} , function(err, users) {
//	            if (err)	res.send(err);
//	            res.json({ message: '用户-信息读取','信息':users});   
//	    });
//	})
//	.post(function(req, res) {
//     	req.models.User.create({id: req.params.user_id , name: req.body.name} , function(err) {
//	            if (err)	res.send(err);
//	            res.json({ message: '用户-信息更新', 'ID':req.params.user_id, 'name':req.body.name});   
//	    });
//	});


// Auxurly function
function authenticate(name, pass, fn) {
	
	//console.log(name);
	//console.log(pass);
	 
    User.findOne({
        username: name
    },
    function (err, user) {
    	//console.log(user);
        if (user) {
            if (err) return fn(new Error('找不到该用户'));
            //console.log(hasher.verify(pass, user[0].password));
            if (hasher.verify(pass, user.password)) return fn(null, user);
            return fn(new Error('密码错误'));
        } else {
            return fn(new Error('找不到该用户'));
        }
    });
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            res.json({ success: false, message: '用户已存在!' });
        }
    });
}

//用户注册
router.route('/user/signup').post(userExist, function (req, res) {

	var password = req.body.password;
	var username = req.body.username;
    var email = req.body.email;
 
	var hash=hasher.generate(password);

	var user = new User({
		username: username,
		password: hash,
		email: email,
	})
	var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 1209600 // expires in 2 weeks
	});
	user.token=token;
	user.save( function (err, newUser) {
		if (err) throw err;
		authenticate(newUser.username, password, function(err, user){
			if (err)	res.send(err);
			if(user){
				// return the information including token as JSON
				res.json({
					success: true,
					message: '注册成功,获得token!',
					user:user
				});
			}
		});
	});
});

router.route('/t/user/name').post(function (req, res) {
	
	var username = req.body.username;
	var newname = req.body.name;
	
    User.findOne({
        username: username
    },
    function (err, user) {
    	//console.log(user);
        if (user) {
            if (err)	res.send(err);
			user.name=newname;
			user.save(function (err, user){
				  if (err)	res.send(err);
				  res.send({ 
				  	success: true, 
				  	message: '用户昵称更改成功',
				  	user: user,  });
			});
        } else {
            return fn(new Error('找不到该用户'));
        }
    });
});

//用户登录
router.route('/user/login').post(function (req, res) {
	authenticate(req.body.username, req.body.password, function (err, user) {
		if (user) {
			var token = jwt.sign(user, app.get('superSecret'), {
				expiresIn: 1209600 // expires in 2 weeks
			});
			// return the information including token as JSON
			res.json({
				success: true,
				message: '获得token!',
				user: user
			});
		} else {
			res.json({ 
				success: false, 
				message: '用户密码组合错误' });
		}
	});
});

router.route('/t/user/image-upload').post(upload.single('avatarimg'),function(req, res, next) {
	
	var username = req.body.username;
	
    User.findOne({
        username: username
    },
    function (err, user) {
    	//console.log(user);
        if (user) {
            if (err)	res.send(err);
			user.picture=req.file.filename;
			user.save(function (err,suser){
				  if (err)	res.send(err);
				  res.json({
				  	success: true,
				  	message: '上传成功',
				  	user: suser });
			});
        } else {
            return fn(new Error('找不到该用户'));
        }
    });
 
});

//全部用户
router.route('/t/user/all').get(function(req, res) {
	User.find({}, function(err, users) {
		res.json({
			success: true, 
			message: '获取用户列表成功',
			users: users });
	});
});

//ACTIVITY API

router.route('/activity/image-upload').post(upload.single('activityimg'),function(req, res, next) {
  res.json({ ori: req.file.originalname, dst: req.file.filename, message: '上传成功' });
});

router.route('/activity/add').post(function (req, res) {
	var activity = new Activity({
		title: req.body.title,
		text_cotent:req.body.text_cotent,
		owner: req.body.user_id,
		max_num	: req.body.max_num,
	}).save( function (err) {
		if (err) res.send(err);
		// return the information including token as JSON
		res.json({
			success: true,
			message: '活动申请成功!',
		});
	});
});



router.route('/activity/id/:activity_id').get(function(req, res) {
	Activity.findById(req.params.activityid, function(err, activity) {
		if (err) res.send(err);
		res.json(activity);
	});
});


router.route('/activity/all').get(function(req, res) {
	Activity.find({}, function(err, activities) {
		res.json(activities);
	});
});

router.route('/activity/subscribe/:activity_id').post(function(req, res) {
	Activity.findById(req.params.activity_id, function(err, activity) {
		if (err) res.send(err);
		activity.cur_num =activity.cur_num+1;
		activity.joiner.unshift(req.params.user_id);
		// save the bear
		activity.save(function(err) {
			if (err) res.send(err);
			res.json({ message: 'Activity updated!' });
		});
	});
});
	
router.route('/activity/unsubscribe/:activity_id').post(function(req, res) {
	Activity.findById(req.params.activity_id, function(err, activity) {
		if (err) res.send(err);
		activity.cur_num =activity.cur_num-1;
		activity.joiner.splice(req.params.user_id);
		// save the bear
		activity.save(function(err) {
			if (err) res.send(err);
			res.json({ message: 'Activity updated!' });
		});
	});
});
	
router.route('/activity/comments/:activity_id')
.get(function(req, res) {
	Activity.find({}, function(err, activities) {
		res.json(activities);
	});
}).post(function(req, res) {
	Activity.find({}, function(err, activities) {
		res.json(activities);
	});
});

//INTRE API

//INTRESPOT API


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
