'use strict';
var Papa = require('papaparse');
var moment = require('moment');

function parseDate(date, fallbackDate) {
  return date.trim() ? 
  moment(date, 'M/D/YYYY h:mm a').toISOString() : 
  moment(fallbackDate, 'M/D/YYYY h:mm a').toISOString();
}

function parseOptionalString(string) {
  return string.trim() ? string : 'Unspecified';
}

function readFile(file, cb) {
  var reader = new FileReader();
  reader.onload = function onload() {
    var result = [];
    var content = reader.result.split('\n').slice(5).join('\n');
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      step: function step(results, parser) {
        var row = results.data[0];
        result.push({
          id: row['Internal ID'],
          assignedto: row['Assigned To'],
          createddate: parseDate(row['Date Created'], null),
          lastmessagedate: parseDate(row['Last Msg. Date'],
            row['Date Created']),
          number: row['Number'],
          product: parseOptionalString(row['Product UF']),
          subject: row['Subject'],
          status: row['Status'],
          severity: row['Severity'],
          priority: row['Priority']
        });
      },
      complete: function(results, file) {
        cb(null, result);
      }
    });
  };
  reader.readAsText(file, 'utf8');
}

module.exports = {
  readFile: readFile
};
