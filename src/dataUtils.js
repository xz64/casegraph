var _ = require('lodash');
var moment = require('moment');
var getNicknames = require('./nicknames.js');

function daysSince(date) {
  return moment().diff(date, 'days');
}

function daysSinceBucket(days, buckets) {
  for(i = buckets.length - 1; i >= 0; i--) {
    if(days >= buckets[i]) {
      return buckets[i];
    }
  }
  return buckets[0];
}

function daysSinceMetric(case_item, buckets, metric) {
  return daysSinceBucket(daysSince(case_item[metric]), buckets);
}

module.exports = {
  getOwners: function getOwners(caselist) {
    return _(caselist)
      .map('assignedto')
      .uniq()
      .value();
  },
  groupByOwner: function groupByOwner(caselist) {
    return _.groupBy(caselist, function(o) {
      return o.assignedto;
    });
  },
  groupByOwnerCaseDate: function groupByOwnerCaseDate(caselistByOwner,
    buckets, metric) {
    return _.mapValues(caselistByOwner, function(cases) {
      return _.groupBy(cases, _.bind(daysSinceMetric, null, _,
        buckets, metric));
    });
  },
  groupByOwnerStatus: function groupByOwnerStatus(caselistByOwner) {
    return _.mapValues(caselistByOwner, function(cases) {
      return _.keyBy(cases, 'status');
    });
  }
};
