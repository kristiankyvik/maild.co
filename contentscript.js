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

    var emailBody = $(email).find('.a3s')[0].innerHTML;
    console.log(email);
    console.log(emailBody);
    jsonData["body"] = emailBody;

    var dateString = $(email).find('.g3').attr("title") + " UTC";
    var unformattedDate = new Date(dateString);
    var formattedDate = unformattedDate.toISOString();
    jsonData["dateAndTime"] = formattedDate;
    console.log(jsonData);
    // var jqxhr =
    //     $.ajax({
    //         type:"POST",
    //         url: 'http://maild.co/api/emails',
    //         dataType: 'json',
    //         data: jsonData

    //     })
    //     .done (function(data) { alert("Success: " + data.param1) ; })
    //     .fail   (function(data)     { console.log(data)   ; })
    //     ;

    return jsonData;





};


var sendJSONToBackground = function(JSONObject) {
    chrome.runtime.sendMessage({
        greeting: "maildButtonClicked",
        emailData: JSONObject
    }, function(response) {
        console.log(response);
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
    var innerMarkup = '<img class="T-I-J3" role="button" src="https://theblockheads.net/forum/attachment.php?attachmentid=4664&d=1375737045" alt="">'
    var maildButton = document.createElement('div');
    setAttributes(maildButton, {
        'id': "maild-button",
        "class": "T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 T-I-Zf-aw2",
        "role": "button",
        "tabindex": "0",
        "data-tooltip": "Create a mailder",
        "aria-label": "Maild",
        "style": "-webkit-user-select: none;"
    });
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
            element.insertBefore(maildButton, element.firstChild);
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
    console.log("empeze ========")
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
    console.log("acabe ========");
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
