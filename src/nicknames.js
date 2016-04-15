'use strict';
var _ = require('lodash');

function getFirstName(name) {
  return name.split(' ')[0];
}

function getLastName(name) {
  var tokens = name.split(' ');
  return tokens[tokens.length-1];
}

function createNickname(name) {
  return getFirstName(name);
}

module.exports = {
  init: function init(names) {
    var nicknames = _.map(names, createNickname);
    this.nameMap = _.zipObject(names, nicknames);
    this.init = null;
  },
  getNickname: function getNickname(name) {
    return this.nameMap[name] || name;
  }
};
