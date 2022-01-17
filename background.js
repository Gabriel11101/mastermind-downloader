
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
      if (request.msg == "Download") {
        chrome.downloads.download({
          url: request.url,
          filename: request.filename
        });
      }
  }
  return true;
});

chrome.action.onClicked.addListener(function(tab) { 
  chrome.tabs.sendMessage(
    tab.id,
    {
      msg: "Clicked",
    },
      function (response) {
      }
  );
});