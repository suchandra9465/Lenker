/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 var https = require('https');
exports.callRailCallReceived = (req, res) => {
 var data = req.body; //the call data
	console.log(data);
	console.log('call received');

  

	let number = data["customer_phone_number"]; //caller's number

  let landing_page_url=""
  if(data["landing_page_url"]!=undefined)
  {
  landing_page_url = data["landing_page_url"]
  }


	let data1 = {
		"firstName": "", "lastName": "", "mobilePhoneNumber": number, "emailAddress": generateFakemail(number),
    "landing_page_url" : landing_page_url
	}

createLead(data1)
res.status(200).send("success");
  
};

function createLead(data) {

  var obj = {
    "method": "createLeads",
    "params":
    {
      "objects":
        [
        {"firstName":`${data.firstName}`,"lastName":`${data.lastName}`,"emailAddress":`${data.emailAddress}`,"mobilePhoneNumber":`${data.mobilePhoneNumber}`,
        "call_lead_5fa2dd1770d68" :true,"_initial_call_source_5f83929852c95":`${data.landing_page_url}`
          }
        ]

    },
    "id": createUUID()
  }

  



  var data = JSON.stringify(obj);
  console.log("log is 3");

  var options = {
    hostname: 'api.sharpspring.com',
    path: `/pubapi/v1/?accountID=149A868CC00D2D585C6F301B0656C3EA&secretKey=C9D3ED3A8615C0808861A0A40DE86163`,
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  	console.log("here 0 "+options);

  var req = https.request(options, function (response) {

    var buffer = '';
    response.on('data', function (chunk) {
      buffer += chunk;
    });

    response.on('end', function () {
      // var json = JSON.parse(buffer);
	console.log("here 0 "+buffer);
      try {
        var json = JSON.parse(buffer);
        
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

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }

 
function generateFakemail(number){
  	var x = number;
  	x = x.substr(1);
  	x = x + "@Fakemail.com";
  	return x;
  }