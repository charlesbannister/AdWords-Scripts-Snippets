//pass a SETTINGS object containing EMAIL (csv of email addresses) and LOG_SHEET_URL (the sheet with the date)
//INPUT_TAB_NAME must also be defined outside the function, or passed
//formatting will need adding depending on the data type. Usually the first x columns are strings, then the following are numbers


function emailSheet(SETTINGS) {

  var emails = SETTINGS.EMAIL
  var subject = SETTINGS.NAME + " - "+ INPUT_TAB_NAME;
  
  var message = "Hi,<br><br>"
  message+="The "+INPUT_TAB_NAME+" script ran successfully, <a href='"+SETTINGS.LOG_SHEET_URL+"'>the output sheet is here.</a><br><br>";
  
  var tab = SpreadsheetApp.openByUrl(SETTINGS.LOG_SHEET_URL).getActiveSheet()
  var values = tab.getDataRange().getValues();

  message += '<table style="background-color:white;border-collapse:collapse;" border = 1 cellpadding = 5>';
  for (var row=0;row<values.length;++row){
    message+="<tr>"
    for(var col = 0;col<values[0].length;++col){
      if(col<2){
        //first two columns are strings
        message += isNaN(values[row][col])||values[row][col]==""? '<td>'+values[row][col]+'</td>': '<td>'+String(values[row][col])+'</td>';
      }else{
      message += isNaN(values[row][col])||values[row][col]==""? '<td>'+values[row][col]+'</td>': '<td>'+Math.round10(values[row][col], -2)+'</td>';
      }
    }
    message += '</tr>';
    
  }
  message += '</table><br><br>';
    
  
    for(var email_i in emails){
   MailApp.sendEmail({
     to: emails[email_i],
     subject: subject,
     htmlBody: message  
   });
    }
}

//rounding logic (probably a less cumbersome solution out there, but it works)

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
