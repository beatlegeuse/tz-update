var exec = require('child-process-promise').exec;

exports.getTimezone = function() {
    return exec('echo $TZ').then(res => {
        if (res.stdout && res.stdout.trim() == '')
	    return exec('cat /etc/timezone');
	else
	    return Promise.resolve(res);
    });
};

exports.setTimezone = function(timezone) {
    return exec('export TZ=' + timezone).then(res => {
	return exec('timedatectl set-timezone ' + timezone);
    });
};
