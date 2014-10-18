
var insertButtons = function(){
  var bars = document.getElementsByClassName("gH acX");
  var innerMarkup = '<div class="T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 T-I-Zf-aw2" role="button" tabindex="0" data-tooltip="Create a mailder" aria-label="Maildr" style="-webkit-user-select: none;"><img class="T-I-J3" role="button" src="https://theblockheads.net/forum/attachment.php?attachmentid=4664&d=1375737045" alt=""></div>'
  // var maildButton = createMaildButton();
  for(var i = 0; i < bars.length; i++) {
    var element = bars.item(i);
    if (!element.hasAttribute("data-maild-button-added")) {
      element.setAttribute("data-maild-button-added", "true");
      element.insertAdjacentHTML('afterbegin', innerMarkup);
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
