The Google Reader Compatible API
================================

The Google Reader API is an HTTP based API. It is not a *realtime* API, which means that 3rd party applications will have to poll that API at regular intervals to make sure they obtain the latest value to a given query.

One of the key design goals was to map the Google Reader API in order to provide a drop in replacement.

* [Endpoint](#endpoint)
* [Authentication](#Authentication)
* [Data Formats](#data-formats)
* [Calls](#supported-calls)
* [Examples](#examples)


## Endpoint

The Google Reader compatible API is available at:
`readerapi.superfeedr.com`. This endpoint is accessible thru both HTTP and HTTPS (recommended).

## Authentication

All API calls must me authenticated. The current API supports 3 authentication methods. They all require a [Superfeedr Subscriber account](http://superfeedr.com/subscriber).

### HTTP Basic Auth

This is the simplest and most commonly used auth pattern. Use your Superfeedr login and password.

```
GET https://user:password@readerapi.superfeedr.com/
```

We strongly recommand using https for these calls to make sure your credentials are kept secret.

### Query string

This is inspired from Google Reader's authentication method. Provide the following query string params: `Email` and `Passwd`. The `Email` must be the email address used to create your Superfeedr account.

```
GET https://readerapi.superfeedr.com/accounts/ClientLogin?Email=hello@world.tld&Passwd=SEKre+
```

We strongly recommand using https for these calls to make sure your credentials are kept secret.

### GoogleLogin

This method is also inspired directly from Google Reader's API. When making calls, just include an HTTP `Authorization` header with the following value `GoogleLogin auth=[token]`

You can obtain the token my making a, authenticated call to `http://readerapi.superfeedr.com/accounts/ClientLogin`

The token is the value of the `Auth` element.

You should cache the value of the token for at least 10 days and at most 15 days.
It is possible to use several tokens at once, and it is also possible to obtain a new token by calling  `http://readerapi.superfeedr.com/accounts/ClientLogin` with a valid token.

## Data Formats

*To be completed*

## Supported calls

### /accounts/ClientLogin

This call is used to obtain a token which can later be used for authentication using the [GoogleLogin](#googlelogin) mechanism.
It returns a multi line `text/plain` response.
The line starting with `Auth` includes the token.

```bash
$ curl "http://readerapi.superfeedr.com/accounts/ClientLogin?Email=julien.genestoux%40gmail.com&Passwd=gyucmgcucaomxpie" -D-
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Accept-Encoding
Content-Type: text/html; charset=utf-8
Content-Length: 439
Date: Thu, 04 Apr 2013 16:29:22 GMT
Connection: keep-alive

SID=xxx
LSID=yyy
Auth=ee38f8c17958adbe41d41cd108bfc933a0f8d3277064e61ae56a21fef2c462604f0eb11cd35381b88333e7bbb3f1c20e4cd69140d646158cd4ba90e67321cbdb15aa0d24fdb18fead0f371a9880eb109abd8e98fb665d184c0aa09f84783366b8f64db41f2237bad3420e19796ce7d220d7932f15b0dcb73d6ffcc7fad9ab2e51b1c57e2ca2ac0a9cf5233346d7e52c2e736e368f72883ced0259624bd20e217f31e5738eb1392bbee80f85965120f9d195639519ac4ccc0515b246a86a7b49d20205a22f6eba097b8d2f2a324dcf169
```

### /reader/api/0/user-info

This call will return some account information related to the Superfeedr account of the logged in user.

```bash
$ curl "http://readerapi.superfeedr.com/reader/api/0/user-info"
```

```json
{"userId":29969,"userName":"greader","userProfileId":"greader","userEmail":"julien.genestoux@gmail.com","isBloggerUser":false,"signupTimeSec":0,"publicUserName":"greader","isMultiLoginEnabled":false}
```

### /reader/api/0/stream/contents/

### /reader/atom/feed/


*To be completed*

## Examples

*To be completed*

