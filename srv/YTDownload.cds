type downloadResponse : {
    thumbnail : String;
    length    : String;
    title     : String;
}

service YTDownload {

    action getVideoInfo(url : String)                returns downloadResponse;
    action downloadVid(url : String, title : String) returns String;

}
