# u-wave-api-v1

HTTP API plugin for üWave, the collaborative listening platform.

[Getting Started](#getting-started) - [API](#api) - [Building](#contributing) -
[License](#license)

> Note: üWave is still under development. Particularly the `u-wave-core` and
> `u-wave-api-v1` modules will change a lot before the "official" 1.0.0 release.
> Make sure to always upgrade both of them at the same time.

## Getting Started

```
npm install u-wave-api-v1
```

The module exports a middleware that can be used with express-style HTTP request
handlers.

## API

### api = createHttpApi(uwave, options={})

Creates a middleware for use with [Express][] or another such library. The first
parameter is a `u-wave-core` instance. Available options are:

 - `server` - An HTTP server instance. `u-wave-api-v1` uses WebSockets, and it
   needs an HTTP server to listen to for incoming WebSocket connections. An
   example for how to obtain this server from an Express app is shown below.
 - `socketPort` - The WebSocket server can also listen on its own port instead
   of attaching to the HTTP server. In that case, specify the port number here.
 - `secret` - A string or Buffer containing a secret used to encrypt
   authentication tokens. It's important that this is the same as the `secret`
   option passed to the core library.
 - `recaptcha` - If you want to force ReCaptcha validation on new registrations,
   pass an object with ReCaptcha options. The only available option is `secret`,
   which is the ReCaptcha secret obtained from the "Server-side integration"
   panel on your [ReCaptcha site admin page][recaptcha].
 - `mailTransport` - [nodemailer](https://nodemailer.com) SMTP options or a transport object,
   used to send password reset emails.
 - `onError` - Error handler function, use for recording errors. First parameter
   is the request object that caused the error, second is the error itself.

```js
import express from 'express';
import stubTransport from 'nodemailer-stub-transport';
import uwave from 'u-wave-core';
import createHttpApi from 'u-wave-api-v1';

const app = express();
const server = app.listen();

const secret = fs.readFileSync('./secret.dat');

const uw = uwave({
  secret: secret,
});
const api = createHttpApi(uw, {
  secret: secret, // Encryption secret
  server: server, // HTTP server
  recaptcha: { secret: 'AABBCC...' }, // Optional
  mailTransport: stubTransport(), // Optional
  onError: (req, error) => {}, // Optional
});

app.use('/v1', api);
```

### api.attachUwaveToRequest()

Returns a middleware that attaches the üWave core object and the üWave api-v1
object to the request. The `u-wave-core` instance will be available as
`req.uwave`, and the `u-wave-api-v1` instance will be available as
`req.uwaveApiV1`. This is useful if you want to access these objects in custom
routes, that are not in the `u-wave-api-v1` namespace. E.g.:

```js
app.use('/v1', api);

// A custom profile page.
app.get('/profile/:user', api.attachUwaveToRequest(), (req, res) => {
  const uwave = req.uwave;
  uwave.getUser(req.params.user).then((user) => {
    res.send(`<h1>Profile of user ${user.username}!</h1>`);
  });
});
```

## Contributing

There is a development server included in this repository. To use it, first you have to clone and install u-wave-core.

```bash
git clone https://github.com/u-wave/core u-wave-core
cd u-wave-core
npm install
npm link
```

Then you can clone and install the HTTP API:

```bash
git clone https://github.com/u-wave/api-v1 u-wave-api-v1
cd u-wave-api-v1
npm install
# Add our local u-wave-core
npm link u-wave-core
# & run the server!
npm start -- --port 6042
```

### Building

The build step compiles the futuristic JavaScript that's used in this repository
to code that can be used in engines today, using Babel. To compile the code,
run:

```
npm run build
```

When developing, it might be useful to recompile automatically on changes
instead, using:

```
npm run watch
```

## License

[MIT][]

[recaptcha]: https://www.google.com/recaptcha/admin#list
[Express]: https://expressjs.com

[MIT]: ./LICENSE
