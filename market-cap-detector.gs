//This script detects an increase in the market cap above a given
//value and sends the current value per email if it was above the threshold
function main() {
  // Enter a lower threshold on the market cap
  var marketLow = 1.85E12;
  // Enter your coinmarketcap API key here
  apiKey = '**********';

  var ops = {
    headers : {
               'X-CMC_PRO_API_KEY': apiKey,
               'Accept':'application/json'}}
  var url = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest';
  var response = UrlFetchApp.fetch(url, ops);
  var data = JSON.parse(response.getContentText());
  var currentMarket = data.data.quote.USD.total_market_cap;
  Logger.log(currentMarket);

  if(currentMarket < marketLow)
  {
    return;
  }

  var userEmail = Session.getActiveUser().getEmail();
  var subject = 'Hurray!! Market cap is rising!'
  var mailContent = 'Market cap has been increasing. Current Marketcap is ' + currentMarket + '. Hurray!'
  GmailApp.sendEmail(userEmail, subject, mailContent, {htmlBody: createHtmlBody(currentMarket) });
}

function createHtmlBody(currentMarket) {
  return '<html><body> <H1 style="text-align:center;font-size:40px">Market is healing! Hurray!</H1>\
	<font style="font-size:30px;margin-left:50px">Market cap has been increasing! It is currently\
		at <b style="color:red">' + (currentMarket/1e12).toFixed(2) +
    'T</b> USD. Buy the dip!</font></body></html>'

}

