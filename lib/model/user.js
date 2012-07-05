var Dynamo = require('../db/dynamo').Dynamo;
var DBInfo = require('../db/dbInfo').DBInfo;
var msg = require('../define/message');
var async = require('async');

exports.auth = function(userId, userPassword, cb)
{
	dbInfo = new DBInfo("User", userId, null);
	
	dbInfo.setAttributesToGet(["UserId", "Password"]);
	dynamo = new Dynamo(dbInfo);
	dynamo.getItem(function (err, items){
		
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
    	
    	//var data = {Status:status, Message: message};
    	var data = new Object();
    	data.Status = status;
    	data.Message = message;
    	return cb(err, data);
	});
};

exports.getCollars = function(userId, cb)
{
	dbInfo = new DBInfo("Collar", userId, null);
	dbInfo.setAttributesToGet(["ConnectionUserId", "ConnectionCount"]);

	dynamo = new Dynamo(dbInfo);
	
	dynamo.query(function (err, returnValue){
		var items = new Array();
		if (null != returnValue)
		{
			items = returnValue.Items;
		}
		
		var functions = new Array();
		for (var i = 0 ; i < items.length; i++)
		{
			//console.log(i + ' loop : ' + checkinIds[i]);
			//console.log(typeof checkinIds[i]);
			var id = items[i].ConnectionUserId;
			var count = items[i].ConnectionCount;
			
			console.log('items : ' + JSON.stringify(items[i]));
			functions.push(function (callback){
				
				var dbInfo = new DBInfo("User", id, null);
				console.log(dbInfo);
				dbInfo.setAttributesToGet(["UserId", "ImageUrl"]);
				var dynamo = new Dynamo(dbInfo);
				dynamo.getItem(function (err, resultValue){
					resultValue.ConnectionCount = count;
					callback(err, resultValue);
			 	});
			});
		}
		
		var returnValue = new Array();
		if (items.length > 0)
		{
			async.parallel(functions, function(error, results){
				//console.log('count : ' + count);
				console.log('results : ' + results);
				/*
				if ('undefined' != typeof results)
				{
					returnValue.push({UserId : results.UserId,
						 ConnectionCount: count,
						 ImageUrl: results.ImageUrl});	
				}*/
				
				return cb(err, results);
			});	
		}
		else
		{
			return cb(err, returnValue);
		}
	});
	//dynamo.batchGetItem(cb);
	//dynamo.getItem(cb);
};

exports.getProfile = function(userId, connectionUserId, cb)
{
	dbInfo = new DBInfo("User", connectionUserId, null);
	dbInfo.setAttributesToGet(["UserId"
	                           , "SurName"
	                           , "GivenName"
	                           , "Mail"
	                           , "ImageUrl"
	                           , "CurrentCompany"
	                           , "CurrentPosition"
	                           , "Education"
	                           , "ImageId"
	                           ]);
	dynamo = new Dynamo(dbInfo);
	var userInfo = {};
	dynamo.getItem(function(err, results){
		console.log(results);
		//return cb(err, results);'
		
		userInfo = results;
		
		//delete userInfo.CheckinInfo;
		
		dbInfo = new DBInfo("Image", connectionUserId, null);
		dynamo = new Dynamo(dbInfo);
		dynamo.query(function(err, results){
			userInfo.Images = results.Items; //error  발생 ! 죽음..ㅡㅡ;;
			//return cb(err, userInfo);
			
			dbInfo = new DBInfo("Collar", {hash: userId, range: connectionUserId}, null);
			dynamo = new Dynamo(dbInfo);
			dynamo.getItem(function(err, results){
				console.log('collar list :' + JSON.stringify(results));
				
				var items = [];
				if (null != results)
				{
					items = results.ConnectionInfo;
				}
				
				console.log('items length : ' + items.length);
				var functions = new Array();
				for (var i = 0 ; i < items.length; i++)
				{
					//console.log(i + ' loop : ' + checkinIds[i]);
					//console.log(typeof checkinIds[i]);
					var id = items[i];
					//var count = items[i].ConnectionCount;
					
					//console.log('items : ' + JSON.stringify(items[i]));
					functions.push(function (callback){
						
						var dbInfo = new DBInfo("Connection", {hash:userId, range:id}, null);
						//console.log(dbInfo);
						//dbInfo.setAttributesToGet(["UserId", "ImageUrl"]);
						var dynamo = new Dynamo(dbInfo);
						dynamo.getItem(function (err, resultValue){
							
							//console.log('connection info : ' + resultValue);
							
							callback(err, resultValue);
					 	});
					});
				}
				
				if (items.length > 0)
				{
					async.parallel(functions, function(error, results){
						//console.log('results : ' + results);
						userInfo.ConnectionList = results;
						return cb(err, userInfo);
					});	
				}
				else
				{
					return cb(err, userInfo);
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
	
	dbInfo = new DBInfo("Connection", connectionId, item);
	
	dynamo = new Dynamo(dbInfo);
	dynamo.putItem(function (err, returnValue){
		console.log('connection put body : ' + returnValue);
    	
        var updates = {ConnectionInfo: {'add':[connectionId]}, ConnectionCount: {'add':1}};
        console.log(updates);
        
        dbInfo = new DBInfo("Collar", {hash: userId, range: connectionUserId}, updates);
    	
    	dynamo = new Dynamo(dbInfo);
    	dynamo.updateItem(function(err, returnValue){
    		
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
	
	dbInfo = new DBInfo("Image", imageId, item);
	
	dynamo = new Dynamo(dbInfo);
	dynamo.putItem(function (err, returnValue){
		console.log('picture put body : ' + returnValue);
    	
        var updates = {ImageId: {'add':[imageId]}};
        
        if ('true' == objPicture.strIsMainPicture)
        {
        	updates.ImageUrl = {'put':objPicture.strImageLocation};
        }
        console.log(updates);
        console.log(objPicture.strUserId);
        
        dbInfo = new DBInfo("User", objPicture.strUserId, updates);
    	
    	dynamo = new Dynamo(dbInfo);
    	dynamo.updateItem(function(err, returnValue){
    		
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
