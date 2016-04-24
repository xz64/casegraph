'use strict';
require('./styles/main.css');
var $ = require('jquery');
var _ = require('lodash');
var graph = require('./views/graph.js');
var mainPage = require('./templates/main.jade'); 
var dropdown = require('./views/dropdown.js');
var dataUtils = require('./helpers/data-utils.js');
var csvReader = require('./helpers/csv-reader.js');

var buckets = [0, 1, 2, 4, 7, 14, 30, 90];

var app = {
  resizeGraph: function resizeGraph() {
    graph.resize();
  },
  graphData: function graphData(data, metric) {
  },
  onFileData: function onFileData(err, data) {
    this.data = data;
    this.owners = dataUtils.getOwners(this.data).sort();
    this.graphData = dataUtils.getGraphData(this.data, buckets, 'createddate');
    this.categories = dataUtils.getBuckets(this.graphData);
    var graphElement = $('#graph')[0];
    graph.init(graphElement);
    dropdown.render(document.getElementById('filterList'), this.owners,
      this.graphData);
    graph.render(this.graphData, this.categories, 'createddate');
    $(window).on('resize', _.debounce(this.resizeGraph.bind(this), 200));
  }
};

$(document).ready(function domready() {
  document.body.innerHTML = mainPage();

  $('#file_upload').on('click', function() {
    var file = $('#file')[0].files[0];
    csvReader.readFile(file, app.onFileData.bind(app));
  });
});
