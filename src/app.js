'use strict';
var $ = require('jquery');
var _ = require('lodash');
var graph = require('./views/graph.js');
var mainPage = require('./templates/main.jade'); 
var dropdown = require('./dropdown.js');
var dataUtils = require('./helpers/data-utils.js');
var csvReader = require('./helpers/csv-reader.js');

var buckets = [0, 1, 2, 4, 7, 14, 30, 90];

function resizeGraph() {
  graph.resize();
}

function onFileData(err, data) {
  var owners = dataUtils.getOwners(data).sort();
  var graphData = dataUtils.getGraphData(data, buckets, 'createddate', 'date');
  var graphElement = $('#graph')[0];
  graph.init(graphElement);
  dropdown.render(document.getElementById('filterList'), owners, graphData);
  graph.render(graphData, buckets, 'createddate');
  $(window).on('resize', _.debounce(resizeGraph, 200));
}

$(document).ready(function domready() {
  document.body.innerHTML = mainPage();

  $('#file_upload').on('click', function() {
    var file = $('#file')[0].files[0];
    csvReader.readFile(file, onFileData);
  });
});
