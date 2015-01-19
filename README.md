# Airdrome

CLI for wifi management. Basically a wrapper for `airport` and `networksetup` on Mac OS X.

# Install

```bash
npm install airdrome -g
```

# Usage

```bash
$ airdrome --help

  Usage: index [options] [command]


  Commands:

    list|scan                     List available networks
    preferred [options] [action]  List preferred networks. Or add or remove preferred network
    connect [options] <ssid>      Connect to network
    info                          Display current network info
    power [options] [on|off]      Turn wifi on or off
    disconnect                    Disconnect from current network (may require root)
    network [options]             Display current network name
    hardwareports                 List all hardware ports (useful for finding device interface name)
    channel [channel]             Change channel of current network (may require root)

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

More help for a command:

```
$ airdrome connect --help

  Usage: connect [options] <ssid>

  Connect to network

  Options:

    -h, --help                 output usage information
    -d, --device [device]      Device interface to use (default is en0)
    -p, --password [password]  Network Password
```

# License

MIT
