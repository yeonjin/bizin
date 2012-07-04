var user = require('../../lib/model/user');
var meeting = require('../../lib/model/meeting');
var test = require('../../lib/model/test');
	
exports.auth = function(req, res)
{
	var userId = req.params.userId;
	var userPassword = req.params.userPassword;
	
	console.log('request auth');
	console.log(userId);
	console.log(userPassword);
	
	user.auth(userId, userPassword, function(err, body){
		res.send(body);
	});
};

exports.meetings = function(req, res)
{
	var userId = req.params.userId;
	var lastId = req.params.lastId;
	var requestNumber = Number(req.params.requestNumber);
	
    console.log('request meetings');
    console.log(userId);
    console.log(lastId);
    console.log(requestNumber);
    
    meeting.getList(requestNumber, lastId, function(err, body){
    	console.log(body);
		res.send(body);
	});
};

exports.meeting = function(req, res)
{
	var meetingId = req.params.meetingId;
	var userId = req.params.userId;
	
	console.log('request meeting');
	console.log(meetingId);
	console.log(userId);
	
	meeting.getMeeting(meetingId, function(err, body){
    	console.log(body);
		res.send(body);
	});
	
};
exports.checkin = function(req, res)
{
	var meetingId = req.params.meetingId;
	var userId = req.params.userId;
	
	console.log('request checkin');
	console.log(meetingId);
	console.log(userId);
	
	meeting.checkin(meetingId, userId, function(err, body){
    	console.log(body);
		res.send(body);
	});
};
exports.collars = function(req, res)
{
	var userId = req.params.userId;
	
	console.log('request get collars');
	console.log(userId);
	
	user.getCollars(userId, function(err, body){
		console.log('?');
		console.log(body);
		res.send(body);
	});
};
exports.profile = function(req, res)
{
	var userId = req.params.userId;
	var connectionUserId = req.params.connectionUserId;
	
	console.log('request get profile');
	console.log(userId);
	console.log(connectionUserId);
	
	user.getProfile(userId, connectionUserId, function(err, body){
		res.send(body);
	});
};
exports.savePicture = function(req, res)
{  
	var objPicture = new Object();
	objPicture.strUserId = req.body.userId;
	objPicture.strImageLocation = req.body.imageLocation;
	objPicture.strUploadedDateTime = req.body.uploadedDateTime;
	objPicture.strTitle = req.body.title;
	objPicture.strWidth = req.body.title;
	objPicture.strHeight = req.body.title;
	objPicture.strIsMainPicture = req.body.isMainPicture;
	
	console.log('request savePicture');
	console.log(objPicture);
	
	user.savePicture(objPicture, function(err, body){
		res.send(body);
	});
};
exports.connection = function(req, res)
{
	var userId = req.body.userId;
	var connectionUserId = req.body.connectionUserId;
	var connectionDateTime = req.body.connectionDateTime;
	var connectionMeetingId = req.body.connectionMeetingId;
	
	console.log('request connection');
	console.log(userId);
	console.log(connectionUserId);
	console.log(connectionDateTime);
	console.log(connectionMeetingId);
	
	user.connection(userId, connectionUserId, connectionDateTime, connectionMeetingId, function(err, body){
		res.send(body);
	});
};

exports.test = function(req, res)
{
	/*
	test.putMeetingImage(function(err, body){
		res.send(body);
	});
	*/
	
	/*
	test.deleteImageId(function(err, body){
		res.send(body);
	});
	*/
	
	test.deleteCheckinInfo(function(err, body){
		res.send(body);
	});
};
