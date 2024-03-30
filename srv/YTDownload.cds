type downloadResponse : {
    thumbnail : String;
    length    : String;
    title     : String;
}

service YTDownload {

    action download(url : String) returns downloadResponse;

}
