/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4, regexp: false */
/*global window: false, document: false, io: false, BlobBuilder: false,
  Worker: false */

document.addEventListener('DOMContentLoaded', function () {

    var log = function () {
        if (window.console && console.log && console.log.apply) {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        }
    };

    log('start chat app client');

    var messages = document.querySelector('#messages');

    var onResize = function () {
        messages.style.height = (window.innerHeight - 30) + 'px';
    };
    window.onresize = onResize;
    onResize();

    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder || window.MozBlobBuilder;

    var getWorkerFromString = function (str) {
        log('creating new worker');
        var bb = new BlobBuilder();
        bb.append(str);
        return new Worker(window.URL.createObjectURL(bb.getBlob()));
    };

    var addMessage = function (msg) {
        var item = document.createElement('li');
        var now = new Date();
        var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        item.textContent = time + ' ' + msg;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    };

    var socket = io.connect('http://localhost:8080/');
    socket.on('message', addMessage);

    var worker = getWorkerFromString(document.querySelector('#workerbot').textContent);
    worker.onmessage = function (e) {
        var msg = 'bot answer to ' + e.data.cmd + ' ' + e.data.args + ': ' + e.data.result;
        socket.send(msg);
        addMessage(msg);
    };

    var form = document.querySelector('form');
    var input = document.querySelector('input');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var msg = input.value;

        var botRe = /^bot: (\S+)\s?(.*)$/;
        var parts = botRe.exec(msg);

        if (parts) {
            // message for the bot
            log('sending msg to bot');
            worker.postMessage({
                cmd: parts[1],
                args: parts[2]
            });
        }

        socket.send(msg);
        addMessage(msg);
        input.value = '';
        return false;
    });

});
