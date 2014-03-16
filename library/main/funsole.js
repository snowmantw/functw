(function() {
'use strict';
var Funsole = function() {
  this.initElements();
};
Funsole.prototype = {
  states: {
    proxies: {},
    widgets: {}
  },
  configs: {
    eventPrefix: 'funsole',
    events: [
      'funsole-proxy-request-register',
      'funsole-proxy-request-unregister',
      'funsole-widget-register',
      'funsole-widget-unregister'
    ]
  },
  elements: {
    funsole: null
  }
};

Funsole.prototype.handleEvent = function(evt) {
  switch(evt.type) {
    case 'funsole-proxy-request-register':
      this.registerProxy(evt.detail.language, evt.detail.proxy);
      break;
    case 'funsole-proxy-request-unregister':
      this.unregisterProxy(evt.detail.language);
      break;
    case 'funsole-widget-register':
      this.registerWidget(evt.detail.name, evt.detail.widget);
      break;
    case 'funsole-widget-unregister':
      this.registerWidget(evt.detail.name);
      break;
  }
};

Funsole.prototype.initElements = function() {
  Object.keys(this.elements).forEach((function(id) {
    this.elements[id] = document.getElementById(id);
    if (!this.elements[id]) {
      throw new Error('No such element required by funsole: ' + id);
    }
  }).bind(this));
};

Funsole.prototype.initEvents = function() {
  this.configs.events.forEach((function(etype) {
    window.addEventListener(etype, this);
    this.debug('listen to event: ', etype);
  }).bind(this));
};

Funsole.prototype.suspendEvents = function() {
  this.configs.events.forEach((function(etype) {
    window.removeEventListener(etype, this);
    this.debug('no longer listen to event: ', etype);
  }).bind(this));
};

Funsole.prototype.registerWidget = function(name, widget) {
  this.states.widgets[name] = widget;
  this.publish('widget-registered', {
    'name': name,
    'widget': widget
  });
  this.debug('widget registered', name);
};

Funsole.prototype.unregisterWidget = function(name) {
  if (!this.states.widgets[name]) {
    this.debug('can\'t handle inexisting widget: ', name);
    return;
  }
  this.publish('widget-unregistered', {
    'name': name,
    'widget': this.states.widgets[name]
  });
  delete this.states.widgets[name];
  this.debug('widget unregistered', name);
};

Funsole.prototype.registerProxy = function(language, proxy) {
  this.states.proxies[language] = proxy;
  this.publish('proxy-registered', {
    'language': language,
    'proxy': proxy
  });
  this.debug('proxy registered: ', language);
};

Funsole.prototype.unregisterProxy = function(language) {
  this.publish('proxy-unregistered', {
    'language': language,
    'proxy': this.states.proxies[language]
  });
  delete this.states.proxies[language];
  this.debug('proxy unregistered: ', language);
};

Funsole.prototype.debug = function(msg, detail) {
  console.log('>>' + msg, detail);
};

Funsole.prototype.publish = function(etype, detail) {
  var e = new CustomEvent(this.configs.eventPrefix + '-' + etype,
      { 'detail': detail });
  window.dispatchEvent(e);
};

})();
