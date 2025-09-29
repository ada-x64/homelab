# ada-net-dash

A dashboard for my local network.

It acts as an administration panel and reverse proxy for all of the web apps
served through my local network.

Additionally, it allows the host to act as a jumpbox for any locally connected
devices.

## Usage

This is a simple [fastify-vite](https://github.com/fastify/fastify-vite)
project. It uses React for the front-end.

### Running from source

```sh
git clone $THIS_REPO
pnpm i
pnpm build
pnpm start
```

### Using a container

TODO

### Authentication

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
runs. They will be stored in the local SQLite database.

### Configuration

TODO

### (Not-so) Frequently Asked Questions

#### Why Fastify?

Fastify is a highly efficient web server. I want to squeeze every ounce of
performance I can out of the raspberrypi which acts as my jumpbox.

#### Why BetterAuth?

It's better.

#### Why React?

I'm used to it.
