'use strict';
var _ = require('lodash');
var graph = require('./graph.js');
var mainPage = require('./templates/main.jade'); 
var dataUtils = require('./dataUtils.js');

function resizeGraph() {
  graph.resize();
}

$(document).ready(function() {
  document.body.innerHTML = mainPage();
  var graphElement = $('#graph')[0];
  graph.init(graphElement);
  $(window).on('resize', _.debounce(resizeGraph, 200));
});
