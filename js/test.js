







function funDownload(content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

function ddd() {
    const filename = response.headers['content-disposition'].match(
        /filename=(.*)/
    )[1];
    // 首先要创建一个 Blob 对象（表示不可变、原始数据的类文件对象）
    const blob = new Blob([response.data]);
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
        window.navigator.msSaveBlob(blob, decodeURI(filename))
    } else {
        let elink = document.createElement("a"); // 创建一个<a>标签
        elink.style.display = "none"; // 隐藏标签
        elink.href = window.URL.createObjectURL(blob); // 配置href，指向本地文件的内存地址
        elink.download = filename;
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink); // 移除<a>标签
    }
}