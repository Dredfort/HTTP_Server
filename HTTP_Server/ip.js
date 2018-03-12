var
    // Local ip address that we're trying to calculate
    address
    // Provides a few basic operating-system related utility functions (built-in)
    ,os = require('os')
    // Network interfaces
    ,ifaces = os.networkInterfaces();

var getIP = function () {
    
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
            }
            ++alias;
        });
    });
};

var getLocalIP = function(){
    
    // Iterate over interfaces ...
    for (var dev in ifaces) {

        // ... and find the one that matches the criteria
        var iface = ifaces[dev].filter(function (details) {
            return details.family === 'IPv4' && details.internal === false;
        });

        if (iface.length > 0) address = iface[0].address;
    }

    return address;
};

exports.getIP = getIP;
exports.getLocalIP = getLocalIP;

