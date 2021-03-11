var https = require('https');
var HelperFunctions = require('./HelperFunctions.js');

class ActiveCampaign extends HelperFunctions {
  constructor(credentials){
    super();
    this.hostname = credentials.hostname;
    this.apiToken = credentials.apiToken;

    this.fields = {};
    this.tags = {};
    this.users = {}; //by first name

    this.refresh();
  }

  refresh(callback){
    var that = this;

    var loaded = {
      customFields: false,
      tags: false,
      users: false
    }

    function hasLoaded(){
      var hasItLoaded = true;
      for(var key in loaded){
        if(!loaded[key]) hasItLoaded = false;
      }
      return hasItLoaded;
    }

    this.listAllCustomFields(function(error, data){
    	if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

    	data.forEach(function(d){
    		that.fields[d.title] = d.id;
    	});
      loaded['customFields'] = true;

      if(hasLoaded() && callback && typeof callback === 'function') callback(error);
    });

    this.listAllTags(function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

    	data.forEach(function(d){
    		that.tags[d.tag] = d.id;
    	});
      loaded['tags'] = true;

      if(hasLoaded() && callback && typeof callback === 'function') callback(error);
    });

    this.listAllUsers(function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

    	data.forEach(function(d){
    		that.users[d.firstName] = d.id;
    	});
      loaded['users'] = true;

      if(hasLoaded() && callback && typeof callback === 'function') callback(error);
    });
  }

  listAllContactsLimited(limit, offset, callback){ //does not paginate through all pages
    var options = {
      hostname: this.hostname,
      path: '/api/3/contacts?orders[cdate]=DESC&limit=' + limit + '&offset=' + offset,
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = json;
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  listAllContacts(max, callback){ //loops through all pages unless the max paramater is defined
    var allContacts = [];
    var limit = 100;
    var offset = 0;
    var total;
    var max = max;
    var that = this;

    function paginate(){
      if(typeof max == 'number' && offset >= max || typeof total != undefined && offset >= total){
        var data = allContacts;
        if(callback && typeof callback === 'function') callback(null, data);
        return;
      }

      that.listAllContactsLimited(limit, offset, function(error, data){
        if(error){
          if(callback && typeof callback === 'function') callback(error);
          return;
        }

        total = parseInt(data.meta.total);

        data.contacts.forEach(function(contact){
          allContacts.push(contact);
        });

        offset += limit;
        paginate();
      });
    }
    paginate();
  }

  listAllTags(callback){
    var options = {
      hostname: this.hostname,
      path: '/api/3/tags?limit=100',
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = json.tags;
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  listAllCustomFields(callback){
    var options = {
      hostname: this.hostname,
      path: '/api/3/fields?limit=100',
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';

      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = json.fields;
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  listAllUsers(callback){
    var options = {
      hostname: this.hostname,
      path: '/api/3/users?limit=100',
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = json.users;
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  listContactTags(email, callback){
    var that = this;

    this.findContact(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      var options = {
        hostname: that.hostname,
        path: '/api/3/contacts/' + contactID + '/contactTags',
        headers: {
          'Api-Token': that.apiToken
        }
      }

      var req = https.get(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          var data = [];
          var json = JSON.parse(buffer);
          var tags = json.contactTags;
          tags.forEach(function(tag){
            var t = that.getKeyByValue(that.tags, tag.tag);
            data.push(t);
          });

          if(callback && typeof callback === 'function') callback(null, data);
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
    });
  }

  listContactDeals(email, callback){
    var that = this;

    this.findContact(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      var options = {
        hostname: that.hostname,
        path: '/api/3/contacts/' + contactID,
        headers: {
          'Api-Token': that.apiToken
        }
      }

      var req = https.get(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          try {
            var json = JSON.parse(buffer);

            var data = {
              contactID: contactID,
              deals: json.deals
            }

            if(callback && typeof callback === 'function') callback(null, data);
          } catch(error){
            if(callback && typeof callback === 'function') callback(error);
          }
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
    });
  }

  listContactCustomFields(email, callback){
    var that = this;

    this.findContact(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      var options = {
        hostname: that.hostname,
        path: '/api/3/contacts/' + contactID + '/fieldValues?limit=100',
        headers: {
          'Api-Token': that.apiToken
        }
      }

      var req = https.get(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          var data = {};
          var json = JSON.parse(buffer);
          var fields = json.fieldValues;
          fields.forEach(function(field){
            var key = that.getKeyByValue(that.fields, field.field); //getting the name of the field from its id
            var value = field.value;
            data[key] = value;
          });

          if(callback && typeof callback === 'function') callback(null, data);
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
    });
  }

  searchContacts(searchValue, callback){
    searchValue = encodeURI(searchValue);

    var options = {
      hostname: this.hostname,
      path: '/api/3/contacts/?search=' + searchValue,
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = [];
        if(json.contacts.length>0) data = json.contacts;
        if(callback && typeof callback === 'function') callback(null, data);
        //var error = new Error('No contact found');
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  findContact(email, callback){
    email = encodeURI(email);

    var options = {
      hostname: this.hostname,
      path: '/api/3/contacts/?email=' + email,
      headers: {
        'Api-Token': this.apiToken
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);

        if(json.contacts.length>0){
          var data = json.contacts[0];
          if(callback && typeof callback === 'function') callback(null, data);
        } else {
          var error = new Error('No contact found');
          if(callback && typeof callback === 'function') callback(error);
        }
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }

  updateCustomField(contactID, field, value, callback){
    var data = JSON.stringify({
      "fieldValue": {
        "contact": contactID,
        "field": this.fields[field],
        "value": value
      }
    });

    var options = {
      hostname: this.hostname,
      path: '/api/3/fieldValues',
      method: 'POST',
      headers: {
        'Api-Token': this.apiToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }

    var req = https.request(options, function(res){
      var buffer = '';

      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(){
        var json = JSON.parse(buffer);
        var data = json;

        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
    req.write(data);
    req.end();
  }

  addTag(contactID, tag, callback){
    var data = JSON.stringify({
      "contactTag": {
        "contact": contactID,
        "tag": this.tags[tag]
      }
    });

    var options = {
      hostname: this.hostname,
      path: '/api/3/contactTags',
      method: 'POST',
      headers: {
        'Api-Token': this.apiToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }

    var req = https.request(options, function(res){
      var buffer = '';

      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(){
        var json = JSON.parse(buffer);
        var data = json;

        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
    req.write(data);
    req.end();
  }

  deleteContact(email, callback){
    var that = this;

    this.findContact(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      var options = {
        hostname: that.hostname,
        path: '/api/3/contacts/' + contactID,
        method: 'DELETE',
        headers: {
          'Api-Token': that.apiToken
        }
      }

      var req = https.request(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          var json = JSON.parse(buffer);
          var data = json;

          if(callback && typeof callback === 'function') callback(null, data);
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
      req.end();
    });
  }

  createContact(email, fields, callback){
    var json = {
      "contact": {
        "email": email
      }
    }
    for(var key in fields){
      json["contact"][key] = fields[key];
    }
    var data = JSON.stringify(json);

    var options = {
      hostname: this.hostname,
      path: '/api/3/contact/sync',
      method: 'POST',
      headers: {
        'Api-Token': this.apiToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }

    var req = https.request(options, function(res){
      var buffer = '';

      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(){
        try {
          var json = JSON.parse(buffer);
          var data = json.contact;
          if(json.errors){
            var errorMsg = json.errors[0].error;
            var error = new Error(errorMsg);
            throw error;
          } else {
            if(callback && typeof callback === 'function') callback(null, data);
          }
        } catch(error){
          if(callback && typeof callback === 'function') callback(error);
        }
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
    req.write(data);
    req.end();
  }

  createOrUpdateContact(email, fields, customFields, tags, callback){
    var that = this;

    this.createContact(email, fields, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      if(customFields && typeof customFields === 'object'){
        for(const [key, value] of Object.entries(customFields)){
          that.updateCustomField(contactID, key, value);
        }
      }

      if(tags && typeof tags === 'object'){
        tags.forEach(function(tag){
          that.addTag(contactID, tag);
        });
      }

      if(callback && typeof callback === 'function') callback(null, data);
    });
  }

  createDeal(email, owner, fields, callback){
    var that = this;

    this.findContact(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.id;

      var json = {
        "deal": {
          "contact": contactID,
          "owner": that.users[owner],
          "value": 0,
          "currency": "usd",
          "stage": "1"
        }
      }
      for(var key in fields){
        json["deal"][key] = fields[key];
      }
      var data = JSON.stringify(json);

      var options = {
        hostname: that.hostname,
        path: '/api/3/deals',
        method: 'POST',
        headers: {
          'Api-Token': that.apiToken,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      }

      var req = https.request(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          var json = JSON.parse(buffer);
          var data = json;

          if(callback && typeof callback === 'function') callback(null, data);
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
      req.write(data);
      req.end();
    });
  }

  updateDeal(email, fields, callback){
    var that = this;

    this.listContactDeals(email, function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var contactID = data.contactID;
      var deal = data['deals'][0];
      var dealID = deal.id;

      var json = {
        "deal": {
          "contact": contactID,
          "title": deal.title,
          "owner": deal.owner,
          "value": deal.value,
          "currency": deal.currency,
          "stage": deal.stage
        }
      }

      for(var key in fields){
        if(key=="owner"){
          json["deal"][key] = that.users[ fields[key] ]; //get the user id from their name
        } else {
          json["deal"][key] = fields[key];
        }
      }
      var data = JSON.stringify(json);

      var options = {
        hostname: that.hostname,
        path: '/api/3/deals/' + dealID,
        method: 'PUT',
        headers: {
          'Api-Token': that.apiToken,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      }

      var req = https.request(options, function(res){
        var buffer = '';

        res.on('data', function(chunk){
          buffer += chunk;
        });

        res.on('end', function(){
          try {
            var json = JSON.parse(buffer);
            var data = json;
            if(callback && typeof callback === 'function') callback(null, data);
          } catch(error){
            if(callback && typeof callback === 'function') callback(error);
          }
        });
      });

      req.on('error', function(error){
        if(callback && typeof callback === 'function') callback(error);
      });
      req.write(data);
      req.end();
    });
  }
}

module.exports = ActiveCampaign;
