/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
var https = require('https');

exports.createFormLead = (req, res) => {
  data = JSON.parse(req.body);

  //createLead(data);
  checkIfExists(data)
  res.status(200).send("Form Submitted");


};


function checkIfExists(data) {
  let d = {
    "method": "getLeads",
    "params":
      { "where": { "emailAddress": data[2].email } },
    "id": createUUID()
  }
  var obj = JSON.stringify(d);
  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=E634ACFDB0B2CF4B6EBC935F17C69C8D&secretKey=CA4CACE81525CD403B584C590DF02061`,
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
          console.log("len is ", json.result.lead)

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

var project_details=null;
if(data[2].PROJECT_DETAILS!=undefined)
{
project_details=data[2].PROJECT_DETAILS
}
console.log("HEARD_ABOUT_CITYSCAPE_FROM",data[2])
  var obj = {
    "method": "createLeads",
    "params":
    {
      "objects":
        [
          {
             "firstName": `${data[2].name}`, "lastName": `${data[2].last_name}`, "emailAddress": `${data[2].email}`, "mobilePhoneNumber": `${data[2].phone}`,"city":`${data[2].city}`,
            "project_details_5fd9c3cdb4947":`${project_details}`,"heard_about_citysapce_from_5fd9c40ed28a8": `${data[2].HEARD_ABOUT_CITYSCAPE_FROM}`,
            "interior_or_exterior_5fd9c592c8e6e":`${data[0].INTERIOR_OR_EXTERIOR}`,"project_type_5fd9c5b549e3e":`${data[1].PROJECT_TYPE}`,
            "form_lead_5fd9f2abb7a88":true
          }
        ]

    },
    "id": createUUID()
  }



  var data = JSON.stringify(obj);

  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=E634ACFDB0B2CF4B6EBC935F17C69C8D&secretKey=CA4CACE81525CD403B584C590DF02061`,
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


function updateLead(data,id) {

var project_details=null;
if(data[2].PROJECT_DETAILS!=undefined)
{
project_details=data[2].PROJECT_DETAILS
}


  var obj = {
    "method": "updateLeads",
    "params":
    {
      "objects":
        [
          {
          "id":`${id}`,
             "firstName": `${data[2].name}`, "lastName": `${data[2].last_name}`, "emailAddress": `${data[2].email}`, "mobilePhoneNumber": `${data[2].phone}`,"city":`${data[2].city}`,
            "project_details_5fd9c3cdb4947":`${project_details}`,"heard_about_citysapce_from_5fd9c40ed28a8":`${data[2].HEARD_ABOUT_CITYSCAPE_FROM}`,
            "interior_or_exterior_5fd9c592c8e6e":`${data[0].INTERIOR_OR_EXTERIOR}`,"project_type_5fd9c5b549e3e":`${data[1].PROJECT_TYPE}`,
            
  

          }
        ]

    },
    "id": createUUID()
  }



  var data = JSON.stringify(obj);

  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=E634ACFDB0B2CF4B6EBC935F17C69C8D&secretKey=CA4CACE81525CD403B584C590DF02061`,
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
