// This script sends an email whenever a coin price drops below a given threshold
function main() {
  // enter your coinmarketcap API key here
  apiKey = '**********';

  //Change the following two lines according to your personal preferences
  var coins = ['BNB', 'BUNNY'];
  var threshold = {'BNB':'250', 'BUNNY':'60'};
  
  var coinsStr = coins.join();
  var ops = {
    headers : {
               'X-CMC_PRO_API_KEY': apiKey,
               'Accept':'application/json'}}
  var url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes' +
    '/latest?symbol='+coinsStr+'&convert=USD';
  var response = UrlFetchApp.fetch(url, ops);
  var data = JSON.parse(response.getContentText());

  var badCoinFound = false;
  var badCoins = [];
  Object.keys(data.data).forEach(function(coin) {
    var price = data.data[coin].quote.USD.price;
    if(price < threshold[coin]) {
      badCoinFound = true;
      badCoins.push({'coin':coin, 'price':price});
    }
  });
  if(!badCoinFound)
  {
    return
  }
  badCoins.forEach(function (val, ind)
  {
    Logger.log(val['coin'] + '\t' + val['price']);
  });

  var userEmail = Session.getActiveUser().getEmail();
  var subject = 'Price drop alert!'
  GmailApp.sendEmail(userEmail, subject, getContentAsString(badCoins), {htmlBody: createHtmlBody(badCoins) });
}

function getContentAsString(badCoins) {
  var content = "";
  badCoins.forEach(function(elem) {
      var coin = elem['coin'];
      var price = elem['price'];
      content += coin + ' ' + price + '\n';
    });
  return content;
}

function createHtmlBody(badCoins) {
  var content = "";
  badCoins.forEach(function(elem) {
      var coin = elem['coin'];
      var price = elem['price'];
      content += '<tr><td><b>' + coin + '</b></td><td>' + price + '</td></tr>';
    });

  return '<html><body>\
  	<H1 style="text-align:center">Price drop allert!</H1>\
		<font style="font-size:20px">Some coins have plunged below a preset value!</font><p/>\
		<table style="font-size:20px;width:40%;margin-left:10%">' + content + '</table></body></html>';
}

