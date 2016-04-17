'use strict';
var $ = require('jquery');
require('multiple-select/multiple-select.css');
require('multiple-select');
var _ = require('lodash');
var graph = require('./graph.js');
var filterList = require('./templates/filterList.jade');

function getSelectedOwners() {
  return $('#filterListSelect option:selected').map(function(d) {
    return this.value;}).get();
}

function filterSelectedOwners(data) {
  var newOwners = getSelectedOwners();
  var filteredData = _.filter(data, function(d) {
    return newOwners.indexOf(d.owner) > -1;
  });
  graph.graphData = filteredData;
  _.debounce(graph.resize.bind(graph), 200)();
}

module.exports = {
  render: function render(element, owners, graphData) {
    $(element).html(filterList({owners: owners}));
    $(element).children('select').multipleSelect({
      width: 300,
      onClose: filterSelectedOwners.bind(null, graphData)
    });
  }
};
