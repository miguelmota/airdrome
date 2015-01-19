# Airdrome

CLI for Wi-Fi management. Basically a wrapper for `airport` and `networksetup` on Mac OS X.

# Install

```bash
npm install airdrome -g
```

# Usage

```bash
$ airdrome --help

  Usage: index [options]

  Options:

    -h, --help                                               output usage information
    -V, --version                                            output the version number
    scan, list                                               List available networks
    preferred                                                List preferred networks
    preferred add <network name> <security type> [password]  Add preferred network
    preferred remove <network name>                          Remove preferred network
    connect <ssid> [password]                                Connect to network
    info                                                     Display current network info
    power [on|off]                                           Turn wifi on or off
    disconnect                                               Disconnect from current network (may require root)
    channel [channel]                                        Change channel of current network (may require root)
    network                                                  Display current network name
    hardwareports                                            List all hardware ports (useful for finding device interface name)
```

# License

MIT
