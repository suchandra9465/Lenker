var ActiveCampaign = require('./ActiveCampaign');
var QuickBooks = require('./QuickBooks');

var activeCampaign = new ActiveCampaign({
	hostname: process.env.AC_HOSTNAME, //required
	apiToken: process.env.AC_APITOKEN //required
});


var quickBooks = new QuickBooks({
	hostname: 'quickbooks.api.intuit.com', //production hostname //required
	clientID: process.env.QB_CLIENTID, //required
	clientSecret: process.env.QB_CLIENTSECRET, //required
	environment: 'production', //required
	redirectUri: 'https://server.treestory.pro/QBoauthRedirect', //ourdomain.com/page-qb-will-send-auth-data-to //required
	companyID: process.env.QB_COMPANYID //required
});


/* QuickBooks Authentication */

//page to send customer that will redirect them to a QuickBooks login page. Our app gets authenticated once they login
app.get('/authenticateQB', function(req, res){
	res.redirect( quickBooks.authorizationUri() );
});

//page to redirect to after authentication
app.get('/QBoauthRedirect', function(req, res){
	var parseRedirect = req.url; //Quickbooks sends a request to this page with the authentication keys
	quickBooks.createToken(parseRedirect, function(error, data){
		if(error){
			console.log(error);
		} else {
			console.log(data);
		}
	});

	res.redirect('/QBauthenticated');
});

app.get('/QBauthenticated', function(req, res){
	res.send('QB authenticated');
});


/* Active Campaign -> QuickBooks
New contacts in Active Campaign get added to QuickBooks customers list*/

app.post('/newContactInAC', function(req, res){
	//only called when the contact is added to the 'New Leads' list in Active Campaign
	var data = req.body;
	console.log('new contact created in ac');

	let contact = data['contact'];

	let familyName = contact['last_name'] || '';
	let givenName = contact['first_name'] || '';
	let displayName = givenName + ' ' + familyName;
	let email = contact['email'] || '';
	let phone = contact['phone'] || '';
	let state, city, address, zip;

	activeCampaign.listContactCustomFields(email, function(error, data){
		if(error){
			console.log(error);
			return;
		}
		state = data['State'] || '';
		city = data['City'] || '';
		address = data['Street 01'] || '';
		zip = data['Zip Code'] || ''

		console.log({
			givenName: givenName,
			familyName: familyName,
			displayName: displayName,
			email: email,
			phone: phone,
			state: state,
			city: city,
			address: address,
			zip: zip
		});

		if(!quickBooks.accessToken || city.length==0) return; //city.length==0 cause we only wanna add entries to QB if they have an address also

		function callback(error, data){
			if(error){
				console.log(error);
			} else {
				console.log(data);
			}
		}

		quickBooks.refreshToken(function(error, data){
			if(error){
				console.log(error);
				return;
			}

			quickBooks.createCustomer({
				"DisplayName": displayName,
				"FamilyName": familyName,
				"GivenName": givenName,
				"PrimaryEmailAddr": {
					"Address": email
				},
				"PrimaryPhone": {
					"FreeFormNumber": phone
				},
				"BillAddr": {
					"CountrySubDivisionCode": state,
					"City": city,
					"PostalCode": zip,
					"Line1": address
					//"Country": "USA"
				}
			}, callback);
		});
	});
});
