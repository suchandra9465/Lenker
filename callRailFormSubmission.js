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

exports.callRailFormSubmission = (req, res) => {
var data = req.body; //form data

	console.log('form submitted',data.form_data);

	let emailField = 'email@website.com'; //the name of the email field in the form
	let email = data.form_data[emailField];
  	console.log(email);
	/* The webhook only sends the form data and limited attributions
	so we're gonna set a delay then search the form submission with
	the email value, and that will give all the attributions data we need */

	setTimeout(function () {
		//P.S. Adding a timeout since It only finds the form submission after a slight delay
		findFormSubmissions(email, emailField, function (error, data) {
			if (error) {
				console.log(error);
				return;
			}
console.log("here",data.length);
			if (data.length == 0) return;

			checkIfExists(data,email)
			//update the attribution fields
			// activeCampaign.createOrUpdateContact(email,
			// 	{},
			// 	{
			// 		'UTM - Source': data[0]['source'],
			// 		'UTM - Medium': data[0]['medium'],
			// 		'UTM - Campaign': data[0]['campaign']
			// 	}
			//);
		});
	}, 4000);
  res.status(200).send("Form Submitted");


};

function  findFormSubmissions(email, emailField, callback){
    listAllFormSubmissions(function(error, data){
      if(error){
        if(callback && typeof callback === 'function') callback(error);
        return;
      }

      var foundContacts = [];

      for(var i=0; i<data.length; i++){
        var formEmail = data[i].form_data[emailField];

        if( typeof formEmail == 'string' && formEmail.localeCompare(email)==0 ){
          foundContacts.push(data[i]);
        }
      }

      data = foundContacts;
      if(callback && typeof callback === 'function') callback(null, data);
    });
  }

function  listAllFormSubmissions(callback){
    var options = {
      hostname: 'api.callrail.com',
      path: '/v3/a/274952542/form_submissions.json',
      headers: {
        Authorization: 'Token token=9762b18bff950501f66b6567b1678a66'
      }
    }

    var req = https.get(options, function(res){
      var buffer = '';
      res.on('data', function(chunk){
        buffer += chunk;
      });

      res.on('end', function(err){
        var json = JSON.parse(buffer);
        var data = json.form_submissions;
        if(callback && typeof callback === 'function') callback(null, data);
      });
    });

    req.on('error', function(error){
      if(callback && typeof callback === 'function') callback(error);
    });
  }


function checkIfExists(data,email) {
  let d = {
    "method": "getLeads",
    "params":
      { "where": { "emailAddress":email } },
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

          if (json.result.lead.length != 0) {
         //   console.log("data is ", data)
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


console.log("form values ",data[0])

  var utm_source="", utm_medium="", utm_campaign="", source_url=""

  if(data[0]['source']!=null && (data[0]['source']!=undefined))
  {
   utm_source = data[0]['source'];
  }
  if(data[0]['medium']!=null && (data[0]['medium']!=undefined))
  {
   utm_medium = data[0]['medium'];
  }
  if(data[0]['campaign']!=null && (data[0]['campaign']!=undefined))
  {
   utm_campaign = data[0]['campaign'];
  }
  if(data[0]['form_url']!=null && (data[0]['form_url']!=undefined))
  {
   source_url = data[0]['form_url'];
  }


  var obj = {
    "method": "updateLeads",
    "params":
    {
      "objects":
        [
          {
          "id": `${id}`,
            "_utm___source_5f8392984a387": `${utm_source}`,
            "_utm___medium_5f8392984d512":`${utm_medium}`,
            "_utm___campaign_5f839298501f1":`${utm_campaign}`,
            "_initial_call_source_5f83929852c95": `${source_url}`
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
        //var data = json.contact;
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
