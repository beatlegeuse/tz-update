#!/usr/bin/env node

var log = require('verbalize');
var request = require('request-promise');
if (process.platform == 'linux')
    var tz = require('../lib/tz-update-linux.js');
else if (process.platform == 'win32')
    var tz = require('../lib/tz-update-windows.js');
else {
    log.error('Unsupported OS');
    process.exit(1);
}
var new_tz;

request({uri: 'http://freegeoip.net/json', json: true})
.then(res => {
  new_tz = res.time_zone;
  return tz.getTimezone();
})
.then(res => {
  var current_tz = res.stdout.trim();
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
  var current_tz = res.stdout.trim();
  log.info("Now set to: " + current_tz);
})
.catch(err => {
  log.error("Error retrieving current timezone:");
  log.error(err);
});
