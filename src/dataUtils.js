'use strict';
var _ = require('lodash');
var moment = require('moment');
var nicknames = require('./nicknames.js');

function daysSince(date) {
  return moment().diff(date, 'days');
}

function getDayBucket(days, buckets) {
  for(var i = buckets.length - 1; i >= 0; i--) {
    if(days >= buckets[i]) {
      return buckets[i];
    }
  }
  return buckets[0];
}

function daysSinceMetric(case_item, buckets, metric) {
  return getDayBucket(daysSince(case_item[metric]), buckets);
}

function getOwners(caselist) {
  return _(caselist)
    .map('assignedto')
    .uniq()
    .value();
}

function groupByOwner(caselist) {
  return _(caselist)
    .groupBy('assignedto')
    .toPairs()
    .map(function(d) {
      return { owner: d[0], cases: d[1] };
    })
    .sortBy('cases.length')
    .reverse()
    .value();
}

function groupByOwnerDateMetric(caselistByOwner, buckets, metric) {
  return _.map(caselistByOwner, function(ownerdata) {
    var val = {};
    val.owner = ownerdata.owner;
    val.bucketedCases = groupByBuckets(ownerdata.cases,
      buckets, metric);
    return val;
  });
}

function groupByOwnerTextMetric(caselistByOwner,
  metric) {
  return _.mapValues(caselistByOwner, function(cases) {
    return _.keyBy(cases, metric);
  });
}

function populateYCoordinates(data, attr) {
  _.forEach(data, function(ownerdata) {
    var total = 0;
    _.forEach(ownerdata.bucketedCases, function(caseBucket) {
      caseBucket.y0 = total;
      caseBucket.y1 = (total += caseBucket.cases.length);
    });
  });
}

function populateNicknames(caselistByOwner) {
  nicknames.init && nicknames.init(_.map(caselistByOwner, 'owner'));
  _.forEach(caselistByOwner, function(ownerdata) {
    ownerdata.owner_nickname = nicknames.getNickname(ownerdata.owner);
  });
}

function groupByBuckets(cases, buckets, metric) {
  var casesByBucket =  _(cases)
    .groupBy(_.bind(daysSinceMetric, null, _, buckets, metric))
    .toPairs()
    .sortBy(function(o) { return +o[0]; })
    .map(function(d) {
      return { name: d[0] + ' days', cases: d[1] };
    })
    .value();
  return casesByBucket;
}

module.exports = {
  getGraphData: function getGraphData(data, buckets, metric) {
    var caselistByOwner = groupByOwner(data);
    var result = groupByOwnerDateMetric(caselistByOwner, buckets, metric);
    populateYCoordinates(result);
    populateNicknames(result);
    return result;
  },
  filterByOwner: function filterByOwner(data, owners) {
    return data.filter(function(d) {
      return owners.indexOf(d.owner) > -1;
    });
  }
};
