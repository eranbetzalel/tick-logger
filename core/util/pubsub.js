var topicCallbacks = {};

exports.subscribe = function (topic, callback, context) {
  var topicCallback = topicCallbacks[topic];

  var bindedCallback = callback.bind(context);

  if(!topicCallback) {
    topicCallback = [ bindedCallback ];

    topicCallbacks[topic] = topicCallback;
  }
  else {
    topicCallback.push(bindedCallback);
  }

  return function () {
    var topicCallbackIndex = topicCallback.indexOf(callback);

    if (topicCallbackIndex > -1)
      topicCallback.splice(topicCallbackIndex, 1);
  }
}

exports.createTopicPublisher = function (topic) {
  return function topicPublisher() {
    publish(topic, arguments);
  };
}

function publish(topic, args) {
  var topicCallback = topicCallbacks[topic];

  if(!topicCallback)
    return;

  for(var i = 0; i < topicCallback.length; i++) {
    topicCallback[i].apply(null, args);
  }
}