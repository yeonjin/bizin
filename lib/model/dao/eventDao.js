var Dynamo = require('../../db/dynamo').Dynamo;
var DBInfo = require('../../db/dbInfo').DBInfo;
var msg = require('../../define/message');
var async = require('async');

EventDao = exports.EventDao = function EventDao()
{
	this.m_dynamo = new Dynamo();
	
	this.m_dynamo.auth();	
};

EventDao.prototype.getMeetings = function (attributes, limit, exclusiveStartKey, cb)
{
	var dbInfo = new DBInfo("Meeting", null, null);
	dbInfo.setPaging(limit, exclusiveStartKey);
	if (null != attributes)
	{
		dbInfo.setAttributesToGet(attributes);	
	}
	
	this.m_dynamo.scan(dbInfo, cb);
};

EventDao.prototype.getMeeting = function (meetingId, cb)
{
	dbInfo = new DBInfo("Meeting", meetingId, null);
	this.m_dynamo.getItem(dbInfo, cb);
};

EventDao.prototype.getCheckins = function (checkinId, attributes, cb)
{
	dbInfo = new DBInfo("Checkin", checkinId, null);
	if (null != attributes)
	{
		dbInfo.setAttributesToGet(attributes);	
	}
	this.m_dynamo.getItem(dbInfo, cb);
};

EventDao.prototype.getUser = function (userId, attributes, cb)
{
	var dbInfo = new DBInfo("User", userId, null);
	if (null != attributes)
	{
		dbInfo.setAttributesToGet(attributes);	
	}
	
	this.m_dynamo.getItem(dbInfo, cb);
};

EventDao.prototype.getCollars = function(userId, attributes, cb)
{
	var dbInfo = new DBInfo("Collar", userId, null);
	if (null != attributes)
	{
		dbInfo.setAttributesToGet(attributes);	
	}
	
	this.m_dynamo.query(dbInfo, function(err, returnValue){
		var items = new Array();
		if (null != returnValue)
		{
			items = returnValue.Items;
		}
		return cb(err, items);
	});
};

EventDao.prototype.getCollar = function(userId, connectionUserId, cb)
{
	var dbInfo = new DBInfo("Collar", {hash: userId, range: connectionUserId}, null);
	this.m_dynamo.getItem(dbInfo, cb);
};

EventDao.prototype.getConnection = function(userId, connectionId, cb)
{
	var dbInfo = new DBInfo("Connection", {hash: userId, range: connectionId}, null);
	this.m_dynamo.getItem(dbInfo, cb);
};

EventDao.prototype.getImages = function(userId, attributes, cb)
{
	var dbInfo = new DBInfo("Image", userId, null);
	if (null != attributes)
	{
		dbInfo.setAttributesToGet(attributes);	
	}
	
	this.m_dynamo.query(dbInfo, function(err, returnValue){
		var items = new Array();
		if (null != returnValue)
		{
			items = returnValue.Items;
		}
		return cb(err, items);
	});
};

EventDao.prototype.insertConnection = function(objConnection, cb)
{
	var dbInfo = new DBInfo("Connection", null, objConnection);
	
	this.m_dynamo.putItem(dbInfo, cb);
};

EventDao.prototype.insertCheckin = function(objCheckin, cb)
{
	var dbInfo = new DBInfo("Checkin", null, objCheckin);
	
	this.m_dynamo.putItem(dbInfo, cb);
};

EventDao.prototype.updateMeetingWithCheckinInfo = function(meetingId, checkinId, cb)
{
	var updates = {CheckinInfo: {'add':[checkinId]}};
    console.log(updates);
    var dbInfo = new DBInfo("Meeting", meetingId, updates);
	
	this.m_dynamo.updateItem(dbInfo, cb);
};

EventDao.prototype.updateUserWithCheckinInfo = function(userId, checkinId, cb)
{
	var updates = {CheckinInfo: {'add':[checkinId]}};
    console.log(updates);
    var dbInfo = new DBInfo("User", userId, updates);
	
	this.m_dynamo.updateItem(dbInfo, cb);
};

EventDao.prototype.addCollarConnection = function(connectionId, userId, connectionUserId, cb)
{
	var updates = {ConnectionInfo: {'add':[connectionId]}, ConnectionCount: {'add':1}};
    console.log('updates : ' + JSON.stringify(updates));
    console.log('user id :' + userId);
    console.log('connection user id :' + connectionUserId);
    var dbInfo = new DBInfo("Collar", {hash: userId, range: connectionUserId}, updates);
	
	this.m_dynamo.updateItem(dbInfo, cb);
};

EventDao.prototype.insertPhotoInfo = function(objPhotoInfo, cb)
{
	var dbInfo = new DBInfo("Image", null, objPhotoInfo);
	
	this.m_dynamo.putItem(dbInfo, cb);
};

EventDao.prototype.addUserImageId = function(userId, imageId, imageLocation, cb)
{
	var updates = {ImageId: {'add':[imageId]}};
    
    if (null != imageLocation)
    {
    	updates.ImageUrl = {'put':imageLocation};
    }
    
    console.log(updates);
    
    var dbInfo = new DBInfo("User", userId, updates);
	
	this.m_dynamo.updateItem(dbInfo, cb);
};

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
