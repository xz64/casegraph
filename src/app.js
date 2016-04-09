'use strict';
var domready = require('domready');
var mainPage = require('./templates/main.jade'); 

domready(function() {
  document.body.innerHTML = mainPage();
});
