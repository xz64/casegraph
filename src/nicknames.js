'use strict';
var _ = require('lodash');

function getNickname(name) {
  return name.split(' ')[0];
}

module.exports = function(names) {
  var nicknames = _.map(getNickname);
  return _.zipObject(names, nicknames);
}
