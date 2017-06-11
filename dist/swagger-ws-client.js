/**
 * This is the ugliest possible way to provide websocket support in Swagger UI
 * I want a quick way to document my Streaming APIs and to be able to echo test them
 * Will make this better some day (like all other projects!)
 */

function log(message) {
  console.log(message);
}

function SwaggerWSClient(config) {
  var defaultConfig = {
    executeBtnSelector: '.execute',
    bodySelector: 'body-param__text',
    onopen: log,
    onmessage: log,
    onerror: log,
    onclose: log
  };
  this.config = $.extend(defaultConfig, config);
}

SwaggerWSClient.prototype.bindUIEvents = function() {
  var that = this;
  var $executeBtn = $(this.config.executeBtnSelector);
  $executeBtn.off('click');
  $executeBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $bodyElem = $(e.target).closest('.opblock-body').find('.body-param__text');
    var body = $bodyElem.html();
    that.send(body);
  });
};

SwaggerWSClient.prototype.connect = function(url) {
  this.ws = new WebSocket(url);

  this.ws.onopen = this.config.onopen;
  this.ws.onerror = this.config.onerror;
  this.ws.onmessage = this.config.onmessage;
  this.ws.onclose = this.config.onclose;
};

/**
 * Stream the message over the connected websocket
 * @param message
 * TODO: validate message structure
 * TODO: Do we need double escaping?
 */
SwaggerWSClient.prototype.send = function(message) {
  var payload = JSON.stringify(message)
  this.ws.send(payload);
  var htm = '<tr><td>'+payload+'</td><td>&nbsp;</td></tr>';
  $('#table-ws-communication').append(htm);
};

window.SwaggerWSClient = SwaggerWSClient;
