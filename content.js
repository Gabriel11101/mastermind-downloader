
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg == "Clicked") {
            window.postMessage("Clicked", "*");
        }
        return true;
    }
);

window.addEventListener("message", function(event) {
    if (event.data != "Clicked") {
        var course_name = event.data["course_name"]
        if (course_name != undefined) {
            var chaptersData = event.data["chaptersData"]
            var downloadData = event.data["downloadData"]

            for (let i = 0; i < downloadData.length; i++) {
                var name = downloadData[i]["name"]
                var url = downloadData[i]["url"]
                var chapter_id = downloadData[i]["chapter_id"]
                var chapter_name = null;

                for (let i = 0; i < chaptersData.length; i++) {
                    if (chaptersData[i]["id"] == chapter_id) {
                        chapter_name = chaptersData[i]["name"]
                    }
                }

                var filename = course_name.replace(/[/\\?%*:|"<>]/g, '-') + '/' + chapter_name.replace(/[/\\?%*:|"<>]/g, '-') + '/' + name.replace(/[/\\?%*:|"<>]/g, '-') + '.mp4';

                chrome.runtime.sendMessage({msg: "Download", url: url, filename: filename}, function (response) {})
            }
        }
    }
});
