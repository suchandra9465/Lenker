var airtable = require('airtable');
var https = require('https');
var HelperFunctions = require('./HelperFunctions.js');

class Airtable extends HelperFunctions {
  constructor(credentials){
    super();
    this.airtable = require('airtable');
    airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: credentials.apiKey
    });
    this.base = airtable.base(credentials.baseID);

    this.cachedRecords = [];
  }
  fetchAllRecords(table, callback){
    var that = this;
    var json = [];
    this.base(table).select().eachPage(function page(records, fetchNextPage){
      records.forEach(function(record){
        json.push(record.fields);
      });

      fetchNextPage();
    }, function done(error){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
      } else {
        var data = json;
        if(callback && typeof callback === 'function') callback(null, data);
      }
    });
  }

  cacheRecords(table, callback){
    var that = this;

    this.fetchAllRecords('Quotes', function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
      } else {
        that.cachedRecords = data;
        if(callback && typeof callback === 'function') callback(null, data);
      }
    });
  }

  checkForNewRecords(table, field, callback){ //field to check by
    var that = this;

    this.fetchAllRecords(table, function(error, data){
  		if(error){
  			if(callback && typeof callback === 'function') callback(error);
  			return;
  		}
      var allRecords = data;
      var newRecords = [];

      allRecords.forEach(function(record){
        var isNewRecord = true;
        that.cachedRecords.forEach(function(cachedRecord){
          if(typeof record[field] != 'undefined'){
            if( !record[field].localeCompare(cachedRecord[field]) ) isNewRecord = false;
          }
        });
        if(isNewRecord) newRecords.push(record);
      });

      that.cachedRecords = allRecords;

      data = newRecords;
      if(callback && typeof callback === 'function') callback(null, data);
    });
  }
}

module.exports = Airtable;
