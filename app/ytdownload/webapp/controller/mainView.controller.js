sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BusyIndicator, MessageBox, JSONModel) {
        "use strict";

        const VID_INFO_URL = '/odata/v4/ytdownload/getVideoInfo';
        const DOWNLOAD_URL = '/odata/v4/ytdownload/downloadVid';

        return Controller.extend("com.raunak.ytdownload.controller.mainView", {
            onInit: function () {
                //Attaching onclick event to the input control
                const srchInput = this.getView().byId("inputText");
                srchInput.attachBrowserEvent("click", this.onSrchInputClick, this);

                //model for controlling the visibility of the Thumbnail
                let thumbnailModel = new JSONModel();
                thumbnailModel.setData({
                    imgSource: '',
                    visible: false,
                    videoTitle: '',
                    videoLength: '',
                })
                this.getView().setModel(thumbnailModel, 'thumbnailModel');

            },
            //TODO - Implement a function where the search bar can directly take the copied url when cliked
            async onSrchInputClick(oEvent) {
                // var oInput = oEvent.getSource();
                // var clipboardData = window.clipboardData || event.clipboardData;
                // var clipboardData = window.clipboardData || oEvent.originalEvent.clipboardData;
                // var clipboardText = clipboardData.getData('Text');
                // oInput.setValue(clipboardText);

                // navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
                //     if (result.state === "granted" || result.state === "prompt") {
                //         // The user has granted permission to access the clipboard.
                //     } else {
                //         // The user has denied permission to access the clipboard.
                //     }
                // });

                // const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
                // const permissionStatus = await navigator.permissions.query(queryOpts);
                // // Will be 'granted', 'denied' or 'prompt':
                // console.log(permissionStatus.state);

                // const permissionName = 'clipboard-read'; // Or 'clipboard-write' for writing

                // navigator.permissions.query({ name: permissionName })
                //     .then(result => {
                //         if (result.state === 'granted' || result.state === 'prompt') {
                //             // Permission was granted or prompt is shown to the user
                //             // You can now use the clipboard API to read or write data
                //         } else if (result.state === 'denied') {
                //             // Permission was denied by the user
                //             console.log("Clipboard access denied by the user.");
                //         }
                //     })
                //     .catch(err => {
                //         console.error('Error requesting clipboard permission:', err);
                //     });
            },
            async onSearchClick(oEvent) {
                const srchInput = this.getView().byId("inputText");
                BusyIndicator.show(0);

                let srchInputValue = srchInput.getValue();
                let controller = this;

                $.ajax({
                    url: VID_INFO_URL,
                    method: "POST",
                    data: JSON.stringify({
                        url: srchInputValue,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    success: function (data) {
                        // Handle successful response
                        BusyIndicator.hide();

                        let thumbnailModel = controller.getView().getModel('thumbnailModel');
                        thumbnailModel.setData({
                            imgSource: data.thumbnail,
                            visible: true,
                            videoLength: data.length,
                            videoTitle: data.title
                        })
                        controller.getView().setModel(thumbnailModel, 'thumbnailModel')

                    },
                    error: function (jqXHR) {
                        // Handle error
                        BusyIndicator.hide();

                        let thumbnailModel = controller.getView().getModel('thumbnailModel');
                        thumbnailModel.setData({
                            imgSource: '',
                            visible: false,
                            videoLength: '',
                            videoTitle: ''
                        })
                        controller.getView().setModel(thumbnailModel, 'thumbnailModel')

                        const errRegex = /"message":"([^"]*)"/;
                        const errMsg = errRegex.exec(jqXHR.responseText);

                        MessageBox.error(errMsg[1]);
                    }
                });

            },
            onDownloadClick(oEvent) {
                BusyIndicator.show(0);

                let url = this.getView().byId('inputText').getValue();
                let title = this.getView().byId('vidTitleTxt').getText();

                $.ajax({
                    url: DOWNLOAD_URL,
                    method: 'POST',
                    data: JSON.stringify({
                        url: url,
                        title: title
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    success: (e) => {
                        BusyIndicator.hide();
                        console.log(e)
                    },
                    error: (e) => {
                        BusyIndicator.hide();
                        console.log(e)
                    }
                })
            }
        });
    });
