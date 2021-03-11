var https = require('https');

class HelperFunctions {
  constructor(){
  }

  get(){
  }

  post(){
  }

  put(){
  }

  delete(){
  }

  generateFakemail(number){
  	var x = number;
  	x = x.substr(1);
  	x = x + "@Fakemail.com";
  	return x;
  }

  generateLastSevenDigits(number){
    var x = number.substr(number.length - 7);
    return x;
  }

  getKeyByValue(object, value){
    return Object.keys(object).find(key => object[key] === value);
  }
}

module.exports = HelperFunctions;
