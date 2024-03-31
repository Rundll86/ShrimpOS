const $ = require("jquery");
const ApiUrl = "http://localhost:25565";
function UrlJoin(...Target) {
    let res = ApiUrl;
    for (let i = 0; i < Target.length; i++) {
        res += "/";
        res += Target[i];
    };
    return res;
};
function Request(Url, Type = "get", Data = {}, Success = () => { }, Error = () => { }) {
    $.ajax({
        url: Url,
        type: Type,
        data: Data,
        success: Success,
        error: Error
    });
};
const Internet = { ApiUrl, UrlJoin, Request };
module.exports = Internet;