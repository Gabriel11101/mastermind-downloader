
var chapters;
var contents;
var course;

var open_prototype = XMLHttpRequest.prototype.open,
intercept_response = function(callback) {
   XMLHttpRequest.prototype.open = function() {
      this.addEventListener('readystatechange', function(event) {
         if ( this.readyState === 4 ) {
            var response = callback(event.target.responseText);
            Object.defineProperty(this, 'response',     {writable: true});
            Object.defineProperty(this, 'responseText', {writable: true});
            this.response = this.responseText = response;
         }
      });
      return open_prototype.apply(this, arguments);
   };
};

function downloadContents() {
    
    var downloadData = [];
    var chaptersData = [];
    var names = [];
    for (let i = 0; i < chapters.length; i++) {
        var chapter_name = chapters[i]["name"];
        var chapter_id = chapters[i]["id"];
        chaptersData.push({"name": chapter_name, "id": chapter_id});
    }
    for (let i = 0; i < contents.length; i++) {
        if (contents[i]["default_lesson_type_label"] != "Vídeo") {
            continue
        }
        
        var downloadID = contents[i]["contentable"];
        var downloadURL = `https://www.mastermind.ac/api/course_player/v2/lessons/${downloadID}/download`;
        var name = contents[i]["name"];
        names.push(name);
        downloadData.push({"name": name, "chapter_id": contents[i]["chapter_id"], "url": downloadURL});
    }
    var course_name = course["name"]

    var msgdata = {"chaptersData": chaptersData, "downloadData": downloadData, "course_name": course_name}

    var link = document.createElement('a');
    link.href = 'data:text/plain;charset=UTF-8,' + encodeURIComponent(names.join('\n'));
    //set default action on link to force download, and set default filename:
    link.download = 'index.txt';     

    link.click();

    window.postMessage(msgdata, "*");
}

intercept_response(function(response) {
    try {
        if (response) {
            var json_response = JSON.parse(response);
            props = ["chapters", "contents", "course"];
            var hasAll = props.every(prop => json_response.hasOwnProperty(prop));

            if (hasAll) {
                chapters = json_response["chapters"];
                contents = json_response["contents"];
                course = json_response["course"];

            }
        }
    }
    catch (error) {
        console.log(error);
    }
    var new_response = response.replace('"downloadable":false', '"downloadable":true');
    return new_response;
});

window.addEventListener("message", function(event) {
    if (event.data == "Clicked")
        downloadContents();
});
