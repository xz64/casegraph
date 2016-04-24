'use strict';
var $ = require('jquery');
require('multiple-select/multiple-select.css');
require('multiple-select');
var _ = require('lodash');
var graph = require('./graph.js');
var filterList = require('../templates/filterList.jade');

function getSelectedOwners() {
  return $('#filterListSelect option:selected').map(function(d) {
    return this.value;}).get();
}

function getFilteredData(data) {
  var newOwners = getSelectedOwners();
  return  _.filter(data, function(d) {
    return newOwners.indexOf(d.owner) > -1;
  });
}

function renderFilteredData(data) {
  data = data || this.graphData;
  graph.replaceData(getFilteredData(data));
}

module.exports = {
  render: function render(element, owners, graphData) {
    this.graphData = graphData;
    $(element).html(filterList({owners: owners}));
    $(element).children('select').multipleSelect({
      width: 300,
      onClose: renderFilteredData.bind(this)
    });
  }
};
