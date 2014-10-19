var createJSON = function(email) {
    var jsonData = {};
    var senderInfo = $(email).find('.gD');
    var senderName = senderInfo.attr('name')
    var senderEmail = senderInfo.attr('email');
    jsonData["from"] = {
        "name": senderName,
        "email": senderEmail
    };

    var receiversInfo = $(email).find('.g2');
    jsonData["to"] = [];
    receiversInfo.each(function() {
        var receiverName = $(this).attr('name');
        var receiverEmail = $(this).attr('email');
        jsonData["to"].push({
            "name": receiverName,
            "email": receiverEmail
        });
    });

    var ccInfo = $(email).find('.g2.ac2');
    jsonData["cc"] = [];
    console.log(ccInfo);
    ccInfo.each(function() {
        var ccName = $(this).attr('name');
        var ccEmail = $(this).attr('email');
        jsonData["cc"].push({
            "name": ccName,
            "email": ccEmail
        });
    });

    var emailSubject = $("title")[0].innerHTML.split("-")[0].trim();
    console.log(emailSubject);
    jsonData["subject"] = emailSubject;
    var emailBody = $(email).find('.a3s')[0].firstChild.innerHTML;
    console.log(email);
    jsonData["body"] = emailBody;
    var dateString = $(email).find('.g3').attr("title") + " UTC";
    var formattedDate = moment(dateString).format();
    jsonData["sent_date"] = formattedDate;
    console.log(jsonData);
    return jsonData;
};

var handleResponse = function(response){
  var link = "<iframe src='https://maild.co/embed/" + response.id + "' style='border:0; width: 100%; height:500px;'></iframe>" ;
  var iframeLink = "<div style='margin-bottom:15px'><div style='vertical-align: super; margin-right: 12px; display: inline-block'>Your embed is ready: </div><div class='addthis_sharing_toolbox' data-url='http://maild.co/" + response.id + "' data-title='" + response.subject + "' style='display:inline-block'></div></div><script type='text/javascript' src='//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5442ede42c50d0e1' async></script><iframe src='https://maild.co/embed/" + response.id + "' style='border:0; width: 100%; height:500px;'></iframe><br><br>Embed by copying the following snippet<br><textArea class='example_code' style='background:#EEEEEE;'>" + link + "</textArea>";
  vex.open({
    message: 'This is how your email will look with maild: ',
    content: iframeLink,
    callback: function(value) {
      return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
    }
  });


};

var sendJSONToBackground = function(JSONObject) {
    chrome.runtime.sendMessage({
        greeting: "maildButtonClicked",
        emailData: JSONObject
    }, function(response) {
        handleResponse(response.farewell);
        console.log(response.farewell);
    });

};

var addRedirectToButton = function(button) {
    button.addEventListener("click", function(e) {
        var email = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        var JSONObject = createJSON(email);
        sendJSONToBackground(JSONObject);
    })
    return button;
};

var setAttributes = function(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};


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


var insertButtons = function() {
    var bars = document.getElementsByClassName("gH acX");
    var maildButton = createMaildButton();
    for (var i = 0; i < bars.length; i++) {
        var element = bars.item(i);
        if (!element.hasAttribute("data-maild-button-added")) {
            element.setAttribute("data-maild-button-added", "true");
            $(element).append(maildButton);
        }
    }
};


var checkForEmailBars = function() {
    var bars = document.getElementsByClassName("gH acX");
    if (bars.length == 0) {
        return;
    } else {
        insertButtons();
    }
};

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
var init = function() {
    vex.defaultOptions.className = 'vex-theme-os';
    checkDateTime();
    console.log("hi from content script!");
    setInterval(function() {
        checkForEmailBars();
    }, 500);
}




window.onload = init();
