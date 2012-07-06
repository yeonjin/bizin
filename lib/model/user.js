var msg = require('../define/message');
var async = require('async');
var EventDao = require('./dao/eventDao').EventDao;

exports.auth = function(userId, userPassword, cb)
{
	eventDao = new EventDao();
	eventDao.getUser(userId, ["UserId", "Password"], function (err, items){
		
		var status = msg.FAIL;
    	var message = msg.FAIL_SYS_ERR;
    	
    	if (items == null)
    	{
    		message = msg.FAIL_NOT_EXIST_USERID;
    	}
    	else if (userPassword == items.Password)
    	{
    		status = msg.SUCCESS;
    		message = '성공~';
    	}
    	else
    	{
    		message = msg.FAIL_INCORRECT_PASSWORD;
    	}
    	
    	var data = {};
    	data.Status = status;
    	data.Message = message;
    	
    	return cb(err, data);
	});
};

exports.getCollars = function(userId, cb)
{
	eventDao = new EventDao();
	eventDao.getCollars(userId, ["ConnectionUserId", "ConnectionCount"], function (err, collars){
		
		var functions = new Array();
		var count = new Array();
		// 함수 배열 생성 
		for (var i = 0 ; i < collars.length; i++)
		{
			var id = collars[i].ConnectionUserId;
			//var count = collars[i].ConnectionCount;
			count[id] = collars[i].ConnectionCount;
			
			var callCountFun = 0;
			console.log(JSON.stringify(collars[i]));
			functions.push(function (callback){
				console.log('id : ' + id);
				console.log('count id : ' + collars[callCountFun].ConnectionUserId);
				eventDao.getUser(collars[callCountFun].ConnectionUserId, ["UserId", "ImageUrl"], function (err, users){
					//console.log('id : ' + collars[callCount].ConnectionUserId + ', users : ' + JSON.stringify(users));
					users.ConnectionCount = count[users.UserId];
					callback(err, users);
				});
				callCountFun++;
			});
		}
		
		//함수 병렬 실행. 
		if (collars.length > 0)
		{
			async.parallel(functions, function(error, results){
				console.log('results : ' + results);
				return cb(err, results);
			});	
		}
		else
		{
			return cb(err, []);
		}
	});
};

exports.getProfile = function(userId, connectionUserId, cb)
{
	var attributes = ["UserId"
                      , "SurName"
                      , "GivenName"
                      , "Mail"
                      , "ImageUrl"
                      , "CurrentCompany"
                      , "CurrentPosition"
                      , "Education"
                      , "ImageId"
                      ];
	
	eventDao = new EventDao();
	eventDao.getUser(connectionUserId, attributes, function (err, users){
		console.log(users);
		
		eventDao.getImages(connectionUserId, null, function (err, images){
			if (users != null)
			{
				users.Images = images; 	
			}
			eventDao.getCollar(userId, connectionUserId, function (err, collar){
				console.log('collar list :' + JSON.stringify(collar));
				
				var connections = [];
				if (null != collar)
				{
					connections = collar.ConnectionInfo;
				}
				
				console.log('items length : ' + connections.length);
				var functions = new Array();
				var callCountFun = 0;
				for (var i = 0 ; i < connections.length; i++)
				{
					var id = connections[i];
					functions.push(function (callback){
						eventDao.getConnection(userId, connections[callCountFun], function (err, connections){
							callback(err, connections);
					 	});
						callCountFun++;
					});
				}
				
				if (connections.length > 0)
				{
					async.parallel(functions, function(error, connections){
						users.ConnectionList = connections;
						return cb(err, users);
					});	
				}
				else
				{
					return cb(err, users);
				}
			});
			
		});
	});
	
};

exports.connection = function(userId, connectionUserId, connectionDateTime, connectionMeetingId, cb){
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	var connectionId = guidGenerator();
    
	var item = {UserId: userId
				, ConnectionId:connectionId
				, ConnectionUserId:connectionUserId
			    , ConnectionMeetingId:connectionMeetingId
			    , ConnectionDateTime:connectionDateTime};
	
	eventDao = new EventDao();
	eventDao.insertConnection(item, function (err, returnValue){
		console.log('connection put body : ' + returnValue);
    	
		eventDao.addCollarConnection(connectionId, userId, connectionUserId, function(err, returnValue){
    		
    		status = msg.SUCCESS;
    		message = '성공 ~';
    		
    		console.log('updateitem collar body : ' + returnValue);
    		
    		var data = {Status:status, Message: message};
        	return cb(err, data);
    	});
    });
};

exports.savePicture = function(objPicture, cb){
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	var imageId = guidGenerator();
    
	var item = {UserId: objPicture.strUserId
			   , ImageId: imageId
			   , ImageLocation: objPicture.strImageLocation
			   , UploadedDateTime: objPicture.strUploadedDateTime
			   , Title: objPicture.strTitle
			   , Width: objPicture.strWidth
			   , Height: objPicture.strHeight};
	
	eventDao = new EventDao();
	eventDao.insertPhotoInfo(item, function(err, returnValue){
	
		console.log('picture put body : ' + returnValue);
    	
		var imageLocation = null;
        
        if ('true' == objPicture.strIsMainPicture)
        {
        	imageLocation = objPicture.strImageLocation;
        }
    	eventDao = new EventDao();
    	eventDao.addUserImageId(objPicture.strUserId, imageId, imageLocation, function(err, returnValue){
    		
    		status = msg.SUCCESS;
    		message = '성공 ~';
    		
    		console.log('updateitem user body : ' + returnValue);
    		
    		var data = {Status:status, Message: message};
        	return cb(err, data);
    	});
    });
};

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
