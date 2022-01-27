// 客户端
var ws2 = new WebSocket('ws://localhost:9999');
ws2.onopen = function() {
  console.log('open');
  ws2.send('hello');
  ws2.send(888);
};
ws2.onmessage = function(evt) {
  console.log('message:', evt.data)
};
ws2.onclose = function(evt) {
  console.log('close');
};
