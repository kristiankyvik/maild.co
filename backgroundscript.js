console.log("hello from baclground script!!");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "maildButtonClicked"){
      console.log(request.greeting);
      sendResponse({farewell: "yo ajaxxxxx"});
    }

  });

