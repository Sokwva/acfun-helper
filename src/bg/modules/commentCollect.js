/**
 * 评论收藏
 */
class CommentCollect {
    constructor() {
        this.storeSvrAdd = "http://localhost:12709";
        // this.storeSvrAdd = await getStorage("MarkedComment").then(res => { return res.MarkedComment.setting.storeLocation });
        this.storeMethod = 4;
        // this.storeMethod = await getStorage("MarkedComment").then(res => { return this.judgeStoreMethod(res.MarkedComment.setting.storeLocation) })
        this.CcDriver = new CommentCollectStore(this.storeSvrAdd, this.storeMethod);
    }

    judgeStoreMethod() {
        if (this.storeMethod === "ExtensionStore") {
            return 0;
        } else if (
            new RegExp("http://.*").test(this.storeMethod)
        ) {
            return 4;
        }
    }

    async writeIn(innerCommentId = -1, data = {}) {
        if (data) {
            const result = await this.CcDriver.writeIn(innerCommentId, data);
            if (result.status == 0) {
                return true;
            } else {
                return false;
            }
        }
    }

}

class CommentCollectStore {
    constructor(server = "http://localhost:12709", method) {
        this.storeMethod = method;
        this.apiServer = server;
        this.connectType = "http";
    }

    /**
     * 
     * @param {*} innerCommentId 内部记录ID，若为-1，则服务端自行安排
     * @param {*} data 
     * @example [innerCommentId] = { "POuid": POuid, "POname": POname, "contentHtml": contentHtml, "commentId": commentId, "url": url, "describe": describe, "masterLayerCtnt": "", "masterLayerPO": "", "masterLayerPOuid": -1 }
     * @returns statusJson
     */
    async writeIn(innerCommentId = -1, data = {}) {
        switch (this.storeMethod) {
            case 0:
                // chrome.storage.local.set({ "MarkedComment": rawStore.MarkedComment });
                break;
            case 4:
                let uploadComcol = new FormData();
                if (innerCommentId != -1) {
                    uploadComcol.append("innerCommentId", innerCommentId);
                }
                uploadComcol.append("data", `${JSON.stringify(data)}`);
                const resp = await fetch(
                    this.apiServer,
                    {
                        body: uploadComcol,
                        method: "POST"
                    }
                );
                return await resp.json();
        }
    }

    readOut(relateName = {}) {

    }


}