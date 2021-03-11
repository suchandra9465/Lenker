/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 var https = require('https');
 var Airtable = require('./Airtable')

 var airtable = new Airtable({
	apiKey: process.env.AIRTABLE_APIKEY, //required
  baseID: process.env.AIRTABLE_BASEID //required
});


 exports.createFormLead = (req, res) => {
   data = JSON.parse(req.body);

   /* we wanna cache records first. So the records that were
already in airtable when the application starts don't get
sent to acive campaign again */
airtable.cacheRecords('Quotes', function(error, data){
	if(error){
		console.log(error);
		return;
	} else {
		checkForNewRecords();
	}
});

/* we wanna cache records first. So the records that were
already in airtable when the application starts don't get
sent to acive campaign again */
airtableIowa.cacheRecords('Iowa Estimates', function(error, data){
	if(error){
		console.log(error);
		return;
	} else {
		checkForNewIowaRecords();
	}
});
 
   res.status(200).send("Form Submitted");
 
 
 };





/*
finding an airtable record by email, incase it's needed, evintually will add this as a method inside Airtable class
airtable.fetchAllRecords('Quotes', function(error, data){
	let allRecords = data;
	let r = allRecords.find(record => record.Email === 'marksman187@yahoo.com');
	console.log(r);
});
*/

/* Airtable records -> Active Campaign
automatically pushing new airtable records into active campaign*/

//we'll need this later
function firstWord(string){
	if(typeof string != 'string') return;
	var words = string.split(" ");
	return words[0];
}

//we'll need this later
function lastWord(string){
	if(typeof string != 'string') return;
	var words = string.split(" ");
	if(words.length==1){
		return '';
	} else {
		return words[words.length-1];
	}
}



// Check for new records and add them to active campaign
function checkForNewRecords(){
	//Check for new records at table 'Quotes' and check by 'Email' field
	airtable.checkForNewRecords('Quotes', 'Email', function(error, data){//email is the field to search for new recods by
		if(error){
			console.log(error);
			return;
		}

		var newRecords = data;
		if(newRecords.length>0) console.log(newRecords);

		function addRecordToActiveCampaign(newRecord){
			var email = newRecord["Email"] || '';

			var basicInfo = {
				/* since airtable form takes fullname will seperate into first and last name */
				'firstName': firstWord(newRecord['Full Name']) || '',
				'lastName': lastWord(newRecord['Full Name']) || '',
				'phone': newRecord['Phone'] || ''
			}

			var customFields = {
				'City': newRecord['City'] || '',
				'Street 01': newRecord['Street'] || '',
				'State': newRecord['State'] || '',
				'Job Type': newRecord['Job Type'] || '',
				'Location': newRecord['Location'] || '',
				'Obstructions': newRecord['Obstructions'] || '',
				'Is access to work area 3 feet or wider?': newRecord['Is access to work area 3 feet or wider?'] || '',
				'Tree Type': newRecord['Tree Type'] || '',
				'Tree Height': newRecord['Tree Height'] || '',
				'Tree Diameter': newRecord['Tree Diameter'] || '',
				'Additional Info': newRecord['Additional Info'] || ''
			}

			var tags = ['Quote Info Form Completed'];

			var callback = function(error, data){
				if(error){
					//console.log(error.message);
				} else {
					//console.log(data);
					console.log('contact added to ac from airtable');
				}
			}

			activeCampaign.createOrUpdateContact(email, basicInfo, customFields, tags, callback);
		}

		newRecords.forEach(function(newRecord){
			addRecordToActiveCampaign(newRecord);
		});
	});

	setTimeout(checkForNewRecords, 10000);
}

/* iowa forms */

var airtableIowa = new Airtable({
	apiKey: process.env.AIRTABLE_APIKEY, //required
  baseID: process.env.AIRTABLE_BASEID //required
});



// Check for new records and add them to active campaign
function checkForNewIowaRecords(){
	//Check for new records at table 'Quotes' and check by 'Email' field
	airtableIowa.checkForNewRecords('Iowa Estimates', 'Email', function(error, data){//email is the field to search for new recods by
		if(error){
			console.log(error);
			return;
		}

		var newRecords = data;
		//if(newRecords.length>0) console.log(newRecords);

		function addRecordToActiveCampaign(newRecord){
			var email = newRecord["Email"] || '';

			var basicInfo = {
				/* since airtable form takes fullname will seperate into first and last name */
				'firstName': firstWord(newRecord['Name']) || '',
				'lastName': lastWord(newRecord['Name']) || '',
				'phone': newRecord['Phone Number'] || ''
			}

			var customFields = {
				'City': newRecord['City'] || '',
				'Street 01': newRecord['Street'] || '',
				'State': newRecord['State'] || '',
				'Additional Info': newRecord['Notes'] || ''
			}

			var tags = ['Iowa Quote Info Form Completed'];

			var callback = function(error, data){
				if(error){
					//console.log(error.message);
				} else {
					//console.log(data);
					console.log('contact added to ac from iowa airtable form');
				}
			}

			activeCampaign.createOrUpdateContact(email, basicInfo, customFields, tags, callback);
		}

		newRecords.forEach(function(newRecord){
			addRecordToActiveCampaign(newRecord);
		});
	});

	setTimeout(checkForNewIowaRecords, 10000);
}