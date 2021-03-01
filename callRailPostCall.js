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

exports.callRailPostCall = (req, res) => {
 var data = req.body; //the call data
 console.log('call received');
	console.log(data);

  if(data["recording"]!=undefined && data["recording"]!=null)
  {
	

	let number = data["customer_phone_number"]; //caller's number


checkIfExists(data,generateFakemail(number))
}
res.status(200).send("success");
  
};

 
function generateFakemail(number){
  	var x = number;
  	x = x.substr(1);
  	x = x + "@Fakemail.com";
  	return x;
  }

function checkIfExists(data,email) {
  let d = {
    "method": "getLeads",
    "params":
      { "where": { "emailAddress":email } },
    "id": createUUID()
  }


  var obj = JSON.stringify(d);
  console.log('call received 2 ',obj);
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
 console.log('call received request ');
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
            console.log('call received 4 ',json);
          if (json.result.lead.length != 0) {
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

function updateLead(data,id) {

  var obj = {
    "method": "updateLeads",
    "params":
    {
      "objects":
        [
          {
          "id": `${id}`,
            "call_recording_5fb4e6a551255": `${data["recording"]}`

          }
        ]

    },
    "id": createUUID()
  }



  var data = JSON.stringify(obj);
console.log("call received",data)
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
