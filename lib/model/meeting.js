var Dynamo = require('../db/dynamo').Dynamo;
var DBInfo = require('../db/dbInfo').DBInfo;
var msg = require('../define/message');
var async = require('async');

exports.getList = function(limit, exclusiveStartKey, cb)
{
	dbInfo = new DBInfo("Meeting", null, null);
	dbInfo.setPaging(limit, exclusiveStartKey);
	dbInfo.setAttributesToGet(["MeetingId"
							    ,"Name"
							    ,"Summary"
							    ,"MeetingDates"
							    ,"MeetingPlace"
							    ,"ImageUrl"]);
	
	dynamo = new Dynamo(dbInfo);  
	dynamo.scan(cb);
};

exports.getMeeting = function(meetingId, cb)
{
	dbInfo = new DBInfo("Meeting", meetingId, null);
	dynamo = new Dynamo(dbInfo);  
	dynamo.getItem(function(err, resultValue){
		
		console.log(resultValue.CheckinInfo);
		var checkinIds = resultValue.CheckinInfo;
		var len = 0;
		if ('undefined' != typeof checkinIds) len = checkinIds.length;  
		console.log(len);
		
		
		if (len > 0)
		{
			var functions = new Array();
			for (var i = 0 ; i < len; i++)
			{
				var id = checkinIds[i];
				functions.push(function (callback){
					var dbInfo = new DBInfo("Checkin", id, null);
					dbInfo.setAttributesToGet(["UserId", "ImageUrl"]);
					var dynamo = new Dynamo(dbInfo);
					dynamo.getItem(callback);
				});
			}
			
			async.parallel(functions, function(error, results){
				console.log(results);
				resultValue.CheckinUsers = results;
				
				delete resultValue.CheckinInfo;
				
				return cb(err, resultValue);
			});	
		}
		else
		{
			return cb(err, resultValue);
		}
		
	});
};

exports.checkin = function(meetingId, userId, cb)
{
	var status = msg.FAIL;
	var message = msg.FAIL_SYS_ERR;
	
	var dbInfo = new DBInfo("User", userId, null);
	var dynamo = new Dynamo(dbInfo);
	dynamo.getItem(function(err, returnValue){
		console.log('user get item : ' + JSON.stringify(returnValue));
		
		var imageUrl = returnValue.ImageUrl; //여기서 returlValue가 null이면 error 나면서 죽음. 암튼 exception처리는 잘 해야 할것.  
		console.log('imageUrl : ' + imageUrl);
		
		var now = new Date();
		var checkinDateTime = dateFormat(now, 'yyyyMMddHHmmss');
		var checkinId = guidGenerator();
		var item = {CheckinId: checkinId
				    , MeetingId: meetingId
				    , UserId: userId
				    , CheckinDateTime: checkinDateTime
				    , ImageUrl: imageUrl};
		
		dbInfo = new DBInfo("Checkin", checkinId, item);
		dynamo = new Dynamo(dbInfo);  
		dynamo.putItem(function(err, returnValue){
	        
			console.log('checkin put body : ' + returnValue);
	    	
	        var updates = {CheckinInfo: {'add':[checkinId]}};
	        console.log(updates);
	        dbInfo = new DBInfo("Meeting", meetingId, updates);
	    	dynamo = new Dynamo(dbInfo);  
	    	
	    	dynamo.updateItem(function(err, returnValue){
	    		console.log('updateitem meeting body : ' + returnValue);
	    		
	    		dbInfo = new DBInfo("User", userId, updates);
	        	dynamo = new Dynamo(dbInfo);  
	        	dynamo.updateItem(function(err, returnValue){
	        		console.log('updateitem user body : ' + returnValue);
	        		
	        		status = msg.SUCCESS;
	        		message = '성공 ~';
	        		
	        		var data = {Status:status, Message: message};
	            	return cb(err, data);
	        	});
	    	});
	    });
	});
};

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * 
 * @param date Date object 
 * @param format yyyyMMddhh...
 * @returns
 */
function dateFormat(date, format)
{
	if (!this.valueOf()) return " ";
	 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    //var date = this;
     
    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return date.getFullYear();
            case "yy": return zeroFormat(date.getFullYear() % 1000, 2);
            case "MM": return zeroFormat(date.getMonth() + 1, 2);
            case "dd": return zeroFormat(date.getDate(), 2);
            case "E": return weekName[date.getDay()];
            case "HH": return zeroFormat(date.getHours(), 2);
            case "hh": return zeroFormat(((h = date.getHours() % 12) ? h : 12), 2);
            case "mm": return zeroFormat(date.getMinutes(), 2);
            case "ss": return zeroFormat(date.getSeconds(), 2);
            case "a/p": return date.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
}

/**
 * len 길이 만큼 str앞에 0 삽입. 
 * @param str 
 * @param len 
 * @returns
 */
function zeroFormat(str, len){
	if ('number' == typeof str){
		str = str.toString();
	}
	return insertZero("0", len - str.length) + str;
};

function insertZero(str, len){
	var s = '', i = 0; 
	while (i++ < len) {
		s += str; 
	} 
	return s;
};
