var dynode = require('dynode');

var Dynamo = exports.Dynamo = function Dynamo(dbInfo)
{
	this.dbInfo = dbInfo;
	
	this.accessKey = 'AKIAIOJILF4MBA66PNSQ';
	this.secretKey = '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';
	this.isHttps = true;
};

Dynamo.prototype.auth = function()
{
	dynode.auth({https:this.isHttps, accessKeyId: this.accessKey, secretAccessKey: this.secretKey});
};

Dynamo.prototype.getItem = function(cb)
{
	this.auth();
	
	var opts = {AttributesToGet: this.dbInfo.attributesToGet, ConsistentRead : true};

	dynode.getItem(this.dbInfo.tableName, this.dbInfo.primaryKey, opts, function(err, returns){
		//console.log('get item :::::::::::::::::: ' + returns);
		return cb(err, returns);
	});
};

Dynamo.prototype.scan = function(cb)
{
	this.auth();
	
	console.log('limit : ' + this.dbInfo.limit);
	console.log(this.dbInfo.exclusiveStartKey);
	console.log(this.dbInfo.attributesToGet);
	
	var opts = this.getScanOption();
	console.log(opts);
	
	dynode.scan(this.dbInfo.tableName, opts, cb);
};

Dynamo.prototype.putItem = function(cb)
{
	this.auth();
	
	dynode.putItem(this.dbInfo.tableName, this.dbInfo.items, cb);
};

Dynamo.prototype.updateItem = function(cb)
{
	this.auth();
	
	dynode.updateItem(this.dbInfo.tableName, this.dbInfo.primaryKey, this.dbInfo.items, cb);
};

Dynamo.prototype.deleteItem = function(cb)
{
	this.auth();
	
	dynode.deleteItem(this.dbInfo.tableName, this.dbInfo.primaryKey, cb);
};

Dynamo.prototype.query = function(cb)
{
	this.auth();
	
	var opts = {AttributesToGet: this.dbInfo.attributesToGet, ConsistentRead : true};
	
	dynode.query(this.dbInfo.tableName, this.dbInfo.primaryKey, opts, cb);
};

Dynamo.prototype.batchGetItem = function(cb)
{
	this.auth();
	console.log('batch get item : ' + JSON.stringify(this.dbInfo.query));
	dynode.batchGetItem(this.dbInfo.query, cb);
};

Dynamo.prototype.getScanOption = function()
{
	var option = new Object();
	if ('undefined' != typeof this.dbInfo.limit)
	{
		option.Limit = this.dbInfo.limit;
	}
	if ('undefined' != typeof this.dbInfo.attributesToGet)
	{
		option.AttributesToGet = this.dbInfo.attributesToGet;
	}
	if (('undefined' != typeof this.dbInfo.exclusiveStartKey) 
			&& ('start' != this.dbInfo.exclusiveStartKey))
	{
		option.ExclusiveStartKey = {"HashKeyElement":{"S":this.dbInfo.exclusiveStartKey}};
	}
	option.ConsistentRead = true;
	return option;
};