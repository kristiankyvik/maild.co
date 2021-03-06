
/**
 * [getSenderInfo retrives info related to the sender]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getSenderInfo = function(emailElement){
  var senderInfo = $(emailElement).find('.gD');
  var senderName = senderInfo.attr('name')
  var senderEmail = senderInfo.attr('email');
  return {
      "name": senderName,
      "email": senderEmail
  };
};

/**
 * [getReceiversInfo description]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getReceiversInfo = function(email){
  var receiversInfo = $(email).find('.g2');
  var arrayOfTOs = [];
  receiversInfo.each(function() {
      var receiverName = $(this).attr('name');
      var receiverEmail = $(this).attr('email');
      jsonData["to"].push({
          "name": receiverName,
          "email": receiverEmail
      });
  });
  return arrayOfTOs;
};

/**
 * [getCCInfo description]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getCCInfo = function(email){
  var ccInfo = $(email).find('.g2.ac2');
  var arrayOfCCs = [];
    ccInfo.each(function() {
        var ccName = $(this).attr('name');
        var ccEmail = $(this).attr('email');
        jsonData["cc"].push({
            "name": ccName,
            "email": ccEmail
        });
    });
    return arrayOfCCs;
};

/**
 * [getEmailSubject description]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getEmailSubject = function(email){
  var emailSubject = $("title")[0].innerHTML.split("-")[0].trim();
  return emailSubject;
};

/**
 * [getEmailBody description]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getEmailBody = function(email) {
  var temporalDiv =  $("<div>", {id: "temporalDiv"}).css("display", "none").appendTo("body");
  var emailContent = $(email).find('.a3s')[0]
  $(emailContent).clone().appendTo("#temporalDiv");
  $("#temporalDiv").find(".gmail_extra").remove();
  $("#temporalDiv").find(".gmail_quote").remove();
  var emailBodyInnerHtml =  $("#temporalDiv").html();
  $("#temporalDiv").remove();
  return emailBodyInnerHtml;
};

/**
 * [getDateAndTime description]
 * @param  {[type]} email
 * @param  {[type]} jsonData
 * @return {[type]}
 */
var getDateAndTime = function(email) {
  var dateString = $(email).find('.g3').attr("title") + " UTC";
  var formattedDate = moment(dateString).format();
  return formattedDate;
};

/**
 * [createJSON navigates the email and retrieves all the relevant 
 * information we want to retrieve from the email, and adds it to 
 * JSON object]
 * @param  {[DOM Element]} email
 * @return {[JSON Object]}
 */
var createJSON = function(email) {
    /*
    Initiliaze the JSON object that will contain all the email info
     */
    var jsonData = {};
    var jsonData["from"] = getSenderInfo(email)
    var jsonData["to"] = getReceiversInfo(email);
    var jsonData["cc"] = getCCInfo(email);
    var jsonData["subject"] = getEmailSubject(email);
    var jsonData["body"] = getEmailBody(email);
    var jsonData["sent_date"] = getDateAndTime(email);
    return jsonData;
};

/**
 * [handleResponse will ahndle the response sent by th background script. It will retrieve
 * the HTML code, and create an iframe within a modal to display the result to the user]
 * @param  {[JSON Object]} response
 * @return {[none]}
 */
var handleResponse = function(response){
  var link = "<iframe src='https://maild.co/embed/" + response.id + "' style='border:0; width: 100%; height:500px;'></iframe>" ;
  var iframeLink = "<div style='margin-bottom:15px'><div style='vertical-align: super; color: black; margin-right: 12px; margin-left: 7px; display: inline-block;' >Share this email: <div class='addthis_sharing_toolbox' data-url='http://maild.co/" + response.id + "' data-title='" + response.subject + "' style='display:inline-block; vertical-align:middle;'></div><span id='showSnippet'> View<b> embed code. </b></span> </div></div><div style='vertical-align:middle'><script type='text/javascript' src='//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5442ede42c50d0e1' async></div></script><textArea id='thecodesnippet' class='example_code' style='background:#EEEEEE;'>" + link + "</textArea> <iframe src='https://maild.co/embed/" + response.id + "' style='border:0; width: 100%; height:500px;'></iframe>";
  vex.open({
    message: 'This is how your email will look with maild: ',  
    content: iframeLink,
    callback: function(value) {
      return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
    }
  });
  var snippet =  $('#thecodesnippet');
  snippet.hide();
  $('#showSnippet').on('click', function(){
    $('#thecodesnippet').show();
  });

};

/**
 * [sendJSONToBackground is the action that is called when the button is clicked.
 * It essentially sends a message to the background script with a JSON that
 * contains all the information extracted from the email]
 * @param  {[JSON Object]} JSONObject
 * @return {[none]}
 */
var sendJSONToBackground = function(JSONObject) {
    chrome.runtime.sendMessage({
        greeting: "maildButtonClicked",
        emailData: JSONObject
    }, function(response) {
        handleResponse(response.farewell);
        console.log(response.farewell);
    });
};

/**
 * [addRedirectToButton takes the button as a parameter and simply adds
 * a listener to it. It also retrieves the entire email and call the fucntion
 * creaetJSON(email)]
 * @param {[type]} button
 */
var addRedirectToButton = function(button) {
    button.addEventListener("click", function(e) {
        var email = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        var JSONObject = createJSON(email);
        sendJSONToBackground(JSONObject);
    })
    return button;
};

/**
 * [setAttributes is a helper function that allows us to assign various
 * values to attributes by specifying one specific DOM element and a hash
 * containing attributes as keys and attr-value as values]
 * @param {[DOM element]} el
 * @param {[Hash]} attrs
 */
var setAttributes = function(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

/**
 * [createMaildButton creates a new DOM element, the button, and adds
 * all the appropiate classes to it]
 * @return {[DOM Element]}
 */
var createMaildButton = function() {
    var innerMarkup = 'Share'
    var maildButton = document.createElement('div');
    setAttributes(maildButton, {
        'id': "maild-button",
        "class": "T-I J-J5-Ji aaq T-I-ax7 L3 T-I-Zf-aw2",
        "role": "button",
        "tabindex": "0",
        "data-tooltip": "Share or embed this email",
        "aria-label": "Maild",
        "style": "color: #fff; margin-left: 5px; margin-right: 0; background-color: #16BE18; background-image: -webkit-linear-gradient(top,#09DD44,#13B21B); background-image: linear-gradient(top,#4d90fe,#4787ed); border: 1px solid #16B005;"});
    maildButton.innerHTML = innerMarkup;
    maildButton = addRedirectToButton(maildButton);
    return maildButton;
};

/**
 * [insertButtons retrieves the the bars and loops thorugh them,
 * inserting a button in each bar, and adding an attribute
 * "data-maild-button-added", "true", to remember the button has been added.]
 * @return {[none]}
 */
var insertButtons = function() {
    var bars = $(".gH.acX");
    var is_button_exist;
    bars.each(function( index, element ) {
      var attr = $(element).attr('data-maild-button-added');
      if (typeof attr === 'undefined' || attr === false) {
        var maildButton = createMaildButton();
          $(element).append(maildButton);
          is_button_exist = $(element).find('#maild-button').length;
          if (is_button_exist) {
            $(element).attr("data-maild-button-added", "true");
          }  
      }   
    });

};

/**
 * [checkForEmailBars looks for emails bars and check if they are more than zero,
 * meaning he compose window has been loaded, it runt the insertButton function ]
 * @return {[none]}
 */
var checkForEmailBars = function() {
    var bars = document.getElementsByClassName("gH acX");
    if (bars.length == 0) {
        return;
    } else {
        insertButtons();
    }
};

/**
 * [checkDateTime simply makes sure the method toISOString is available
 * If not available it will buld it as a extension to the prototype]
 * @return {[none]}
 */
var checkDateTime = function() {
    if (!Date.prototype.toISOString) {
        (function() {

            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            }

            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() +
                    '-' + pad(this.getUTCMonth() + 1) +
                    '-' + pad(this.getUTCDate()) +
                    'T' + pad(this.getUTCHours()) +
                    ':' + pad(this.getUTCMinutes()) +
                    ':' + pad(this.getUTCSeconds()) +
                    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                    'Z';
            };

        }());
    }
};
/**
 * [init will run once the window is fully loaded,
 * will set the appropiate theme for the modal library
 * and will also check if all the libraries we plan to use loaded.
 * init will also start running the function checkForEmailBars
 * every half second ]
 * @return {[none]}
 */
var init = function() {
    vex.defaultOptions.className = 'vex-theme-os';
    checkDateTime();
    setInterval(function() {
        checkForEmailBars();
    }, 500);
}

window.onload = init();
