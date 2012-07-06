var dynode = require('dynode');

/**
 * 추후 다른 NoSQL등의 확장등 고려해야 할것. 
 */
var Dynamo = exports.Dynamo = function Dynamo()
{
	this.accessKey = 'AKIAIOJILF4MBA66PNSQ';
	this.secretKey = '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';
	this.isHttps = true;
};

Dynamo.prototype.auth = function()
{
	dynode.auth({https:this.isHttps, accessKeyId: this.accessKey, secretAccessKey: this.secretKey});
};

Dynamo.prototype.getItem = function(dbInfo, cb)
{
	var opts = {AttributesToGet: dbInfo.attributesToGet, ConsistentRead : true};

	dynode.getItem(dbInfo.tableName, dbInfo.primaryKey, opts, function(err, returns){
		return cb(err, returns);
	});
};

Dynamo.prototype.scan = function(dbInfo, cb)
{
	console.log('limit : ' + dbInfo.limit);
	console.log(dbInfo.exclusiveStartKey);
	console.log(dbInfo.attributesToGet);
	
	var opts = this.getScanOption(dbInfo);
	console.log(opts);
	
	dynode.scan(dbInfo.tableName, opts, cb);
};

Dynamo.prototype.putItem = function(dbInfo, cb)
{
	dynode.putItem(dbInfo.tableName, dbInfo.items, cb);
};

Dynamo.prototype.updateItem = function(dbInfo, cb)
{
	dynode.updateItem(dbInfo.tableName, dbInfo.primaryKey, dbInfo.items, cb);
};

Dynamo.prototype.deleteItem = function(dbInfo, cb)
{
	dynode.deleteItem(dbInfo.tableName, dbInfo.primaryKey, cb);
};

Dynamo.prototype.query = function(dbInfo, cb)
{
	var opts = {AttributesToGet: dbInfo.attributesToGet, ConsistentRead : true};
	
	dynode.query(dbInfo.tableName, dbInfo.primaryKey, opts, cb);
};

Dynamo.prototype.batchGetItem = function(dbInfo, cb)
{
	console.log('batch get item : ' + JSON.stringify(dbInfo.query));
	dynode.batchGetItem(dbInfo.query, cb);
};

Dynamo.prototype.getScanOption = function(dbInfo)
{
	var option = new Object();
	if ('undefined' != typeof dbInfo.limit)
	{
		option.Limit = dbInfo.limit;
	}
	if ('undefined' != typeof dbInfo.attributesToGet)
	{
		option.AttributesToGet = dbInfo.attributesToGet;
	}
	if (('undefined' != typeof dbInfo.exclusiveStartKey) 
			&& ('start' != dbInfo.exclusiveStartKey))
	{
		option.ExclusiveStartKey = {"HashKeyElement":{"S":dbInfo.exclusiveStartKey}};
	}
	option.ConsistentRead = true;
	return option;
};