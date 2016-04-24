'use strict';
var _ = require('lodash');
var $ = require('jquery');
require('qtip2/dist/jquery.qtip.css');
require('../styles/qtip-styles.css');
require('qtip2/dist/jquery.qtip.js');
require('../styles/graph-styles.css');
var d3 = require('d3');
var dataUtils = require('../helpers/data-utils.js');
var tooltip = require('../templates/tooltip.jade');

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
  this.xPercent = d3.scale.ordinal()
    .domain(xPoints)
    .rangePoints([0, 1]);
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
    .orient('left')
    .tickFormat(d3.format('d'));
}

function drawAxes(graphElement, graphHeight, margin) {
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
    .call(this.yAxis)
    .append('text')
    .attr('class', 'y axis label')
    .attr('text-anchor', 'middle')
    .attr('transform', function() {
      var xValue = margin.left * -0.75;
      var yValue = this.parentNode.getBBox().height / 2;
      return 'translate(' + xValue + ',' + yValue + ') rotate(-90)';
    })
    .text('Cases');
}

function formatMetric(metric, owner, value, bucket) {
  var title = '';
  switch(metric) {
    case 'createddate':
      title = owner + ': ' + value + ' cases created over ' + bucket +
        ' days ago';
      break;
    case 'lastmessagedate':
      title = owner + ': ' + value + ' cases last externally messaged ' +
        bucket + ' days ago';
      break;
    default:
      title = owner + ': ' + value + ' cases with ' + bucket + ' ' + metric;
      break;
  }
  return title;
}

function drawBars(graphElement, data, xPercent, metric) {
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
    .style('fill', function(d) { return this.color(d.name); }.bind(this))
    .each(function(d) {
      var parentData = d3.select(this.parentNode).datum();
      var title = formatMetric(metric, parentData.owner, d.cases.length,
        d.name);
      var my = xPercent(parentData.owner) <= 0.5 ? 'top left' : 'bottom right';
      var at = xPercent(parentData.owner) <= 0.5 ? 'bottom right' : 'top left';
      $(this).qtip({
        content: {
          title: title,
          text: tooltip({cases: d.cases}),
          button: true
        },
        position: {
          my: my,
          at: at,
          target: 'mouse',
          adjust: { mouse: false }
        },
        show: { solo: true },
        hide: { fixed: true, delay: 500 },
        style: { classes: 'qtip-light' }
      });
    });

  column
    .append('text')
    .attr('text-anchor','middle')
    .text(function(d) { return d.bucketedCases[d.bucketedCases.length-1].y1;})
    .attr('y', function(d) {
      var yVal = d.bucketedCases[d.bucketedCases.length-1].y1;
      return this.y(yVal) - 2;
    }.bind(this))
    .attr('x', function(d) {
      return this.x.rangeBand()/2;
    }.bind(this))
    .attr('class','totalcount');
}

function drawLegend(graphElement, buckets) {
  var boxSize = 18;
  var legendOffset = 200;
  var legend = graphElement.selectAll('.legend')
    .data(buckets.slice().reverse())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      return 'translate(0,' + i * (boxSize + 2) + ')';
    });

  legend.append('rect')
    .attr('x', this.width - legendOffset)
    .attr('width', boxSize)
    .attr('height', boxSize)
    .style('fill', this.color)
    .style('stroke', 'black')

  legend.append('text')
    .attr('x', this.width - legendOffset + 1.1 * boxSize)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(function(d) { return d + ' days'; });
}

module.exports = {
  init: function init(element, width) {
    $(element).empty();
    width = width || element.parentNode.clientWidth;
    this.width = width > 960 ? width : 960;
    this.height = 500;
    this.margin = {top: 50, right: 10, bottom: 200, left: 50};
    this.graphWidth = this.width - this.margin.left - this.margin.right;
    this.graphHeight = this.height - this.margin.top - this.margin.bottom;
    this.element = element;
    this.graphElement = setupMargins(element, this.width, this.height,
      this.margin);
  },
  render: function render(graphData, buckets, metric) {
    this.graphData = graphData;
    this.buckets = buckets;
    this.metric = metric;
    setupScales.call(this, _.map(this.graphData, 'owner'),
      _.sumBy(this.graphData[0].bucketedCases, 'cases.length'), this.graphWidth,
      this.graphHeight, this.buckets);
    setupAxes.call(this);
    drawAxes.call(this, this.graphElement, this.graphHeight, this.margin);
    drawBars.call(this, this.graphElement, this.graphData, this.xPercent,
      this.metric);
    drawLegend.call(this, this.graphElement, this.buckets);
  },
  resize: function resize() {
    this.init(this.element);
    this.render(this.graphData, this.buckets, this.metric);
  }
};
