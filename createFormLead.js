/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
var https = require('https');

exports.createFormLead = (req, res) => {
  data = JSON.parse(req.body);

  //console.log("incoming data", data.email)
  //createLead(data);
  checkIfExists(data)
  res.status(200).send("Form Submitted");


};


function checkIfExists(data) {
  let d = {
    "method": "getLeads",
    "params":
      { "where": { "emailAddress": data[0].email } },
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
  var obj = {
    "method": "createLeads",
    "params":
    {
      "objects":
        [
          {
            "firstName": `${data[0].name}`, "lastName": `${data[0].last_name}`, "emailAddress": `${data[0].email}`, "mobilePhoneNumber": `${data[0].phone}`, "form_lead_5fab995fa7aed": true
          }
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
  let add_info = null;
  let gen_free = null;
  let appx_start = null;
  let industry = null;
  let need_help=null;
  if (data.length>=5 && data[5] != null && data[5].ADDITIONAL_INFORMATION != null)
    add_info = data[5].ADDITIONAL_INFORMATION
  if (data.length>=4 && data[4] != null && data[4].GENERAL_FREE_15MINUTE_CONSULTATION != null)
    gen_free = data[4].GENERAL_FREE_15MINUTE_CONSULTATION
  if (data.length>=3 && data[3] != null && data[3].APPROXIMATE_START_NAME != null)
    appx_start = data[3].APPROXIMATE_START_NAME
  if (data.length>=2 && data[2] != null && data[2].INDUSTRY != null)
    industry = data[2].INDUSTRY
     if (data.length>=1 && data[1] != null && data[1].NEEDS_HELP_WITH_MULTIPLE != null)
    need_help = data[1].NEEDS_HELP_WITH_MULTIPLE

  var obj = {
    "method": "updateLeads",
    "params":
    {
      "objects":
        [
          {
          "id":`${id}`,
            "firstName": `${data[0].name}`, "lastName": `${data[0].last_name}`, "emailAddress": `${data[0].email}`, "mobilePhoneNumber": `${data[0].phone}`, "form_lead_5fab995fa7aed": true,
            "additional_information_5f85d3f025fc8" :`${add_info}`,
            "needs_help_with_5fac16f8a1be6" :`${need_help}`,
            "general_free_15_minute_consultation_5fac178d7ab2c" :`${gen_free}`,
            "industry_interested_in_5fad4d767804e" :`${industry}`,
            "approximate_start_time_5fb50d9a3f1a6" : `${appx_start}`

          }
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
