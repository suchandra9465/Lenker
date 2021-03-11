var OAuthClient = require('intuit-oauth');
var https = require('https');
var HelperFunctions = require('./HelperFunctions.js');

class QuickBooks extends HelperFunctions {
  constructor(credentials){
    super();
    this.hostname = credentials.hostname;
    this.clientID = credentials.clientID;
    this.clientSecret = credentials.clientSecret;
    this.environment = credentials.environment;
    this.redirectUri = credentials.redirectUri;
    this.companyID = credentials.companyID;
    this.accessToken;

    this.oauthClient = new OAuthClient({
    	clientId: this.clientID,
    	clientSecret: this.clientSecret,
    	environment: this.environment,
    	redirectUri: this.redirectUri
    });
  }

  authorizationUri(){
    return this.oauthClient.authorizeUri({
    	scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId],
    	state: 'testState'
    });
  }

  createToken(parseRedirect, callback){
    var that = this;

    this.oauthClient.createToken(parseRedirect)
  	.then(function(authResponse){
  		authResponse = authResponse.getJson();
  		that.accessToken = authResponse.access_token;

      var data = {
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token
      }

      if(callback && typeof callback === 'function') callback(null, data);
  	})
  	.catch(function(error){
  		if(callback && typeof callback === 'function') callback(error);
  	});
  }

  refreshToken(callback){
    var that = this;

    this.oauthClient.refresh()
  	.then(function(authResponse){
  		authResponse = authResponse.getJson();
  		that.accessToken = authResponse.access_token;

      var data = {
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token
      }

      if(callback && typeof callback === 'function') callback(null, data);
  	})
  	.catch(function(error){
  		if(callback && typeof callback === 'function') callback(error);
  	});
  }

  getCustomer(id, callback){
    var options = {
      hostname: this.hostname,
      path: '/v3/company/' + this.companyID + '/customer/' + id + '?minorversion=51',
      Accept: 'application/json',
      "Content-type": "application/json",
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
        "Content-type": "application/json"
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var data = buffer;
        //var json = JSON.parse(buffer);
        //var data = json;
        
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  createCustomer(customer, callback){
    var that = this;

    var json = customer;
    var data = JSON.stringify(json);

    var options = {
      hostname: this.hostname,
      path: '/v3/company/' + this.companyID + '/customer?minorversion=51',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      }
    }

    var req = https.request(options, function(res){
      var buffer = '';

      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(){
        var data = buffer;
        //var json = JSON.parse(buffer);
        //var data = json;

        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
    req.write(data);
    req.end();
  }
}

module.exports = QuickBooks;
