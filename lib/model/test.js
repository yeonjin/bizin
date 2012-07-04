var Dynamo = require('../db/dynamo').Dynamo;
var DBInfo = require('../db/dbInfo').DBInfo;
var msg = require('../define/message');

exports.putMeetingImage = function(cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	//var connectionId = guidGenerator();
	
    var updates = {ImageUrl: {'put':'com.iceflobe.eventpicture/event1.jpeg'}};
    console.log(updates);
    dbInfo = new DBInfo("Meeting", 'woeif378sdkjfhtest', updates);
	dynamo = new Dynamo(dbInfo);
	
	
	dynamo.updateItem(function(err, returnValue){
		/*
		console.log('meeting image update : ' + returnValue);
		updates = {ImageUrl: {'put':'com.iceflobe.eventpicture/event2.jpeg'}};
	    
		console.log(updates);
	    dbInfo = new DBInfo("Meeting", 'bb056238-16c3-4b63-8b8a-9ae759533fe1', updates);
		dynamo = new Dynamo(dbInfo);
		dynamo.updateItem(function(err, returnValue){
		*/	
			status = msg.SUCCESS;
			message = '성공 ~';
			
			console.log('meeting image updae : ' + returnValue);
			
			var data = {Status:status, Message: message};
	    	return cb(err, data);
	    //});
    });
};

exports.deleteImageId = function(cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	//var connectionId = guidGenerator();
	
    var updates = {ImageId: {'Action':'DELETE'}};
    console.log(updates);
    dbInfo = new DBInfo("User", 'kylee@iceflobe.com', updates);
	dynamo = new Dynamo(dbInfo);
	
	
	dynamo.updateItem(function(err, returnValue){
		/*
		console.log('meeting image update : ' + returnValue);
		updates = {ImageUrl: {'put':'com.iceflobe.eventpicture/event2.jpeg'}};
	    
		console.log(updates);
	    dbInfo = new DBInfo("Meeting", 'bb056238-16c3-4b63-8b8a-9ae759533fe1', updates);
		dynamo = new Dynamo(dbInfo);
		dynamo.updateItem(function(err, returnValue){
		*/	
			status = msg.SUCCESS;
			message = '성공 ~';
			
			console.log('meeting image updae : ' + returnValue);
			
			var data = {Status:status, Message: message};
	    	return cb(err, data);
	    //});
    });
};

exports.deleteCheckinInfo = function(cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	//var connectionId = guidGenerator();
	
    var updates = {CheckinInfo: {'Action':'DELETE'}};
    console.log(updates);
    dbInfo = new DBInfo("Meeting", 'bb056238-16c3-4b63-8b8a-9ae759533fe1', updates);
	dynamo = new Dynamo(dbInfo);
	
	
	dynamo.updateItem(function(err, returnValue){
		/*
		console.log('meeting image update : ' + returnValue);
		updates = {ImageUrl: {'put':'com.iceflobe.eventpicture/event2.jpeg'}};
	    
		console.log(updates);
	    dbInfo = new DBInfo("Meeting", 'bb056238-16c3-4b63-8b8a-9ae759533fe1', updates);
		dynamo = new Dynamo(dbInfo);
		dynamo.updateItem(function(err, returnValue){
		*/	
			status = msg.SUCCESS;
			message = '성공 ~';
			
			console.log('meeting image updae : ' + returnValue);
			
			var data = {Status:status, Message: message};
	    	return cb(err, data);
	    //});
    });
};