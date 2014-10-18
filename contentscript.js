var addRedirectToButton = function(button){
  button.addEventListener("click", function(e){
    console.log("maldrButtonClicked!!!!!!");
    chrome.runtime.sendMessage({greeting: "maildrButtonClicked"}, function(response) {
    console.log(response.farewell);
    });
  })
  return button;
};


var setAttributes = function (el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};


var createMaildrButton = function(){
  var innerMarkup = '<img class="T-I-J3" role="button" src="https://theblockheads.net/forum/attachment.php?attachmentid=4664&d=1375737045" alt="">'
  var maildrButton = document.createElement('div');
  setAttributes(maildrButton, {'id' : "maildr-button", "class" : "T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 T-I-Zf-aw2", "role" : "button", "tabindex" : "0", "data-tooltip" : "Create a mailder", "aria-label" : "Maildr", "style" : "-webkit-user-select: none;"});
  maildrButton.innerHTML = innerMarkup;
  maildrButton = addRedirectToButton(maildrButton);
  return maildrButton;
};


var insertButtons = function(){
  var bars = document.getElementsByClassName("gH acX");
  var maildrButton = createMaildrButton();
  for(var i = 0; i < bars.length; i++) {
    var element = bars.item(i);
    if (!element.hasAttribute("data-maild-button-added")) {
      element.setAttribute("data-maild-button-added", "true");
      element.insertBefore(maildrButton, element.firstChild);
    }
  }
};


var checkForEmailBars = function(){
  var bars = document.getElementsByClassName("gH acX");
  if (bars.length == 0) {
    return;
  }
  else{
    console.log("found bards!!!");
    insertButtons();
  }
};




var init = function(){
  console.log("hi from content script!");
  setInterval(function() {
    console.log("checking again!");
    checkForEmailBars(); 
    }, 500);
  }




window.onload = init();
