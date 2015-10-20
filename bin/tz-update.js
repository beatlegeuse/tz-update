#!/usr/bin/env node

var log = require('verbalize');
var request = require('request-promise');
var tz = require('../lib/tz-update-windows.js');
var new_tz;

request({uri: 'http://freegeoip.net/json', json: true})
.then(res => {
  new_tz = res.time_zone;
  return tz.getTimezone();
})
.then(res => {
  var current_tz = res.stdout;
  if (res.stdout != new_tz) {
    log.info("Previously: " + current_tz);
    return tz.setTimezone(new_tz);
  }
})
.then(res => {
  if (!res.stderr) {
    return tz.getTimezone();
  }  
})
.then(res => {
  var current_tz = res.stdout;
  log.info("Now set to: " + current_tz);
})
.catch(err => {
  log.error("Error retrieving current timezone:");
  log.error(err);
});