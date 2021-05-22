//This script notifies per email and creats a calendar-reminder
// before the following Bitcoin prize halving happens.
//The goal is to buy bitcoin before its price rises.
//The exact block at which the notification is sent can be modified below.
//Bitcoin prize halve each 120,000 blocks.
function run() {
  //Create a google-drive text-file and put its ID in place of the stars.
  var stateFileId = '**********';
  //Add further emails that you would also like to notify.
  var emails = [];
  //Set how many blocks to get notified before the halving.
  //On average 144 blocks are mined per day.
  var firstHalving = 4500;
  var secondHalving = 500;
  
  emails.push(Session.getActiveUser().getEmail());
  var halvingsize = 120000;
  var url = 'https://blockchain.info/q/getblockcount';  
  var currentHeight = UrlFetchApp.fetch(url).getContentText();
  Logger.log('Current height ' + currentHeight);
  var stateFile = DriveApp.getFileById(stateFileId);
  var state = stateFile.getBlob().getDataAsString();
  Logger.log('State of data-file ' + state);
  var distanceToHalving = halvingsize - (currentHeight % halvingsize);

  //Avoid rewriting if distance too close (messages already sent)
  if (state == 0) {
    if (distanceToHalving > 3000) {
      Logger.log('Enough distance, switching to state 1 safely')
      stateFile.setContent(1);
    }
    return;
  }

  var contentAsText;
  var contentAsHTML;
  if (state == 1) {
    if (distanceToHalving < firstHalving) {
      contentAsText = 'Less than ' + firstHalving + ' blocks to havling!! Let us buy bitcoin!';
      contentAsHTML = createHTMLContent(firstHalving, false);
      createCalendarEvent();
      stateFile.setContent(2);
    } else {
      return;
    }
  } else if (state == 2) {
    if (distanceToHalving < secondHalving) {
      contentAsText = 'Less than ' + secondHalving + ' blocks to halving!! Have you already bought bitcoin?!'
      contentAsHTML = createHTMLContent(secondHalving, true);
      stateFile.setContent(0);
    } else {
      return;
    }
  } else {
    stateFile.setContent(0);
    throw ('bad data');
  }

  var subject = 'Bitcoin halving alert';
  emails.forEach(function(email, index){
      GmailApp.sendEmail(email, subject, contentAsText, { htmlBody: contentAsHTML });
  });
}

function createHTMLContent(distance, highPriority)
{
    var message;
    if(!highPriority)
    {
	    message = '<font style="font-size:25px;margin-left:50px">Buy some before every one else does.</font>';
    }
    else
    {
      message = '<font style="font-size:25px;margin-left:50px"><b style="color=red">Buy</b>\
      before it is too late!!</font>';

    }
    return '<html><body> <H1 style="font-size:30px;text-align:center">Bitcoin halving is coming soon</H1>\
		<font style="font-size:20px;margin-left:50px">Less than <b style="color:red">' + distance +
    '</b> blocks left.</font><br/>' + message + '</body></html>';
}

function createCalendarEvent() {
  var MILLIS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
  var startTime = new Date();
  var endTime = new Date(startTime.getTime() + MILLIS_PER_WEEK);
  var event = CalendarApp.getDefaultCalendar().createEvent('Buy Bitcoin ASAP!',
    startTime, endTime);
  Logger.log('Event ID: ' + event.getId());
}














