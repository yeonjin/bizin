
//코드 변경해야 할것. DBInfo 생성할때 tableName만 받거나, 
//attribute는 기능별로 set 하는게 나을수도. 
//DBInfo를.. 상속해서 기능별로 객체 생성하는 것도 생각해야 할것. 
//지금은 primary key 를 object 형태로 받지만,  hash range별로 받아서 관리, 생성해주어야 할것. 

var DBInfo = exports.DBInfo = function DBInfo(tableName, primaryKey, items)
{
	this.tableName = tableName;
	this.primaryKey = primaryKey;
	this.items = items;
	
	//option value
	this.attributesToGet;
	this.limit;
	this.exclusiveStartKey;
	
	//batch item
	this.query;
};

DBInfo.prototype.setAttributesToGet = function(attributesToGet)
{
	this.attributesToGet = attributesToGet;
};

DBInfo.prototype.setPaging = function(limit, exclusiveStartKey)
{
	this.limit = limit;
	this.exclusiveStartKey = exclusiveStartKey;
};

DBInfo.prototype.setQuery = function(query)
{
	this.query = query;
};