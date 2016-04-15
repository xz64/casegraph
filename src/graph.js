'use strict';
var _ = require('lodash');
var $ = require('jquery');
var d3 = require('d3');
var dataUtils = require('./dataUtils.js');

function setupMargins(element, width, height, margin) {
  return d3.select(element)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

function setupScales(xPoints, yMax, graphWidth, graphHeight, barCategories) {
  this.x = d3.scale.ordinal()
    .domain(xPoints)
    .rangeRoundBands([0, graphWidth], 0.1);
  this.y = d3.scale.linear()
   .domain([0, yMax])
   .rangeRound([graphHeight, 0]);
  this.color = d3.scale.category20().domain(barCategories);
}

function setupAxes() {
  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient('bottom')
    .tickFormat(function(d) {
      return d;
    });
  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .orient('left');
}

function drawAxes(graphElement, graphHeight) {
  graphElement.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + graphHeight + ')')
    .call(this.xAxis)
    .selectAll('text')
      .style('text-anchor', 'start')
      .attr('x', 9)
      .attr('y', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(90 0 0)');
  graphElement.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis);
}

function drawBars(graphElement, data) {
  var column = graphElement.selectAll('.column')
    .data(data)
    .enter().append('g')
    .attr('transform', function(d) { return 'translate(' + this.x(d.owner) +
      ',0)'; }.bind(this));

  column.selectAll('rect')
    .data(function(d) { return d.bucketedCases; })
    .enter().append('rect')
    .attr('width', this.x.rangeBand())
    .attr('y', function(d) { return this.y(d.y1); }.bind(this))
    .attr('height', function(d) { return this.y(d.y0) -
      this.y(d.y1); }.bind(this))
    .style('fill', function(d) { return this.color(d.name); }.bind(this));

  column
    .append('text')
    .attr('text-anchor','middle')
    .text(function(d) { return d.bucketedCases[d.bucketedCases.length-1].y1;})
    .attr('y', function(d) {
      var yVal = d.bucketedCases[d.bucketedCases.length-1].y1;
      return this.y(yVal+1);
    }.bind(this))
    .attr('x', function(d) {
      return this.x.rangeBand()/2;
    }.bind(this))
    .attr('class','totalcount');
}

module.exports = {
  init: function init(element, width) {
    $(element).empty();
    width = width || element.parentNode.clientWidth;
    this.width = width > 960 ? width : 960;
    this.height = 500;
    this.margin = {top: 20, right: 10, bottom: 200, left: 50};
    this.graphWidth = this.width - this.margin.left - this.margin.right;
    this.graphHeight = this.height - this.margin.top - this.margin.bottom;
    this.element = element;
    this.graphElement = setupMargins(element, this.width, this.height,
      this.margin);
  },
  render: function render(graphData, buckets) {
    this.graphData = graphData;
    this.buckets = buckets;
    setupScales.call(this, _.map(this.graphData, 'owner'),
      _.sumBy(this.graphData[0].bucketedCases, 'cases.length'), this.graphWidth,
      this.graphHeight, this.buckets);
    setupAxes.call(this);
    drawAxes.call(this, this.graphElement, this.graphHeight);
    drawBars.call(this, this.graphElement, this.graphData);
  },
  resize: function resize() {
    this.init(this.element);
    this.render(this.graphData, this.buckets);
  }
};
