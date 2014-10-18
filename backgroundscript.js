console.log("hello from baclground script!!");

var getData = function(JSONObject, sendResponse) {


    $.ajax({
            type: "POST",
            url: 'http://maild.co/api/emails',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(JSONObject)
        })
        .done(function(data) {
            alert("Success: " + data);
            alert("reponse json: " + JSON.stringify(data));
            sendResponse({
                farewell: data
            });
        })
        .fail(function(data) {
            alert("eroorrrr");
            dfd.reject(data);
        });
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "maildButtonClicked") {
            console.log(request.greeting);
            console.log(request.emailData);
            var JSONObject = request.emailData;
            getData(JSONObject, sendResponse);
        }
        return true;

    });
