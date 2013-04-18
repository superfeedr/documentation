The Google Reader Compatible API
================================


> **Warning - Alpha**. This API is in alpha, which means that the documentation may be incomplete or may introduce elements that are not fully implemented or deployed. We expect this phase to last until May 15th 2013.

The Google Reader API is an HTTP based API. It is not a *realtime* API, which means that 3rd party applications will have to poll that API at regular intervals to make sure they obtain the latest value to a given query.

One of the key design goals was to map the Google Reader API in order to provide a drop in replacement.

* [Endpoint](#endpoint)
* [Authentication](#Authentication)
* [Data Formats](#data-formats)
* [Calls](#supported-calls)
* [Examples](#examples)

## Compliance

It is extremely complex to make a perfectly compatible API, because it's hard to have an extensive knowledge of the Google Reader API. There are a couple unofficial documentations for the Google Reader API (see [there](http://undoc.in/googlereader.html) or [there](https://code.google.com/p/pyrfeed/wiki/GoogleReaderAPI)).

We also used the test suites provided with some wrappers, but we need more:
* Python's [libgreader](https://github.com/askedrelic/libgreader)
* Node.js's [node-reader](https://gist.github.com/2034195)

Please, send us any test suite you may have so we can improve compliance.

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


### /reader/api/0/subscription/edit

> **Warning - Alpha**. For now, it is not possible edit existing subscriptions, you can add or remove subscriptions.

This calls allows you to edit your subscription list, by adding, removing or update existing subscriptions.

Some additional query string parameters are required or optional:

| Name  | Value                                                    |
| ----- |:--------------------------------------------------------:| 
| ac    | [required]: the action to perform. Must be 'subscribe', 'unsubscribe'or 'edit'   | 
| s     | [required]: the stream id. Must be of the form `feed/` + feed url                 |
| title | [optional]: a title for that subscription. If none is provided we will use the feed title      |

```bash
$ curl -X POST "http://readerapi.superfeedr.com/reader/api/0/subscription/edit" -d's=feed/http://www.engadget.com/rss.xml' -d'ac=subscribe' -d'title=Engadget'  -H'Authorization: GoogleLogin auth=6981278e0682daba8cd90e61155cbf296045e4bbaffa812398f9bee0ab753bd3ab915007564c8fafe8af4a5e3328491fe3b3d7bc42e844cd3029b82d9d385f62a11ff9755ae2371618ba57895d9f0549927638142f7e1faccdbb5c1148ab0fceaa3240097fd5aa845f08a4475e28cbd417b34d9c002a0360653a2ec374e379e67f421578f05eeaf9d6e89fb10290366311177b46c1cc0b38a28a810e6962d9c47ce014806ab5b52d95b80ad6f448a480a0c5c4d9f2f54e8f72151544408da479' -D- 
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 2
Date: Thu, 18 Apr 2013 16:47:08 GMT
Connection: keep-alive

OK
```

Yields a `200` status code and `OK` as the body.


### /reader/api/0/user-info

This call will return some account information related to the Superfeedr account of the logged in user.

```bash
$ curl "http://readerapi.superfeedr.com/reader/api/0/user-info"
```

```json
{"userId":29969,"userName":"greader","userProfileId":"greader","userEmail":"julien.genestoux@gmail.com","isBloggerUser":false,"signupTimeSec":0,"publicUserName":"greader","isMultiLoginEnabled":false}
```

### /reader/atom/&lt;stream&gt;

> **Warning - Alpha**. During the testing phase, we serve by default and up to 10 elements. You can ask for less elements though.

In the Google API, this call could be used to retrieve various types of contents (streams), including feeds and user data. In the Superfeedr version of this API, only streams starting with `feed/` are supported.

This call will return ATOM representations of the content stored in Superfeedr. It uses the superfeedr [ATOM schema](http://superfeedr.com/documentation#entry_schema).

By default, this call will return 20 past items from the feed (unless of course, we have been able to store less than that). 

Some additional query string parameters are supported:

| Name  | Value                                                    |
| ----- |:--------------------------------------------------------:| 
| n     | The number of items to return. Defaults to 20, max 1000  | 


```bash
curl http://readerapi.superfeedr.com/reader/atom/feed/http://push-pub.appspot.com/feed  -H'Authorization: GoogleLogin auth=6981278e0682daba8cd90e61155cbf296045e4bbaffa812398f9bee0ab753bd3ab915007564c8fafe8af4a5e3328491fe3b3d7bc42e844cd3029b82d9d385f62a11ff9755ae2371618ba57895d9f0549927638142f7e1faccdbb5c1148ab0fceaa3240097fd5aa845f08a4475e28cbd417b34d9c002a0360653a2ec374e379e67f421578f05eeaf9d6e89fb10290366311177b46c1cc0b38a28a810e6962d9c47ce014806ab5b52d95b80ad6f448a480a0c5c4d9f2f54e8f72151544408da479' -D-
HTTP/1.1 200 OK
Content-Type: application/atom+xml
Date: Tue, 16 Apr 2013 15:24:49 GMT
Connection: keep-alive

<feed xmlns="http://www.w3.org/2005/Atom"><title>Publisher example</title><updated>2013-04-16T18:45:45.000Z</updated><id>http://push-pub.appspot.com/feed</id><entry><title>test 35</title><id>http://push-pub.appspot.com/feed/747006</id><published>2013-04-16T14:42:29.000Z</published><updated>2013-04-16T14:42:29.000Z</updated><content>bam</content><summary></summary><link href="http://push-pub.appspot.com/entry/747006" title="test 35" type="text/html" rel="alternate"/></entry><entry><title>test 33</title><id>http://push-pub.appspot.com/feed/741005</id><published>2013-04-16T14:28:18.000Z</published><updated>2013-04-16T14:28:18.000Z</updated><content>bla</content><summary></summary><link href="http://push-pub.appspot.com/entry/741005" title="test 33" type="text/html" rel="alternate"/></entry><entry><title>test 32</title><id>http://push-pub.appspot.com/feed/747005</id><published>2013-04-16T13:26:26.000Z</published><updated>2013-04-16T13:26:26.000Z</updated><content>bam</content><summary></summary><link href="http://push-pub.appspot.com/entry/747005" title="test 32" type="text/html" rel="alternate"/></entry><entry><title>test 30</title><id>http://push-pub.appspot.com/feed/734008</id><published>2013-04-16T13:24:40.000Z</published><updated>2013-04-16T13:24:40.000Z</updated><content>bam</content><summary></summary><link href="http://push-pub.appspot.com/entry/734008" title="test 30" type="text/html" rel="alternate"/></entry><entry><title>test 31</title><id>http://push-pub.appspot.com/feed/743006</id><published>2013-04-16T13:25:58.000Z</published><updated>2013-04-16T13:25:58.000Z</updated><content>bam</content><summary></summary><link href="http://push-pub.appspot.com/entry/743006" title="test 31" type="text/html" rel="alternate"/></entry><entry><title>test 34</title><id>http://push-pub.appspot.com/feed/733009</id><published>2013-04-16T14:29:46.000Z</published><updated>2013-04-16T14:29:46.000Z</updated><content>bsdfa</content><summary></summary><link href="http://push-pub.appspot.com/entry/733009" title="test 34" type="text/html" rel="alternate"/></entry><entry><title>test 28</title><id>http://push-pub.appspot.com/feed/745002</id><published>2013-04-16T12:57:34.000Z</published><updated>2013-04-16T12:57:34.000Z</updated><content>asdflkjasdf</content><summary></summary><link href="http://push-pub.appspot.com/entry/745002" title="test 28" type="text/html" rel="alternate"/></entry><entry><title>test 27</title><id>http://push-pub.appspot.com/feed/733008</id><published>2013-04-16T12:56:07.000Z</published><updated>2013-04-16T12:56:07.000Z</updated><content>ririri</content><summary></summary><link href="http://push-pub.appspot.com/entry/733008" title="test 27" type="text/html" rel="alternate"/></entry><entry><title>test 26</title><id>http://push-pub.appspot.com/feed/734007</id><published>2013-04-16T12:23:46.000Z</published><updated>2013-04-16T12:23:46.000Z</updated><content>huhu</content><summary></summary><link href="http://push-pub.appspot.com/entry/734007" title="test 26" type="text/html" rel="alternate"/></entry><entry><title>test 29</title><id>http://push-pub.appspot.com/feed/737009</id><published>2013-04-16T13:20:41.000Z</published><updated>2013-04-16T13:20:41.000Z</updated><content>ben!</content><summary></summary><link href="http://push-pub.appspot.com/entry/737009" title="test 29" type="text/html" rel="alternate"/></entry></feed>
```

### /reader/api/0/stream/contents/&lt;stream&gt;

In the Google API, this call could be used to retrieve various types of contents (streams), including feeds and user data. In the Superfeedr version of this API, only streams starting with `feed/` are supported.





*To be completed*

## Examples

*To be completed*

