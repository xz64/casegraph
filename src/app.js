'use strict';
var $ = require('jquery');
var _ = require('lodash');
var graph = require('./graph.js');
var mainPage = require('./templates/main.jade'); 
var dropdown = require('./dropdown.js');
var dataUtils = require('./dataUtils.js');

function resizeGraph() {
  graph.resize();
}

$(document).ready(function domready() {
  document.body.innerHTML = mainPage();
  var graphElement = $('#graph')[0];
  graph.init(graphElement);
  dropdown.render(document.getElementById('filterList', [], {}));
  $(window).on('resize', _.debounce(resizeGraph, 200));
});
