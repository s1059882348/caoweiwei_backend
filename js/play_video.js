function PlayVideo(obj) {

    var video_id = '';
    if (!(obj && obj.url && obj.el)) throw '参数这样=>{key,url,el,pre_url,preview_encrypt}';

    function uid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    }

    function getURL(content) {
        return URL.createObjectURL(new File([new Blob([content], {
            type: 'audio/mpegurl'
        })],
            uid() + ".m3u8", {
                type: 'application/vnd.apple.mpegurl'
            }));
    }

    function getUrlBlob(m) {
        var r = new XMLHttpRequest();

        if (!m.whole && obj.preview_encrypt == 0) {
            r.open("GET", m.pre_url, true);
            r.responseType = "arraybuffer";
            var name = m.pre_url.substring(m.pre_url.lastIndexOf('/') + 1);
        } else {
            r.open("GET", m.url, true);
            r.responseType = "text";
        }

        r.onload = function (e) {
            var u = this.responseURL;
            u = u.substr(0, u.lastIndexOf('/') + 1);
            if (this.status == 200) {
                var m3u8key_url, is_m3u8;
                if (!m.whole && obj.preview_encrypt == 0) {
                    is_m3u8 = false;
                    var buffer = new Uint8Array(this.response);
                    for (let i = 0; i < buffer.length; i++) {
                        buffer[i] = buffer[i] ^ name[0].charCodeAt();
                    }
                    m3u8key_url = URL.createObjectURL(new Blob([buffer]));
                } else {
                    is_m3u8 = true;
                    var file = new File([obj.key], "key.key", {
                        type: "text/plain"
                    });
                    var key_url = URL.createObjectURL(file);
                    var wholem3u8 = this.response.replace("msty://meces/enc.key", key_url).replace(
                        /([^\n]+(\.m3u8|\.ts))/g, u + "$1");
                    var wholem3u8key_url = getURL(wholem3u8);
                    var m3u8 = (wholem3u8.substr(0, wholem3u8.indexOf('.ts') + 3) + "\n#EXT-X-ENDLIST").replace(
                        /([^\n]+(\.m3u8|\.ts))/g, m.pre_url);
                    m3u8key_url = getURL(m3u8);
                }

                m.fn(m.whole ? wholem3u8key_url : m3u8key_url, is_m3u8);
            }
        };
        r.send(null);
    };
    var player, _url;

    function play(url, is_m3u8) {
        var id = uid();
        player && player.dispose();
        obj.el.innerHTML = `<video
            id="_${id}"
            class="video-js"
            controls
            autoplay="true"
            preload="auto"
            width="${obj.el.style.width}"
            height="${obj.el.style.height}"
            data-setup="{}">
            <source id="source" src="${url}" type="application/x-mpegURL"/>
            <source src="${url}" type="video/mp4"/>
          </video>`;
        video_id = `_${id}`;
        if (is_m3u8) {
            player = videojs(`_${id}`, {playbackRates: [1, 1.5, 2, 4, 8]});
            player.ready(function () {
                this.play();
            });
        }
    }

    this.play = function () {
        getUrlBlob({
            url: obj.url,
            pre_url: obj.pre_url,
            fn: play
        });
    }
    this.wholePlay = function () {
        getUrlBlob({
            url: obj.url,
            whole: true,
            fn: play
        });
    }
    this.getPlayer = function () {
        return player;
    }


////////////////////////////////////////////////////////////////////////////////////

    //reurn false 禁止函数内部执行其他的事件或者方法
    var vol = 0.1;  //1代表100%音量，每次增减0.1
    var time = 10; //单位秒，每次增减10秒
    document.onkeyup = function (event) {//键盘事件

        //console.log(videoElement.paused);
        var videoElement = document.getElementById(video_id + '_html5_api');

        console.log("keyCode:" + event.keyCode);
        var e = event || window.event || arguments.callee.caller.arguments[0];

        //鼠标上下键控制视频音量
        if (e && e.keyCode === 38) {

            // 按 向上键
            videoElement.volume !== 1 ? videoElement.volume += vol : 1;
            return false;

        } else if (e && e.keyCode === 40) {

            // 按 向下键
            videoElement.volume !== 0 ? videoElement.volume -= vol : 1;
            return false;

        } else if (e && e.keyCode === 37) {
            // 按 向左键
            videoElement.currentTime !== 0 ? videoElement.currentTime -= time : 1;
            return false;
        } else if (e && e.keyCode === 39) {
            // 按 向右键
            videoElement.volume !== videoElement.duration ? videoElement.currentTime += time : 1;

        } else if (e && e.keyCode === 32) {
            // 按空格键 判断当前是否暂停
            videoElement.paused === true ? videoElement.play() : videoElement.pause();
            return false;
        }
    };
}