/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
var https = require('https');

exports.createFormLead_lenkerSqueeze = (req, res) => {
   data = JSON.parse(req.body);

  console.log("incoming data", data)
  //createLead(data);
  checkIfExists(data)
  res.status(200).send("Form Submitted");


};


function checkIfExists(data) {

  let d = {
    "method": "getLeads",
    "params":
      { "where": { "emailAddress": data.email } },
    "id": createUUID()
  }
  var obj = JSON.stringify(d);
  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=149A868CC00D2D585C6F301B0656C3EA&secretKey=C9D3ED3A8615C0808861A0A40DE86163`,
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Content-Length': obj.length
    }
  }

  var req = https.request(options, function (response) {

    var buffer = '';
    response.on('data', function (chunk) {
      buffer += chunk;
    });

    response.on('end', function () {
      // var json = JSON.parse(buffer);

      try {
        var json = JSON.parse(buffer);
        if (json.errors) {
          var errorMsg = json.errors[0].error;
          var error = new Error(errorMsg);
          console.log("field error 0", error)
          throw error;
        } else {
          console.log("len is ", json.result.lead.length)

          if (json.result.lead.length == 0) {
            createLead(data)
          }
          else {
            console.log("data is ", data)
            updateLead(data,json.result.lead[0].id)
          }

        }
      } catch (error) {
        console.log("field error 2", error)
      }
    });
  });



  req.on('error', function (error) {
    console.log("field error ", error)
  });
  req.write(obj);
  req.end();



}

function createLead(data) {

  var phone="",city="",state="", company ="",zip="", trade ="", last_name="",utm_source=""
  ,utm_medium="",utm_campaign="",source_url="";

  if(data.city!=undefined)
  {
    city = data.city;
  }
  if(data.phone!=undefined)
  {
    phone = data.phone;
  }
  if(data.state!= undefined)
  {
    state = data.state;
  }
  if(data.company_name!=undefined)
  {
    company = data.company_name
  }
  if(data.zip_code!=undefined)
  {
    zip = data.zip_code;
  }

  if(data.Trade!=undefined)
  {
    trade = data.Trade;
  }
  if(data.last_name!=undefined)
  {
    last_name = data.last_name
  }

   if(data.utm_source!=undefined && data.utm_source!=null)
  {
    utm_source = data.utm_source
  }
   if(data.utm_medium!=undefined && data.utm_medium!=null)
  {
    utm_medium = data.utm_medium
  }
   if(data.utm_campaign!=undefined && data.utm_campaign!=null)
  {
    utm_campaign = data.utm_campaign
  }
   if(data.source_url!=undefined && data.source_url!=null)
  {
    source_url = data.source_url
  }



  var obj = {
    "method": "createLeads",
    "params":
    {
      "objects":
        [
          {
             "firstName": `${data.name}`, "lastName": `${last_name}`, "emailAddress": `${data.email}`, "mobilePhoneNumber": `${phone}`,
 "city":`${city}`, "state" :`${state}`, "companyName": `${company}`,
 "zipcode": `${zip}`, "trade_in_602510522753e": `${trade}`, "squeeze_form_60252695648e8":true} 
        ]

    },
    "id": createUUID()
  }



  var data = JSON.stringify(obj);

  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=149A868CC00D2D585C6F301B0656C3EA&secretKey=C9D3ED3A8615C0808861A0A40DE86163`,
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  var req = https.request(options, function (response) {

    var buffer = '';
    response.on('data', function (chunk) {
      buffer += chunk;
    });

    response.on('end', function () {
      // var json = JSON.parse(buffer);

      try {
        var json = JSON.parse(buffer);
       // var data = json.contact;
        if (json.errors) {
          var errorMsg = json.errors[0].error;
          var error = new Error(errorMsg);
          console.log("field error 0", error)
          throw error;
        } else {
          console.log("success")
        }
      } catch (error) {
        console.log("field error 2", error)
      }
    });
  });



  req.on('error', function (error) {
    console.log("field error ", error)
  });
  req.write(data);
  req.end();
}


function updateLead(data,id) {

 var phone="",city="",state="", company ="",zip="", trade ="", last_name="",utm_source=""
  ,utm_medium="",utm_campaign="",source_url="";

  if(data.city!=undefined)
  {
    city = data.city;
  }
  if(data.phone!=undefined)
  {
    phone = data.phone;
  }
  if(data.state!= undefined)
  {
    state = data.state;
  }
  if(data.company_name!=undefined)
  {
    company = data.company_name
  }
  if(data.zip_code!=undefined)
  {
    zip = data.zip_code;
  }

  if(data.Trade!=undefined)
  {
    trade = data.Trade;
  }

  if(data.last_name!=undefined)
  {
    last_name = data.last_name
  }

 if(data.utm_source!=undefined && data.utm_source!=null)
  {
    utm_source = data.utm_source
  }
   if(data.utm_medium!=undefined && data.utm_medium!=null)
  {
    utm_medium = data.utm_medium
  }
   if(data.utm_campaign!=undefined && data.utm_campaign!=null)
  {
    utm_campaign = data.utm_campaign
  }
   if(data.source_url!=undefined && data.source_url!=null)
  {
    source_url = data.source_url
  }


  var obj = {
    "method": "updateLeads",
    "params":
    {
      "objects":
        [
          {
          "id":`${id}`,
              "firstName": `${data.name}`, "lastName": `${last_name}`, "emailAddress": `${data.email}`, "mobilePhoneNumber": `${phone}`,
 "city":`${city}`, "state" :`${state}`, "companyName": `${company}`,
 "zipcode": `${zip}`, "trade_in_602510522753e": `${trade}`, "squeeze_form_60252695648e8":true}

          
        ]

    },
    "id": createUUID()
  }



  var data = JSON.stringify(obj);

  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=149A868CC00D2D585C6F301B0656C3EA&secretKey=C9D3ED3A8615C0808861A0A40DE86163`,
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  var req = https.request(options, function (response) {

    var buffer = '';
    response.on('data', function (chunk) {
      buffer += chunk;
    });

    response.on('end', function () {
      // var json = JSON.parse(buffer);

      try {
        var json = JSON.parse(buffer);
        var data = json.contact;
        if (json.errors) {
          var errorMsg = json.errors[0].error;
          var error = new Error(errorMsg);
          console.log("field error 0", error)
          throw error;
        } else {
          console.log("success")
        }
      } catch (error) {
        console.log("field error 2", error)
      }
    });
  });



  req.on('error', function (error) {
    console.log("field error ", error)
  });
  req.write(data);
  req.end();
}


// function updateLead(data)
// {
// }

function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
