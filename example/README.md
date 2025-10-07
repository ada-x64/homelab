# homelab docker example

hey thanks for cloning this

## Configuration

The configuration is defined in a JSON file with the following structure:

### Apps Configuration
- `name` (required): Display name for the application.
- `host` (required): Display name of the server, as configured below.
- `port` (required): Host port number (0-99999)
- `path` (optional): Path to append to homelab dashboard URL.
- `hostPath` (optional): Path on the host machine.
- `icon` (optional): Icon svg, stored in config/public.

### Servers Configuration
- `name` (required): Display name for the server
- `ip` (required): IPv4 or IPv6 address
- `wakeOnLan` (optional): Wake-on-LAN settings
  - `macAddress` (required): MAC address in format `aa:bb:cc:dd:ee:ff`
  - `from` (default: "all"): Source IP or "all"
  - `interval` (default: 100): Interval between packets
  - `port` (default: 9): WoL port
  - `count` (default: 3): Number of packets to send
- `status` (optional): System monitoring settings
  - `apiPort` (default: 61208): Glances API port
  - `apiRoute` (default: "/api/4"): Glances API route

## Authentication

You **must** provide credentials on first run to register an administrator. To
do this, you must specify two environment variables:

```.env
ADMIN_EMAIL='test@foo.com'
ADMIN_PW='1234abc!!!'
```

These can be set on the command line, through the docker prompt, or in a .env
file.

Authentication is handled by [better-auth](https://www.better-auth.com).

It is recommended that you remove these environment variables on subsequent
runs. They will be securely stored in the local SQLite database for further use.
