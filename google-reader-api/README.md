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

*To be completed*

## Examples

*To be completed*

