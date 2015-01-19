var program = require('commander');
var packageJson = require('../package.json');
var spawn = require('child_process').spawn;
var child;

if (process.platform !== 'darwin') {
  throw new Error('Airdorme only supports Mac OS X at the moment.');
}

var airportBin = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';
// Specific verion: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport'

var networkSetupBin = '/usr/sbin/networksetup';

program
  .version(packageJson.version);

program
  .command('list')
  .alias('scan')
  .description('List available networks')
  .action(function(cmd, options) {
    console.log('This may take a few seconds...\n');
    child = spawn(airportBin,
      ['scan']); // -s also works
    output();
  });

program
  .command('preferred [action]')
  .description('List preferred networks. Or add or remove preferred network')
  .option('-d, --device [device]', 'Device interface to use (default is en0)')
  .option('-n, --network [network name]', 'Network name')
  .option('-p, --pasword [password]', 'Network password')
  .option('-s, --security [type]', 'Security type (default is wpa2')
  .option('--all', 'Remove all preferred networks')
  .action(function(action, options) {
    var network = options.network;
    var securityType = options.security || 'wpa2';
    var password = options.password;
    var index = 0;
    var device = options.device || 'en0';
    if (action === 'add') {
      child = spawn(networkSetupBin,
        ['-addpreferredwirelessnetworkatindex', device, network, index, securityType].concat(password||[]));
    } else if (action === 'remove') {
      if (options.all) {
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
    output();
  });

program
  .command('connect <ssid>')
  .description('Connect to network')
  .option('-d, --device [device]', 'Device interface to use (default is en0)')
  .option('-p, --password [password]', 'Network Password')
  .action(function(cmd, options) {
    var ssid = cmd;
    var password = options.password;
    var device = options.device || 'en0';
    console.log('This may take a few seconds...\n');
    child = spawn(networkSetupBin,
      ['-setairportnetwork', device, ssid].concat(password||[]));
    output();
  });

program
  .command('info')
  .description('Display current network info')
  .action(function(cmd, options) {
    child = spawn(airportBin,
      ['--getinfo']); // -I also works
    output();
  });

program
  .command('power [on|off]')
  .description('Turn wifi on or off')
  .option('-d, --device [device]', 'Device interface to use (default is en0)')
  .action(function(cmd, options) {
    var device = options.device || 'en0';
    child = spawn(networkSetupBin,
      ['-setairportpower', device, cmd || 'on']);
  });

program
  .command('disconnect')
  .description('Disconnect from current network (may require root)')
  .action(function(cmd, options) {
    child = spawn(airportBin,
      ['--disassociate']); // -z also works
  });

program
  .command('network')
  .description('Display current network name')
  .option('-d, --device [device]', 'Device interface to use (default is en0)')
  .action(function(cmd, options) {
    var device = options.device || 'en0';
    child = spawn(networkSetupBin,
      ['-getairportnetwork', device]);
    output();
  });

program
  .command('hardwareports')
  .description('List all hardware ports (useful for finding device interface name)')
  .action(function(cmd, options) {
    child = spawn(networkSetupBin,
      ['-listallhardwareports']);
    output();
  });

program
  .command('channel [channel]')
  .description('Change channel of current network (may require root)')
  .action(function(channel, options) {
    child = spawn(airportBin,
      ['--channel'.concat(channel ? '=' + channel : '')]); // -c also works
    output();
  });

program.parse(process.argv);

if (program.rawArgs.length <= 2) {
  program.outputHelp();
}

function output() {
  if (child) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }
}
