var Dynamo = require('../db/dynamo').Dynamo;
var DBInfo = require('../db/dbInfo').DBInfo;
var msg = require('../define/message');

/*
exports.putData = function(cb)
{
	var item = {MeetingId: 'd6873a90-1d02-4223-af2b-087a43df9a2e'
			    , Name: 'beLAUCH 2012 Conference'
			    , MeetingPlace: '양재AT센터'
			    , Description: 'test'
			    , MeetingLocation: '37.468619,127.039011'
			    , ImageUrl: ''
			    , MeetingDates: ['' ,'']
			    , Summary: ''};

	dbInfo = new DBInfo("Checkin", checkinId, item);
	dynamo = new Dynamo(dbInfo);  
	dynamo.putItem(function(err, returnValue){
	
	};
};
*/
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

exports.deleteMeetingDate = function(cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	
    var updates = {MeetingDate: {'Action':'DELETE'}, MeetingDates:['20120610121212,20120710190000']};
    console.log(updates);
    dbInfo = new DBInfo("Meeting", 'woeif378sdkjfhtest', updates);
	dynamo = new Dynamo(dbInfo);
	
	
	dynamo.updateItem(function(err, returnValue){
			
			console.log('meeting image updae : ' + returnValue);
			
			var updates = {MeetingDate: {'Action':'DELETE'}, MeetingDates:['20120610120000,20120610130000']};
		    console.log(updates);
		    dbInfo = new DBInfo("Meeting", 'woeif378sdkjfhtest1', updates);
			dynamo = new Dynamo(dbInfo);
			
			
			dynamo.updateItem(function(err, returnValue){
					status = msg.SUCCESS;
					message = '성공 ~';
					
					console.log('meeting image updae : ' + returnValue);
					
					var data = {Status:status, Message: message};
			    	return cb(err, data);
		    });
    });
};

exports.updateImage = function(cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	
    var updates = {ImageUrl:'com.iceflobe.userpicture/bumziki.gmain.comtemp_1341549933550.jpg'};
    console.log(updates);
    dbInfo = new DBInfo("Checkin", '6febe70d-5099-8e57-9ac5-84441629c5bb', updates);
	dynamo = new Dynamo();
	dynamo.auth();
	
	
	dynamo.updateItem(dbInfo, function(err, returnValue){
			
			console.log('meeting image updae : ' + returnValue);
			
			var updates = {ImageUrl:'com.iceflobe.userpicture/bumziki.gmain.comtemp_1341549933550.jpg'};
		    console.log(updates);
		    dbInfo = new DBInfo("Checkin", '8b8a0ba1-4def-16e6-8135-0ac9ff5f88dd', updates);
			
			dynamo.updateItem(dbInfo, function(err, returnValue){
				console.log('meeting image updae : ' + returnValue);
				
				var updates = {ImageUrl:'com.iceflobe.userpicture/bumziki.gmain.comtemp_1341549933550.jpg'};
			    console.log(updates);
			    dbInfo = new DBInfo("Checkin", 'fb3d4fce-0be4-2133-636a-c8940e943b41', updates);
				
				dynamo.updateItem(dbInfo, function(err, returnValue){
					console.log('meeting image updae : ' + returnValue);
					
					var updates = {ImageUrl:'com.iceflobe.userpicture/bumziki.gmain.comtemp_1341549933550.jpg'};
				    console.log(updates);
				    dbInfo = new DBInfo("Checkin", '9c416569-8f5f-12bc-4187-7b9f7b230a35', updates);
					dynamo = new Dynamo(dbInfo);
					
					
					dynamo.updateItem(function(err, returnValue){
							status = msg.SUCCESS;
							message = '성공 ~';
							
							console.log('meeting image updae : ' + returnValue);
							
							var data = {Status:status, Message: message};
					    	return cb(err, data);
				    });
			    });
		    });
    });
};