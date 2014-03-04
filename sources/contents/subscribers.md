---
title: Subscribers
template: index.jade
toc: {
  "Introduction": {},
  "What can you subscribe to": {
    "XML based feeds": {},
    "JSON feeds": {},
    "HTML fragments": {},
    "Keywords And Expressions": {},
    "Other": {},
    "Redirects": {}
  },
  "What API to choose": {},
  "Webhooks": {
    "HTTP Authentication": {},
    "Adding Feeds with PubSubHubbub": {},
    "Removing Feeds with PubSubHubbub": {},
    "Listing Feeds with PubSubHubbub": {},
    "Retrieving Entries with PubSubHubbub": {},
    "PubSubHubbub Notifications": {},
    "PubSubHubbub API Wrappers": {}
  },
  "XMPP PubSub": {
    "XMPP Authentication": {},
    "Adding Feeds with XMPP": {},
    "Removing Feeds with XMPP": {},
    "Listing Feeds with XMPP": {},
    "Retrieving Entries with XMPP": {},
    "XMPP Notifications": {},
    "XMPP API Wrappers": {}
  }
}
---

## Introduction

Superfeedr is a tool which will push you content to which you can subscribe on the web and get notification in **realtime**.
It is also possible to retrieve *past* content. Finally, when possible we offer a set of normalization options for easier consumption.

## What can you subscribe to

In practice, Superfeedr lets you subscribe to anything that has a url. One significant caveat is that this url needs to be publicly accessible by our servers, which means that the resource cannot be located inside a private network or behind a firewall. 

Urls may include an authentication element, but note that Superfeedr will not treat these urls with any kind of specific security concern, which means that we strongly discourage providing urls with an authentication mechanism.

### XML based feeds

Our *historical* use case is to allow you to subscribe to RSS or Atom feeds and get that content pushed to you in realtime. These are also normalized (see the [schema section](/schema.html)) for easier consumption on your end. We support RSS, Atom and RDF, as well as a couple of namespaces.

> Updates will be detected **when one or more item has been added** to the feed and the notification will only include this (or these) new items as well as part of the feed's main attributes (title, ... etc).

We map each entry in a feed with a **unique identifier** (the <code>id</code> element in our [schema](/schema.html)). Hence, we will send you a notification for each **new** unique identifier that we can detect, whatever the rest of the entry is. This means that *we won't use the title, or the links* or even a signature of the entries's content to detect update. 

We believe the behavior we chose is **compliant with the both the RSS and Atom specifications**. When we are not able to find a unique id, we will generate one, using complex rules that vary from feed to feed.

#### Updates
Updates in an entry are *by default not propagated* because we chose to avoid numerous false positives. There is an exception to that: we will send you a notification for an update in a feed if both the entry contains a valid <code>updated</code> element, and that update is very recent (less than 3 minutes). In practice that means that we will mostly propagate updates for feeds for which we received a ping by the publisher.

#### Errors
We will also send you notification when a *feed is an error state* (either at the HTTP level, with HTTP error codes or when we were unable to successfully parse its content) so that you can monitor things and decide whether you want to keep or drop a subscription for that specific faulty feed. These notifications will only include the status part of our [schema](/schema.html).

### JSON feeds

It is obviously possible to subscribe to any kind of JSON document. To identify new content, we will compute a hash signature of the whole document. If that signature changes between 2 fetches, we will propagate the change by sending the full JSON document to your endpoint.

We will also send you notification when a *resource is an HTTP error state*. These notifications will only include the status part of our [schema](/schema.html).

### HTML fragments

Superfeedr also provides the ability to subscribe to HTML fragments inside an HTML page.

### Keywords and Expressions

Superfeedr allows you to subscribe to keywords or complex expressions to match the data that goes thru Superfeedr itself. Check our [track section](/misc.html#track) for more details.

### Other

When subscribing to any other HTTP resource, we will compute a signature from the bytes including in the document. When we fetch that resource again (after at least 5 minutes), if the signature changed, we will send you the whole document again.

Timestamps, changing tracking codes... etc may create false positives.

### Redirects

When fetching resources, Superfeedr will follow all redirects, temporary or permanent and notify you of the actual content at the end of the redirect chain (we follow up to 5 redirect). It is also strongly recommanded, when applicable that you subscribe to the **canonical** url.

## What API to choose

Superfeedr offers 2 different API : [XMPP PubSub](/subscribers.html#xmpppubsub) and [HTTP PubSubHubbub](/subscribers.html#webhooks). They have both purposes for which they've been created and, based on your goals using Superfeedr, you might want to select one or another. 

The first decision factor is that one is HTTP-based and the other uses the XMPP protocol. Even though it is powerful, XMPP is an extremely different kind of protocol and most web developers are not familiar with it: **stick to HTTP Webhooks (PubSubHubbub) if you're not confident with XMPP and if you're creating a web app**.

The second decision factor is that HTTP PubSubHubbub is not accessible behind the firewall so if you're creating an app that **does not need to live on the web**, then XMPP may be a better choice.

Feel free to ask us what we think is best for your use case. We're always excited to help.

## Webhooks

Our API is based on the [PubSubHubbub](https://en.wikipedia.org/wiki/PubSubHubbub) protocol with a couple simplifications, but  you can re-use your *subscriber* code with *any other hub*. You can also use any library that supports and implements PubSubHubbub. 

> We strongly recommand that you read the [PubSubHubbub spec](https://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html).

Our PubSubHubbub endpoint is at <code>[https://push.superfeedr.com/](https://push.superfeedr.com/)</code>.

The most notable difference is that our endpoint uses [HTTP Basic Auth](https://httpd.apache.org/docs/1.3/howto/auth.html#basic) to [authenticate](/subscribers.html#addingfeedswithpubsubhubbub) your PubSubHubbub calls, making all *verification* steps of the requests optional.

We also support the use of <code>X-HTTP-Method-Override</code> HTTP header in case you want to manually specify an HTTP method different from the one used in the HTTP request. 

### HTTP Authentication

Authentication using the Webhooks API is performed thru [HTTP Basic Auth](https://httpd.apache.org/docs/1.3/howto/auth.html#basic). Most (if not all!) HTTP libraries will allow for an easy configuration.

The username to use is your Superfeedr login and you can pick from different options for the password:

* A password token that [you can generate](https://superfeedr.com/tokens/new).
* your main Superfeedr password. However, please note that we recommand the use of a token for security reasons.

You can generate an unlimited number of tokens, with different combination of rights associated to them:

* [Subscribe](/subscribers.html#addingfeedswithpubsubhubbub)
* [Unsubscribe](/subscribers.html#removingfeedswithpubsubhubbub)
* [List](/subscribers.html#listingfeedswithpubsubhubbub)
* [Retrieve](/subscribers.html#retrievingentrieswithpubsubhubbub)
* [XMPP](/subscribers.html#xmppauthentication) (see below)

The tokens **cannot** be used to log into the main [Superfeedr](http://www.superfeedr.com/) site. 

Tokens can be made public, provided that you understand that any call made with them will be associated to your account. In particular, this means that if someone makes subscription calls with one of your tokens, your account will be billed with the following notifications.

On the other hand, please remember to use <code>https</code> when sending authentication against our endpoint if you want to ensure full privacy of your credentials (including token information).

### Adding Feeds with PubSubHubbub

<div class="panel">
  <div class="panel-body"><span class="label label-default">POST</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>
<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Parameter Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>hub.mode</td>
  <td>required</td>
  <td><code>subscribe</code></td>
</tr>
<tr>
  <td>hub.topic</td>
  <td>required</td>
  <td>The URL of the HTTP resource to which you want to subscribe.</td>
</tr>
<tr>
  <td>hub.callback</td>
  <td>required</td>
  <td>The webhook: it's the URL to which notifications will be sent. Make sure you it's web-accessible, ie not behind a firewall.</td>
</tr>
<tr>
  <td>hub.secret</td>
  <td>optional, recommanded</td>
  <td>A unique secret string which will be used by us to compute a signature. You should check this signature when getting notifications.</td>  
</tr>
<tr>
  <td>hub.verify</td>
  <td>optional</td>
  <td><code>sync</code> or <code>async</code>: will perform a <a href="http://pubsubhubbub.github.io/PubSubHubbub/pubsubhubbub-core-0.4.html#rfc.section.5.3">PubSubHubbub verification</a> of intent synschronously or asynschronously.</td>
</tr>
<tr>
  <td>format</td>
  <td>optional</td>
  <td><code>json</code> if you want to receive notifications as json format (for feeds only!). You can also use an <code>Accept</code> HTTP header like this: <code>Accept: application/json</code>. bu default, you will get <code>ATOM</code> notifications.</td>
</tr>
<tr>
  <td>retrieve</td>
  <td>optional</td>
  <td>If set to <code>true</code>, the response will include the current representation of the feed as stored in Superfeedr, in the format desired. Please check our <a href="/schema.html">Schema</a> for more details.</td>
</tr>
</table>

Subscription at Superfeedr are a unique combination of a resource url and a callback url. If you resubscribe with the same urls, we will only keep one. However, if you use a different callback url for the same feed url, we will keep both.

#### Example

<pre class="language-bash embedcurl">
  curl https://push.superfeedr.com/ 
  -X POST 
  -u demo:demo 
  -d'hub.mode=subscribe' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
  -d'hub.callback=http://mycallback.tld/ok'
</pre>

#### Response

Superfeedr will return `204` if the subscription was performed and `202` if the subscription has yet to be verified (only if you used supplied a <code>hub.verify=async</code> parameter).

If you used the <code>retrieve</code> param, Superfeedr will respond with a 200 response and the content of the feed in the body.

For `422` HTTP response code, please check the body as it includes the reason of why the subscription could not be performed.

Other HTTP response code have the meaning defined in the [HTTP spec.](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### Removing Feeds with PubSubHubbub

This call uses the exact same syntax used in the [adding feeds section](/subscribers.html#addingfeedswithpubsubhubbub). The only difference is the `hub.mode` value.

<div class="panel">
  <div class="panel-body"><span class="label label-default">POST</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>
<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Parameter Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>hub.mode</td>
  <td>required</td>
  <td><code>unsubscribe</code></td>
</tr>
<tr>
  <td>hub.topic</td>
  <td>required</td>
  <td>The URL of the HTTP resource to which you want to subscribe.</td>
</tr>
<tr>
  <td>hub.callback</td>
  <td>optional</td>
  <td>The URL to which notifications will be sent. It is optional if you are only subscribed to the feed 'once', with a single <code>hub.callback</code>. If you have multiple subscriptions, you will need to supply the <code>hub.callback</code> parameter. It is also required if you use the <code>hub.verify</code> param. (see below). </td>
</tr>
<tr>
  <td>hub.verify</td>
  <td>optional</td>
  <td><code>sync</code> or <code>async</code>. We will perform a <a href="http://pubsubhubbub.github.io/PubSubHubbub/pubsubhubbub-core-0.4.html#rfc.section.5.3">PubSubHubbub verification</a> of intent synschronously or asynschronously.</td>
</tr>
</table>

#### Example

<pre class="language-bash embedcurl">curl https://push.superfeedr.com/ 
  -X POST 
  -u demo:demo 
  -d'hub.mode=unsubscribe' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
  -d'hub.callback=http://mycallback.tld/ok'
</pre>

#### Response

Superfeedr will return `204` if the unsubscription was performed and `202` if the subscription has yet to be verified (only if you used supplied a <code>hub.verify=async</code> parameter).

For `422` HTTP response code, please check the body as it includes the reason of why the subscription could not be performed.

Other HTTP response code have the meaning defined in the [HTTP spec.](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### Listing Feeds with PubSubHubbub

This call will allow you to retrieve subscriptions that match a callback url. This callback URL may include a wildcard in the form of %.

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>
<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Parameter Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>hub.mode</td>
  <td>required</td>
  <td><code>list</code></td>
</tr>
<tr>
  <td>hub.callback</td>
  <td>required</td>
  <td>The callback url with which you subscribed and for which you want to find subscriptions. It can include <code>%</code> as a wildcard.</td>
</tr>
<tr>
  <td>page</td>
  <td>optional</td>
  <td>If there are more than 20 matching subscriptions, you may want to paginate over them. First page (default) is 1.</td>
</tr>
</table>

#### Example

<pre class="language-bash embedcurl">curl https://push.superfeedr.com/ 
  -X GET 
  -u demo:demo 
  -d'hub.mode=list' 
  -d'hub.callback=http://mycallback.tld/%'
  -d'page=2'
</pre>

#### Response

Superfeedr will return `200` with the list of matching subscriptions, a JSON format. If you supplied a callback parameter (JSONP), the JSON will be wrapped in it.
<pre class="language-bash">
<code>[{
  "subscription": {
    "format": "atom",
    "endpoint": "http://mycallback.tld/ok",
    "secret": null,
    "feed": {
      "title": "Publisher example",
      "url": "http://push-pub.appspot.com/feed"
    }
  }
}]</code>
</pre>

### Retrieving Entries with PubSubHubbub

This call will allow you to retrieve the past entries for a feed. Note that you need to be susbcribed to that resource to achieve that.

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>
<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Parameter Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>hub.mode</td>
  <td>required</td>
  <td><code>retrieve</code></td>
</tr>
<tr>
  <td>hub.topic</td>
  <td>required</td>
  <td>The URL of the HTTP resource for which you want the past entries.</td>
</tr>
<tr>
  <td>count</td>
  <td>optional</td>
  <td>Optional number of items you want to retrieve. Current max is 50 and default is 10.</td>  
</tr>
<tr>
  <td>before</td>
  <td>optional</td>
  <td>The <code>id</code> of an entry in the feed. The response will only include entries published before this one.</td>  
</tr>
<tr>
  <td>after</td>
  <td>optional</td>
  <td>The <code>id</code> of an entry in the feed. The response will only include entries published after this one.</td>  
</tr>
<tr>
  <td>format</td>
  <td>optional</td>
  <td><code>json</code> if you want to retrieve entries in json format (for feeds only!). You can also use an <code>Accept</code> HTTP header like this: <code>Accept: application/json</code></td>
</tr>
<tr>
  <td>callback</td>
  <td>optional, only if you're using the JSON format</td>
  <td>This will render the entries as a <a href="http://en.wikipedia.org/wiki/JSONP">JSONP</a>. </td>
</tr>
</table>

#### Example

<pre class="language-bash embedcurl">curl https://push.superfeedr.com/ 
  -H 'Accept: application/json'
  -X GET 
  -u demo:demo 
  -d'hub.mode=retrieve' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
</pre>

**Response:**

<pre class="language-bash">
Content-Type: application/json; charset=utf-8
Connection: keep-alive
Status: 200 OK
ETag: "c58f3a54cfa565539672a6f2f3276ddc"
X-Runtime: 275
Content-Length: 3550

{
    "status": {
        "code": 200,
        "feed": "http://push-pub.appspot.com/feed",
        "http": "Fetched (ring) 200 121 and parsed 0/20 entries",
        "lastParse": 1377845845,
        "period": 43200,
        "lastMaintenanceAt": 1377842368,
        "nextFetch": 1377889045,
        "lastFetch": 1377845845
    },
    "title": "Publisher example",
    "items": [
        {
            "title": "mhmmm",
            "published": 1377845723000,
            "id": "http://push-pub.appspot.com/feed/1104006",
            "links": {
                "http://push-pub.appspot.com/entry/1104006": {
                    "href": "http://push-pub.appspot.com/entry/1104006",
                    "title": "mhmmm",
                    "rel": "alternate",
                    "mime_type": "text/html",
                    "id": "mhmmm"
                }
            },
            "content": "mmhmhjmm",
            "updated": 1377845723000
        },
        {
            "title": "test 2 - bis",
            "published": 1377758355000,
            "id": "http://push-pub.appspot.com/feed/1109002",
            "links": {
                "http://push-pub.appspot.com/entry/1109002": {
                    "href": "http://push-pub.appspot.com/entry/1109002",
                    "title": "test 2 - bis",
                    "rel": "alternate",
                    "mime_type": "text/html",
                    "id": "test-2-bis"
                }
            },
            "content": "recieved - bis",
            "updated": 1377758355000
        },
        {
            "title": "test",
            "published": 1377756592000,
            "id": "http://push-pub.appspot.com/feed/1111001",
            "links": {
                "http://push-pub.appspot.com/entry/1111001": {
                    "href": "http://push-pub.appspot.com/entry/1111001",
                    "title": "test",
                    "rel": "alternate",
                    "mime_type": "text/html",
                    "id": "test"
                }
            },
            "content": "not recieving from google hub",
            "updated": 1377756592000
        },
        ...
        {
            "title": "test 2",
            "published": 1377758355000,
            "id": "http://push-pub.appspot.com/feed/1108004",
            "links": {
                "http://push-pub.appspot.com/entry/1108004": {
                    "href": "http://push-pub.appspot.com/entry/1108004",
                    "title": "test 2",
                    "rel": "alternate",
                    "mime_type": "text/html",
                    "id": "test-2"
                }
            },
            "content": "recieved",
            "updated": 1377758355000
        }
    ]
}
</code></pre>

#### Response

Superfeedr will return <code>200</code> with the content if we could retrieve the feed's past entries.

If you are not subscribed to the feed or if the feed has not yet been added to Superfeedr, we will return a `404`.

For `422` HTTP response code, please check the body as it includes the reason of why the subscription could not be performed.

Other HTTP response code have the meaning defined in the [HTTP spec.](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### PubSubHubbub Notifications

Notifications are POST requests sent to the callback you specified for the [subscription](/subscribers.html#addingfeedswithpubsubhubbub). The body of the response includes the notification in the format that you specified upon subscription. Please check our [schema](/schema.html) for more information.

We will consider the notification as successful if we can reach your callback and if it returns a `200` status code. If the notification failed, we will **retry 3 times** after 5, 10 and 15 seconds (this may slightly vary). If we are not able to notify you after these retries, we will drop the notification and you should use [our retrieve feature](/subscribers.html#retrievingentrieswithpubsubhubbub) to get the missing data.

Additionally, the notification will include the following headers which you should inspect:

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Header Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>X-Superfeedr-Credits</td>
  <td></td>
  <td>Your credit balance. It should always decrease by 1 between 2 notifications. If it doesn't, it means you missed a notification.</td>
</tr>

<tr>
  <td>X-PubSubHubbub-Callback</td>
  <td></td>
  <td>Your callback url.</td>
</tr>

<tr>
  <td>X-PubSubHubbub-Topic</td>
  <td></td>
  <td>The topic to which you subscribed. Very useful to easily unsubscribe if you haven't kept track of that subscription.</td>
</tr>

<tr>
  <td>Content-Type</td>
  <td></td>
  <td>Very useful to see how to parse the body.</td>
</tr>
<tr>
  <td>X-Superfeedr-Retried</td>
  <td>optional</td>
  <td>If this header is present, it means we had trouble notification you on previous attempts. You should make sure your app doesn't encounter health issues.</td>
</tr>
</table>

### Best Practices

#### Use HTTPS

You should *always* use the https endpoints when sending requests to Superfeedr. Additionnaly we recommand that you use `https` for your endpoints. This will garantee privacy and integrity of the full notification (headers included).

#### Use hub.secret

When subscribing you should use a `hub.secret`, unless of course you use https for your callback urls. This secret will be used to compute a signature for each notification. You should of course make sure these signatures match. [Read more](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html#authednotify) about that.

#### Use different callback urls

Your callback urls should be *hard to guess*, but, more importantly, you should **use different callbacks for each of your subscriptions**. This way you can quickly identify what feed is involved in each notification, without having to parse the content itself. It will also be easier to identify problems using the access logs of your HTTP servers.

### PubSubHubbub API Wrappers

There exists multiple PubSubHubbub API wrapper in multiple langues and they should work fine with our endpoint. You can also check [our Github](https://github.com/superfeedr/) repository for some platform-specific libraries like our [ruby rack gem](https://github.com/superfeedr/rack-superfeedr).

## XMPP PubSub

The XMPP API is based on the [XEP-0060 syntax](http://xmpp.org/extensions/xep-0060.html#subscriber-subscribe). Additional data has been included within a superfeedr-specific namespace.

You can use the XMPP console of any XMPP desktop client to inspect that traffic.

### Authentication

You can connect your jabber client to superfeedr by using the JID <code>username@superfeedr.com</code> and your main Supefeedr password. You should however [create a specific token](https://superfeedr.com/tokens/new) as long as this token enables the XMPP right.

You can also specify another JID in your user settings if you'd like to connect from our own XMPP server. This is the most flexible option, but it also requires you to host your own XMPP server.

### Adding Feeds with XMPP

Subscribing to a new feed will allow you to get notifications with the upcoming entries from that feed.

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>iq[@from]</td>
  <td></td>
  <td>Should match the bare jid you entered in your settings.</td>
</tr>
<tr>
  <td>iq[@id]</td>
  <td></td>
  <td>Random string (enables you to match the superfeedr response with your query)</td>
</tr>
<tr>
  <td>subscribe[@node]</td>
  <td></td>
  <td>Use the url of the resource (feed) you want to monitor. Please, <em>use canonical urls</em> as much as possible</td>
</tr>

<tr>
  <td>subscribe[@jid]</td>
  <td></td>
  <td>Should be equal to the <code>iq[@from]</code> or, if you have chose an external component jid, should have the same domain. JID resources will be ignored.</td>
</tr>

<tr>
  <td>subscribe[@format]</td>
  <td>optional</td>
  <td>This must belong to the Superfeedr namespace (<code>http://superfeedr.com/xmpp-pubsub-ext</code>). You can specify the format of the payload in notifications. Currently, we support atom (default) and json. See [schema](/schema.html) for more details.</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><iq type="set" from="login@superfeedr.com" to="firehoser.superfeedr.com" id="sub1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub" xmlns:superfeedr="http://superfeedr.com/xmpp-pubsub-ext">
  <subscribe node="http://domain.tld/feed1.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/feed2.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/feed3.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/path/to/resource" jid="login@superfeedr.com" superfeedr:format="atom" />
 </pubsub>
</iq></code></pre>

You can add up to 20 resources in your subscription query, as long as they have all the same <code>subscribe[@jid]</code>. If you need to subscribe with multiple jids, we suggest that you send multiple subscription queries.

#### Response

The server acknowledges the subscription(s) and sends the status information for each resource.

<pre class="language-markup"><code><iq type="result" to="login@superfeedr.com/home" from="firehoser.superfeedr.com" id="sub1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub">
  <subscription jid="login@superfeedr.com" subscription="subscribed" node="http://domain.tld/path/to/resource">
   <status xmlns="http://superfeedr.com/xmpp-pubsub-ext">
    <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
    <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
   </status>
  </subscription>
  <subscription jid="login@superfeedr.com" subscription="subscribed" node="http://domain.tld/path/to/resource2">
   <status xmlns="http://superfeedr.com/xmpp-pubsub-ext">
    <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
    <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
   </status>
  </subscription>
  <subscription jid="login@superfeedr.com" subscription="subscribed" node="http://domain.tld/path/to/resource3">
   <status xmlns="http://superfeedr.com/xmpp-pubsub-ext">
    <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
    <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
   </status>
  </subscription>
 </pubsub>
</iq></code></pre>

In other cases, you will receive an iq with <code>type="error"</code>, please check that your subscription query abides by the constraints explained above.

### Removing Feeds with XMPP

When you remove a feed, you will stop receiving notifications for that feed.

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>iq[@from]</td>
  <td></td>
  <td>Should match the bare jid you entered in your settings.</td>
</tr>

<tr>
  <td>iq[@id]</td>
  <td></td>
  <td>Random string (enables you to match the superfeedr response with your query).</td>
</tr>

<tr>
  <td>unsubscribe[@node]</td>
  <td></td>
  <td>Use the url of the resource you want to unsubscribe from.</td>
</tr>

<tr>
  <td>unsubscribe[@jid]</td>
  <td></td>
  <td>Use the jid that you used for the subscription.</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><iq type="set" from="login@superfeedr.com/home" to="firehoser.superfeedr.com" id="unsub1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub">
  <unsubscribe node="http://domain.tld/feed1.xml" jid="login@superfeedr.com"/>
  <unsubscribe node="http://domain.tld/feed2.xml" jid="login@superfeedr.com"/>
  <unsubscribe node="http://domain.tld/feed3.xml" jid="login@superfeedr.com" />
 </pubsub>
</iq></code></pre>

You can remove up to 20 resources in your unsubscription query.

#### Response

The server acknowledges the unsubscription.

<pre class="language-markup"><code><iq type="result" from="firehoser.superfeedr.com" to="login@superfeedr.com/home" id="unsub1" /></code></pre>

### Listing Feeds with XMPP

You can list your existing subscriptions. This list is paginated with 20 items per page.

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>iq[@from]</td>
  <td></td>
  <td>Should match the bare jid you entered in your settings.</td>
</tr>

<tr>
  <td>iq[@id]</td>
  <td></td>
  <td>Random string (enables you to match the superfeedr response with your query).</td>
</tr>

<tr>
  <td>subscriptions[@page]</td>
  <td></td>
  <td>Page number (subscriptions will be sent by batches of 20)</td>
</tr>

<tr>
  <td>subscribe[@jid]</td>
  <td></td>
  <td>The jid for which you want to list subscriptions. If you used a component jid (using your own XMPP server), you can use a more specific jid to filter subscriptions by jid.</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><iq type="get" from="login@superfeedr.com/home" to="firehoser.superfeedr.com" id="subman1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub" xmlns:superfeedr="http://superfeedr.com/xmpp-pubsub-ext">
  <subscriptions jid="login@superfeedr.com" superfeedr:page="3"/>
 </pubsub>
</iq></code></pre>

#### Response 

The server sends the list of resources to which you're subscribed for the page requested, as well as the status information for each of them.

<pre class="language-markup"><code><iq type="result"  to="login@superfeedr.com/home" id="subman1" from="firehoser.superfeedr.com">
 <pubsub xmlns="http://jabber.org/protocol/pubsub"  xmlns:superfeedr="http://superfeedr.com/xmpp-pubsub-ext" >
  <subscriptions superfeedr:page="3">
   <subscription node="http://domain.tld/path/to/resource" subscription="subscribed" jid="login@superfeedr.com" >
    <status xmlns="http://superfeedr.com/xmpp-pubsub-ext">
     <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
     <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
    </status>
   </subscription>
   <subscription node="http://domain2.tld/path/to/another/resource" subscription="subscribed" jid="login@superfeedr.com" >
    <status xmlns="http://superfeedr.com/xmpp-pubsub-ext">
     <http code="200">9718 bytes fetched in 1.462708s.</http>
     <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
    </status>
   </subscription>
  </subscriptions>
 </pubsub>
</iq></code></pre>

### Retrieving Entries with XMPP

It is possible to query Superfeedr for previous entries in feeds to which you've subscribed.

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>iq[@from]</td>
  <td></td>
  <td>Should match the bare jid you entered in your settings.</td>
</tr>

<tr>
  <td>iq[@id]</td>
  <td></td>
  <td>Random string (enables you to match the superfeedr response with your query).</td>
</tr>

<tr>
  <td>items[@node]</td>
  <td></td>
  <td>The resource url for which you want to retrieve content.</td>
</tr>

</table>

#### Example

<pre class="language-markup"><code><iq type='get' to="firehoser.superfeedr.com" id='items1'>
  <pubsub xmlns='http://jabber.org/protocol/pubsub'>
    <items node='http://domain.tld/path/to/resource'/>
  </pubsub>
</iq></code></pre>

#### Response

At this point, you will get a maximum of 10 items per feed.

<pre class="language-markup"><code><iq from="firehoser.superfeedr.com" type="result" to="login@superfeedr.com/home" id="items1" >
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <items node="http://domain.tld/path/to/resource" >
      <item>
        <entry xmlns="http://www.w3.org/2005/Atom">
          <id>http://push-pub.appspot.com/feed/1104006</id>
          <published>2013-08-30T06:55:23Z</published>
          <updated>2013-08-30T06:55:23Z</updated>
          <title>hello</title>
          <content type="text" >world</content>
          <link title="hello" rel="alternate" href="http://push-pub.appspot.com/entry/1104006" type="text/html" />
        </entry>
      </item>
      <item>
        <entry xmlns="http://www.w3.org/2005/Atom">
          <id>http://push-pub.appspot.com/feed/1112001</id>
          <published>2013-08-30T06:53:00Z</published>
          <updated>2013-08-30T06:53:00Z</updated>
          <title>hello</title>
          <content type="text" >world</content>
          <link title="hello" rel="alternate" href="http://push-pub.appspot.com/entry/1112001" type="text/html" />
        </entry>
      </item>
      ...
      <item>
        <entry xmlns="http://www.w3.org/2005/Atom">
          <id>http://push-pub.appspot.com/feed/1097004</id>
          <published>2013-08-29T05:54:27Z</published>
          <updated>2013-08-29T05:54:27Z</updated>
          <title>Hello - bis</title>
          <content type="text" >world - bis</content>
          <link title="Hello - bis" rel="alternate" href="http://push-pub.appspot.com/entry/1097004" type="text/html" />
        </entry>
      </item>
    </items>
  </pubsub>
</iq></code></pre>

If you have not subscribed to the feed, you will receive a response like this one

<pre class="language-markup"><code><iq from="firehoser.superfeedr.com" type="result" to="login@superfeedr.com/home" id="items1" >
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <items node="http://domain.tld/path/to/resource" >
    </items>
  </pubsub>
</iq></code></pre>

### XMPP Notifications

Once you're following a resource, your xmpp client must be **connected at all times** ant new content. You will miss messages if your client is offline for too long.

We will send you a notification when we consider the resource as updated (see "[what can you subscribed to](/subscribers.html#whatcanyousubscribeto)".

Please see the [schema information](/schema.html) for details on the status, as well as the feed and entry informations.

<pre class="language-markup"><code><message from="firehoser.superfeedr.com" to="login@superfeedr.com">
 <event xmlns="http://jabber.org/protocol/pubsub#event">
  <status feed="http://domain.tld/feed.xml" xmlns="http://superfeedr.com/xmpp-pubsub-ext">
   <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
   <next_fetch>2009-05-10T11:19:38-07:00</next_fetch>
   <title>Lorem Ipsum</title>
  </status>
  <items node="http://domain.tld/feed.xml">
   <item >
    <entry xmlns="http://www.w3.org/2005/Atom">
     <title>Soliloquy</title>
     <summary>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</summary>
     <link rel="alternate" type="text/html" href="http://superfeedr.com/entries/12345789"/>
     <id>tag:domain.tld,2009:Soliloquy-32397</id>
     <published>2010-04-05T11:04:21Z</published>
    </entry>
   </item>
   <item>
    <entry xmlns="http://www.w3.org/2005/Atom">
     <title>Finibus Bonorum et Malorum</title>
     <summary>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</summary>
     <link rel="alternate" type="text/html" href="http://superfeedr.com/entries/12345788"/>
     <id>tag:domain.tld,2009:Finibus-32398</id>
     <published>2010-04-06T08:54:02Z</published>
    </entry>
   </item>
  </items>
 </event>
</message></code></pre>

### XMPP API Wrappers

XMPP *can be scary*. For those of you who don't want to mess with that, we have various wrappers (including [Ruby](https://github.com/superfeedr/superfeedr-rb), [Perl](https://github.com/superfeedr/superfeedr-perl), [Python](https://github.com/superfeedr/superfeedr-python), [Node.js](https://github.com/superfeedr/superfeedr-node), [Java](https://github.com/superfeedr/superfeedr-java) and [PHP](https://github.com/superfeedr/superfeedr-php)) for the XMPP API. You can find them on our [Github page]((https://github.com/superfeedr/). 

If you need one in another language, please contact us. Also, remember that these wrappers have been created by the community. Feel free to contribute to help improve them. 

<script src="https://www.embedcurl.com/embedcurl.min.js" async></script>
