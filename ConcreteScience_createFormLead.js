
var https = require('https');

exports.createFormLead = (req, res) => {
  data = JSON.parse(req.body);

  console.log("incoming data", data)
 // createLead(data);
  checkIfExists(data);
  res.status(200).send("Form Submitted");


};
function checkIfExists(data) {
  var options = {
    hostname: process.env.SERVICETITAN_URL,
    path: `/v1/bookings/external/${data[3].phone}`,
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
  "externalId": `${data[3].phone}`,
  "customer": `${data[3].name}` +" "+`${data[3].last_name}`,
   "address": {
    "city": `${data[3].CITY_ST_ZIP}`
  },
  "summary": `SERVICE TYPE: ${data[0].SERVICE_TYPES} , PROJECT_TYPE: ${data[1].PROJECT_TYPE}, PROJECT LOCATION: ${data[2].PROJECT_LOCATION}` ,
 "contacts": [
        {
          "id": "",
          "type": "Email",
          "value": `${data[3].email}`,
          "memo": "string"
        },
       { "id": "0",
      "type": "Phone",
      "value": `${data[3].phone}`,
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






// function checkIfExists(data) {
//   var options = {
//     hostname: process.env.SERVICETITAN_URL,
//     path: `/v1/customers?Phone=${data.phone}`,
//     method: 'GET',

//     headers: {
//       'Content-Type': 'application/json',
//       'x-http-servicetitan-api-key' : process.env.SERVICETITAN_API_KEY
//     }
//   }

//   var req = https.request(options, function (response) {

//     var buffer = '';
//     response.on('data', function (chunk) {
//       buffer += chunk;
//     });

//     response.on('end', function () {
//       // var json = JSON.parse(buffer);

//       try {
//         var json = JSON.parse(buffer);
//         if (json.errors) {
//           var errorMsg = json.errors[0].error;
//           var error = new Error(errorMsg);
//           console.log("field error 0", error)
//           throw error;
//         } else {
//           console.log("len is ", json)

//           if (json.length == 0) {
//             createLead(data)
//           }
//           else {
//             console.log("data is ", data)
//             updateLead(data,json.data[0].id)
//           }

//         }
//       } catch (error) {
//         console.log("field error 2", error)
//       }
//     });
//   });



//   req.on('error', function (error) {
//     console.log("field error ", error)
//   });
//   req.end();



// }

// function createLead(data) {
//    let d = {
//   "name": `${data.name}` +" "+`${data.last_name}`,
//   "balance": "",
//   "doNotMail": true,
//   "doNotService": true,
//   "type": "Residential",
//   "locations": [
//     {
//       "name": `${data.name}` +" "+`${data.last_name}`,
//       "address": {
//         "city": `${data.CITY_ST_ZIP}`
//       },
//       "contacts": [
//         {
//           "id": "",
//           "type": "Email",
//           "value": `${data.email}`,
//           "memo": "string"
//         }
//       ]
//     }
//   ],
//   "address": {
//     "city": `${data.CITY_ST_ZIP}`
//   },
//   "contacts": [
//     {
//       "id": "0",
//       "type": "Email",
//       "value": `${data.email}`,
//       "memo": "string"
//     },
//     {
//       "id": "0",
//       "type": "Phone",
//       "value": `${data.phone}`,
//       "memo": "string"
//     }
//   ]
// }
//   var data = JSON.stringify(d);
//   var options = {
//     hostname: process.env.SERVICETITAN_URL,
//     path: '/v1/customers',
//     method: 'POST',

//     headers: {
//       'Content-Type': 'application/json',
//       'x-http-servicetitan-api-key' : process.env.SERVICETITAN_API_KEY
//     }
//   }


//   var req = https.request(options, function (response) {

//     var buffer = '';
//     response.on('data', function (chunk) {
//       buffer += chunk;
//     });

//     response.on('end', function () {
//       // var json = JSON.parse(buffer);

//       try {
//         var json = JSON.parse(buffer);
      
//         if (json.errors) {
//           var errorMsg = json.errors[0].error;
//           var error = new Error(errorMsg);
//           console.log("field error 0", error)
//           throw error;
//         } else {
//           console.log("success")
//         }
//       } catch (error) {
//         console.log("field error 2", error)
//       }
//     });
//   });



//   req.on('error', function (error) {
//     console.log("field error ", error)
//   });
//   req.write(data);
//   req.end();
// }


function updateLead(data,id) {
  let d = {
  "customerType": "Commercial",
  "externalId": `${data[3].phone}`,
  "customer": `${data[3].name}` +" "+`${data[3].last_name}`,
   "address": {
    "city": `${data.CITY_ST_ZIP}`
  },
   "summary": `SERVICE TYPE: ${data[0].SERVICE_TYPES} , PROJECT_TYPE: ${data[1].PROJECT_TYPE}, PROJECT LOCATION: ${data[2].PROJECT_LOCATION} } ` ,
 "contacts": [
        {
          "id": "",
          "type": "Email",
          "value": `${data[3].email}`,
          "memo": "string"
        },
       { "id": "",
      "type": "Phone",
      "value": `${data[3].phone}`,
      "memo": "string"
      }
      ],
       "isFirstTimeClient": false,
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


