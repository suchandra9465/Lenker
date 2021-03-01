/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.concreteScienceFl_CallRailCallReceived = (req, res) => {
  var data = req.body; //the call data
	console.log(data);


	let number = data["customer_phone_number"]; //caller's number

	console.log('call received ',number);

	checkIfExists(data)

  res.status(200).send("success");
};



function checkIfExists(data) {
  var options = {
    hostname: process.env.SERVICETITAN_URL,
    path: `/v1/bookings/external/${data["customer_phone_number"]}`,
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
      'x-http-servicetitan-api-key' : process.env.SERVICETITAN_API_KEY
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
       console.log("statusCode: ", response.statusCode); 
       console.log("field error 0", buffer)
       if(response.statusCode!=200)
       {      
            createLead(data)
  
        }
        else{
         var json = JSON.parse(buffer);
        if (json.errors) {
          var errorMsg = json.errors[0].error;
          var error = new Error(errorMsg);
          console.log("field error 0", error)
          throw error;
        }
         console.log("data is ", json)

           updateLead(data,json.data.externalId)
          
           
            }
      } catch (error) {
        console.log("field error 2", error)
      }
    });
  });



  req.on('error', function (error) {
    console.log("field error ", error)
  });
  req.end();

}


function createLead(data) {
   let d = {
  "customerType": "Commercial",
  "externalId": `${data.customer_phone_number}`,
  "customer": `${data.customer_name}`,
   "address": {
    "state": `${data.customer_state}`,
    "city": `${data.customer_city}`
  },
  "summary": `Recording ${data.recording}` ,
 "contacts": [
       { "id": "0",
      "type": "Phone",
      "value": `${data.customer_phone_number}`,
      "memo": "string"
      }
      ],
       "isFirstTimeClient": true,
       "isSendConfirmationEmail" :false,
        "businessUnitId": ""

}

  var data = JSON.stringify(d);
  var options = {
    hostname: process.env.SERVICETITAN_URL,
    path: '/v1/bookings',
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'x-http-servicetitan-api-key' : process.env.SERVICETITAN_API_KEY
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
        console.log("here ",buffer)
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



function updateLead(data,id) {
  let d = {
  "customerType": "Commercial",
  "externalId": `${data.customer_phone_number}`,
  "customer": `${data.customer_name}`,
   "address": {
    "state": `${data.customer_state}`,
    "city": `${data.customer_city}`
  },
  "summary": `Recording : ${data.recording}` ,
 "contacts": [
       { "id": "0",
      "type": "Phone",
      "value": `${data.customer_phone_number}`,
      "memo": "string"
      }
      ],
       "isFirstTimeClient": true,
       "isSendConfirmationEmail" :false,
        "businessUnitId": ""

}
  var data = JSON.stringify(d);
  var options = {
    hostname: process.env.SERVICETITAN_URL,
    path: `/v1/bookings/external/${id}`,
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
      'x-http-servicetitan-api-key' : process.env.SERVICETITAN_API_KEY
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
       console.log("field error 0 ", buffer)
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

