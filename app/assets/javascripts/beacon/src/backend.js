function addExtraInfo(data) {
    data._ApplicationId = "EFXR24zTZGMEf3EZ8WCAPdNGEh9eISUXJ0RmHQI6";
    data._JavaScriptKey = "e4feSQABtV0hI1xOc0bxclhaaDwmZwXc8M5MBJ5c";
    delete data.name;

    return JSON.stringify(data);
}

export function sendData(data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://api.parse.com/1/classes/' + data.name, true);
    xhr.addEventListener('readystatechange', function(e) {
        if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 300) {
            callback(xhr.responseText);
        }
    }, false);

    xhr.send(addExtraInfo(data));
}

