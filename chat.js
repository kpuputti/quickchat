/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4 */
/*global window: false, document: false, io: false */

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

    var addMessage = function (msg) {
        var item = document.createElement('li');
        var now = new Date();
        var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        item.innerHTML = time + ' ' + msg;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    };

    var socket = io.connect('http://localhost:8080/');
    socket.on('message', addMessage);

    var form = document.querySelector('form');
    var input = document.querySelector('input');

    form.addEventListener('submit', function (e) {
        var msg = input.value;
        socket.send(msg);
        addMessage(msg);
        input.value = '';
        e.preventDefault();
        return false;
    });

});
