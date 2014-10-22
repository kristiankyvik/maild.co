/**
 * [getData creates an AJAX request containing the datat of the email
 * and send it to the maild.co API, that will reponse with the URL, 
 * and embed code of the formatted email]
 * @param  {[JSON Object]} JSONObject
 * @param  {[type]} sendResponse
 * @return {[type]}
 */
var getData = function(JSONObject, sendResponse) {
    $.ajax({
            type: "POST",
            url: 'http://maild.co/api/emails',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(JSONObject)
        })
        .done(function(data) {
            // alert("Success!");
            sendResponse({
                farewell: data
            });
        })
        .fail(function(data) {
            alert("eroorrrr!");
            dfd.reject(data);
        });
};

/**
 * [this function simply listens for any messages incoming sent by
 * any of the content scripts and returns the accroding response.]
 * @param  {[Chrome_message]} request
 * @param  {[type]} sender
 * @param  {[type]} sendResponse) {        console.log(sender.tab ?            "from a content script:" + sender.tab.url :            "from the extension");        if (request.greeting == "maildButtonClicked") {            var JSONObject = request.emailData;            getData(JSONObject, sendResponse);        }        return true;    }
 * @return {[type]}
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "maildButtonClicked") {
            var JSONObject = request.emailData;
            getData(JSONObject, sendResponse);
        }
        return true;
    });
