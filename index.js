var program = require('commander');
var packageJson = require('./package.json');
var spawn = require('child_process').spawn;
var child;

var airportBin = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';
// Specific verion: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport'

var networkSetupBin = '/usr/sbin/networksetup';
var device = 'en0';

program
  .version(packageJson.version)
  .option('scan, list', 'List available networks')
  .option('preferred', 'List preferred networks')
  .option('preferred add <network name> <security type> [password]', 'Add preferred network')
  .option('preferred remove <network name>', 'Remove preferred network')
  .option('connect <ssid> [password]', 'Connect to network')
  .option('info', 'Display current network info')
  .option('power [on|off]', 'Turn wifi on or off')
  .option('disconnect', 'Disconnect from current network (may require root)')
  .option('channel [channel]', 'Change channel of current network (may require root)')
  .option('network', 'Display current network name')
  .option('hardwareports', 'List all hardware ports (useful for finding device interface name)')
  .option('--device [device]', 'Change the device interface (default is en0)')
  .parse(process.argv);

if (program.rawArgs.length <= 2) {
  program.outputHelp();
} else {

  if (program.device) {
    device = program.device;
  }

  if (program.list) {
    console.log('This may take a few seconds...\n');
    child = spawn(airportBin,
      ['scan']); // -s also works
  } else if (program.info) {
    child = spawn(airportBin,
      ['--getinfo']); // -I also works
  } else if (program.connect) {
    var ssid = program.connect;
    var password = program.args[0];
    console.log('This may take a few seconds...\n');
    child = spawn(networkSetupBin,
      ['-setairportnetwork', device, ssid].concat(password||[]));
  } else if (program.power) {
    var state = program.power;
    child = spawn(networkSetupBin,
      ['-setairportpower', device, state]);
  } else if (program.hardwareports) {
    child = spawn(networkSetupBin,
      ['-listallhardwareports']);
  } else if (program.network) {
    child = spawn(networkSetupBin,
      ['-getairportnetwork', device]);
  } else if (program.disconnect) {
    child = spawn(airportBin,
      ['--disassociate']); // -z also works
  } else if (program.channel) {
    var channel = program.channel;
    child = spawn(airportBin,
      ['--channel'.concat(channel ? '=' + channel : '')]); // -c also works
  } else if (program.preferred) {
    if (program.add) {
      var network = program.add;
      var securityType = program.args[0];
      var password = program.args[1];
      var index = 0;
      child = spawn(networkSetupBin,
        ['-addpreferredwirelessnetworkatindex', device, network, index, securityType].concat(password||[]));
    } else if (program.remove) {
      var network = program.remove;
      if (network === 'all') {
        child = spawn(networkSetupBin,
          ['-removeallpreferredwirelessnetworks', device]);
      } else {
        child = spawn(networkSetupBin,
          ['-removepreferredwirelessnetwork', device, network]);
      }
    } else {
      child = spawn(networkSetupBin,
        ['-listpreferredwirelessnetworks', device]);
    }
  } else {
    program.outputHelp();
  }
}

if (child) {
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
