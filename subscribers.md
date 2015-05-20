---
title: Subscribers
layout: page
toc: {
  "Introduction": {},
  "What can you subscribe to": {
    "XML based feeds": {},
    "JSON feeds": {},
    "HTML pages and fragments": {},
    "JSON fragments": {},
    "Other": {},
    "Redirects": {}
  },
  "What API to choose": {},
  "Webhooks": {
    "HTTP Authentication": {},
    "Adding Feeds with PubSubHubbub": {},
    "Removing Feeds with PubSubHubbub": {},
    "Listing Subscriptions with PubSubHubbub": {},
    "Retrieving Entries with PubSubHubbub": {},
    "Streaming RSS": {},
    "PubSubHubbub Notifications": {},
    "Replaying Notifications": {},
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

Superfeedr allows you to subscribe to content on the web, and receive push notifications in **real-time** when new content is published. It also allows you to retrieve past content, and we’ve also got a range of normalization options that make for easier consumption.

## What can you subscribe to

You can use the Superfeedr feed API to subscribe to anything that has a URL. The key caveat to this is that the content needs to be publicly accessible by our servers – the content can’t be in a private network or behind a firewall.
 
While URLs can include an authentication element, but Superfeedr will not treat these URLs with any specific security concern. For this reason, we strongly discourage including URLs with authentication mechanisms.

### XML based feeds

Our *historical* use case is to allow you to subscribe to RSS or Atom feeds and then have that content pushed to you in real-time. These are also normalized, to make consumption easier for you (see the [schema section](/schema.html)). Superfeedr supports RSS, Atom and RDF, as well as the most popular namespaces.

> An update is detected when **one or more item is added** to the feed you are subscribed to. The real-time push notification includes the new item(s) and some key attributes from the feed, like the title.

Each entry in a feed is mapped with a **unique identifier** - the `id` element in our schema. We will send you a notification for every **new** unique identifier we detect, whatever the rest of the entry is.We don’t rely on the title, links or even the signature of the entry’s content to detect updates.
 
This behaviour is **compliant with both RSS and Atom specifications**. If we’re not able to find a unique ID, Superfeedr generates one, using complex feed-specific rules.

#### Updates

If an entry is updated, they are *not propagated by default*. This is because we want to avoid creating numerous false positives.

There is, however, one exception.
 
If a new entry contains a valid, `updated` element, and the update is very recent (within three minutes), you will receive a notification. This means that we will usually propagate updates for feeds if we receive a ping from the publisher.

#### Errors

If a *feed goes into an error state* (say, if it’s putting up HTTP error codes, or we’ve been unable to parse content successfully), you’ll also receive a notification.
 
This will allow you to monitor the situation, and decide whether you want to maintain the subscription to that feed. These notifications will only include the status part of the [schema](/schema.html).

### JSON feeds

It is obviously possible to subscribe to any kind of JSON document.  In order to identify new content, we compute a hash signature of the whole document.
 
If that signature changes between two fetches, Superfeedr propagates the change by sending the full JSON document to your endpoint.
 
You will also receive a notification if a resource goes into an HTTP error state. These notifications will only include the status part of the [schema](/schema.html).

### HTML pages and fragments

Superfeedr also allows you to subscribe to HTML fragments within an HTML page.

A fragment is a portion of an HTML document, defined by a *CSS path*. You can subscribe to DOM elements inside a page as long as there is a CSS path that leads to them.
 
You will append the URL-escaped CSS path to the document URL, using the fragment part of the URL.
 
If there are multiple elements matching your CSS path, Superfeedr will concatenate each of them.

For example, if you want to subscribe to the `.h-entry` element of `http://blog.superfeedr.com`, you will need to subscribe to `http://blog.superfeedr.com#.h-entry`.

### JSON fragments

Much like subscribing to HTML fragments, Superfeedr also allows you to subscribe to parts of a JSON document, using the fragments API.
 
To do this, Superfeedr uses the [JSONPath](http://goessner.net/articles/JsonPath/) syntax. To build the topic url, you append the URL-escaped JSONPath to the document URL, using the fragment part of the URL.

#### Example

We have the following document at <code>http://for.sale/inventory.json</code>:

{% prism javascript %}
{ 
  "store": {
    "book": [ 
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      { "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
{% endprism %}

If you wanted to keep an eye on the price of the bicycle, you would subscribe to: `http://for.sale/inventory.json#%24.store.bicycle.price`. Want more examples? [Click here](http://goessner.net/articles/JsonPath/index.html#e3).

### Other Resources

When you are subscribing to any other type of HTML resource, Superfeedr will compute a signature from the bytes included in the document.
 
If the signature has changed when we next fetch the resource, you will receive the whole document again.
 
Note that timestamps, changes in tracking codes and so on can create false positives here.

### Redirects

When fetching resources, Superfeedr will follow up to five redirects. These can be permanent or temporary, and you will be notified of the content at the end of the redirect chain.
 
For this reason, we strongly recommend subscribing to the **canonical** URL of each resource.
 
## What API to choose

Superfeedr offers 2 different API : [XMPP PubSub](/subscribers.html#xmpppubsub) and [HTTP PubSubHubbub](/subscribers.html#webhooks).

Which API you choose to use will depend on your goal for using Superfeedr.

The first difference is that XMPP PubSub uses the XMPP protocol. This is a powerful protocol, but it is extremely different to HTTP. If you’re not familiar with XMPP, **stick with HTTP PubSubHubbub**.

The second difference is that HTTP PubSubHubbub is not accessible from behind the firewall. So, if you’re creating an app that doesn’t need to live on the Web, XMPP may be the better choice.

If you’re not sure about which one is right for you, we’re more than happy to talk you through it. Just shoot us an email at [info@superfeedr.com](mailto:info@superfeedr.com)

## Webhooks

Our API is based on the [PubSubHubbub](https://en.wikipedia.org/wiki/PubSubHubbub) protocol with a couple simplifications 

However, you can use your *subscriber* code with *any other hub*. You can also use any other library that supports and implements PubSubHubbub.

> To get the most out of Superfeedr and the PubSubHubbub protocol, we recommend reading the [PubSubHubbub spec](https://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html).

Our PubSubHubbub endpoint is at [https://push.superfeedr.com/](https://push.superfeedr.com/).

The key difference is that our endpoint uses [HTTP Basic Auth](https://httpd.apache.org/docs/1.3/howto/auth.html#basic) to [authenticate](/subscribers.html#addingfeedswithpubsubhubbub) your PubSubHubbub calls, making all the verification steps of each request optional.

And in case you want to manually specify an HTTP method different to the one used in the request, we also support the use of the `X-HTTP-Method-Override` HTTP header.

### HTTP Authentication

Authentication using the Webhooks API is performed through [HTTP Basic Autentication](http://tools.ietf.org/html/rfc2617). Most HTTP libraries will allow for an easy configuration with this. 
 
To get started with an authentication, use your Superfeedr login, then pick from one of these options for your password:

* A password token that [you can generate](https://superfeedr.com/tokens/new).
* Your main Superfeedr password (though we recommend using a token for security purposes).

If your HTTP library does not support HTTP headers, you should submit a base64 encoded string of `login:token` as a query string parameter named `authorization`.

#### Tokens 

You can create an unlimited number of tokens, with different combinations of rights associated with them:

* [Subscribe](/subscribers.html#addingfeedswithpubsubhubbub)
* [Unsubscribe](/subscribers.html#removingfeedswithpubsubhubbub)
* [List](/subscribers.html#listingfeedswithpubsubhubbub)
* [Retrieve](/subscribers.html#retrievingentrieswithpubsubhubbub) (used for [Streaming](/subscribers.html#streamingrss) as well)
* [XMPP](/subscribers.html#xmppauthentication) (see below)

The tokens **cannot** be used to log into the main Superfeedr site. 

Tokens can be made public – just keep in mind that any call made using them will be associated with your account. This means that if someone else makes a call with your token, it will be your account that is billed.

If you want your tokens to be private along with the rest of your account details, please remember to use `https` when sending authentication against our endpoint.

### Adding Feeds with PubSubHubbub

<div class="panel">
  <div class="panel-body"><span class="label label-default">POST</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>hub.mode</td>
        <td>required</td>
        <td><code>subscribe</code></td>
      </tr>
      <tr>
        <td>hub.topic</td>
        <td>required</td>
        <td>The URL of the HTTP resource to which you want to subscribe. It cannot be more than 2048 characters long.</td>
      </tr>
      <tr>
        <td>hub.callback</td>
        <td>required</td>
        <td>The webhook: it's the URL to which notifications will be sent. Make sure you it's web-accessible, ie not behind a firewall. Its size is currently limited to 250 characters.</td>
      </tr>
      <tr>
        <td>hub.secret</td>
        <td>optional, recommended</td>
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
        <td>
          <ul>
            <li><code>json</code> if you want to receive notifications as json format (for feeds only!). You can also use an <code>Accept</code> HTTP header like this: <code>Accept: application/json</code>.</li>
            <li><code>atom</code> if you explicitly want to receive notification as Atom. This is used by default for any resource that's either Atom or RSS.</li>
            <li>If you don't specify any, we will send you the data pulled from the HTTP resource, (excluding feeds).</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>retrieve</td>
        <td>optional</td>
        <td>If set to <code>true</code>, the response will include the current representation of the feed as stored in Superfeedr, in the format desired. Please check our <a href="/schema.html">Schema</a> for more details.</td>
      </tr>
  </tbody>
  </table>
</div>

Subscriptions at Superfeedr are a unique combination of a resource URL and a callback URL. If you resubscribe with both URLs, we will only keep one. If you use a different callback URL to the resource URL, we will keep both.

#### Example

{% prism markup %}
  curl https://push.superfeedr.com/ 
  -X POST 
  -u demo:demo 
  -d'hub.mode=subscribe' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
  -d'hub.callback=http://mycallback.tld/ok'
{% endprism %}

#### Response

Superfeedr will return `204` if the subscription was performed and `202` if the subscription has yet to be verified (only if you supplied a `hub.verify=async` parameter).

If you used the `retrieve` parameter, Superfeedr will return 200 and the content of the feed in the body.

If you receive a `422` HTTP response, please check the body, as it will include the reason for the subscription failure.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

### Removing Feeds with PubSubHubbub

This call uses the same syntax used in the section above on [adding feeds](/subscribers.html#addingfeedswithpubsubhubbub). The only difference is the `hub.mode` value.

<div class="panel">
  <div class="panel-body"><span class="label label-default">POST</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>

        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>
  </table>
</div>

#### Example

{% prism markup %}
curl https://push.superfeedr.com/ 
  -X POST 
  -u demo:demo 
  -d'hub.mode=unsubscribe' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
  -d'hub.callback=http://mycallback.tld/ok'
{% endprism %}

#### Response


Superfeedr will return `204` if the unsubscribe was successful, and `202` if the unsubscribe has yet to be verified (only if you supplied a `hub.verify=async` parameter).

If you receive a `422` HTTP response, please check the body, as it will include the reason for the unsubscribe failure.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

### Listing Subscriptions with PubSubHubbub

This call will allow you to retrieve subscriptions on your account. 
This call allows you to retrieve subscriptions on your account. You can also use the `search` parameter to find subscriptions to specific feeds.

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>hub.mode</td>
        <td>required</td>
        <td><code>list</code></td>
      </tr>
      <tr>
        <td>page</td>
        <td>optional</td>
        <td>If there are more than 20 matching subscriptions, you may want to paginate over them. First page (default) is 1.</td>
      </tr>
      <tr>
        <td>by_page</td>
        <td>optional</td>
        <td>Number of items per page. Max is 500. Min is 1.</td>
      </tr>
      <tr>
        <td>search</td>
        <td>optional</td>
        <td>A search query. Please <a href="#search-queries">see below</a> for the various fields and values to use.</td>
      </tr>
      <tr>
        <td>detailed</td>
        <td>optional</td>
        <td>Get feed details along with the subscriptions. Check the <a href="/schema.html">Schema section</a> for more details.</td>
      </tr>
    </tbody>
  </table>
</div>

By default, subscriptions are listed in order of creation. The oldest subscriptions are listed first, while the most recent is listed last. 

#### Example

{% prism markup %}
curl https://push.superfeedr.com/ 
  -G 
  -u demo:demo 
  -d'hub.mode=list' 
  -d'page=2'
{% endprism %}

#### Response

Superfeedr will return 200 with the list of matching subscriptions in a JSON format. If you supplied a callback parameter (JSONP), the JSON will be wrapped in it.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

{% prism javascript %}
[{
  "subscription": {
    "format": "atom",
    "endpoint": "http://mycallback.tld/ok",
    "secret": null,
    "feed": {
      "title": "Publisher example",
      "url": "http://push-pub.appspot.com/feed"
    }
  }
}]
{% endprism %}

#### Search Queries

Search queries are nested string parameters. We use the following keys:

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Query</th>
        <th>Note</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>format</code></td>
        <td>can either be <code>JSON</code> or <code>ATOM</code> and will return all subscription made using that format</td>
        <td><em>search[format]=json</em></td>
      </tr>

      <tr>
        <td><code>feed url</code></td>
        <td>an exact match of the feed url.</td>
        <td><em>search[feed][url]=http://blog.superfeedr.com/atom.xml</em> or <em>search[feed.url]=http://blog.superfeedr.com/atom.xml</em></td>
      </tr>

      <tr>
        <td><code>feed inurl</code></td>
        <td>string (sequence of characters) included in the URL. The match is done using n-grams so approchaing sequences will also match</td>
        <td><em>search[feed][inurl]=superfeedr</em> or <em>search[feed.inurl]=superfeedr</em></td>
      </tr>

      <tr>
        <td><code>feed hostname</code></td>
        <td>an exact match of the feed's URL hostname.</td>
        <td><em>search[feed][hostname]=blog.superfeedr.com</em> or <em>search[feed.hostname]=blog.superfeedr.com</em></td>
      </tr>

      <tr>
        <td><code>feed hostname</code></td>
        <td>an exact match of the feed's URL hostname.</td>
        <td><em>search[feed][hostname]=blog.superfeedr.com</em> or <em>search[feed.hostname]=blog.superfeedr.com</em></td>
      </tr>

      <tr>
        <td><code>endpoint jid</code></td>
        <td>an exact match of the jid when you subscribed with XMPP.</td>
        <td><em>search[endpoint][jid]=julien@superfeedr.com</em> or <em>search[endpoint.jid]=julien@superfeedr.com</em></td>
      </tr>

      <tr>
        <td><code>endpoint domain jid</code></td>
        <td>an exact match of the domain part of the jid when you subscribed with XMPP.</td>
        <td><em>search[endpoint][domain]=superfeedr.com</em> or <em>search[endpoint.domain]=superfeedr.com</em></td>
      </tr>

      <tr>
        <td><code>endpoint url</code></td>
        <td>an exact match of pubsubhubbub <code>hub.callback</code> URL.</td>
        <td><em>search[endpoint][url]=http://my.domain.tld/feed/1</em> or <em>search[endpoint.url]=http://my.domain.tld/feed/1</em></td>
      </tr>

      <tr>
        <td><code>endpoint inurl</code></td>
        <td>string (sequence of characters) included in the  <code>hub.callback</code> URL. The match is done using n-grams so approchaing sequences will also match</td>
        <td><em>search[endpoint][inurl]=domain</em> or <em>search[endpoint.inurl]=domain</em></td>
      </tr>

      <tr>
        <td><code>endpoint hostname</code></td>
        <td>an exact match of the <code>hub.callback</code>'s URL hostname.</td>
        <td><em>search[endpoint][hostname]=domain.tld</em> or <em>search[endpoint.hostname]=domain.tld</em></td>
      </tr>
    </tbody>
  </table>
</div>


### Retrieving Entries with PubSubHubbub

This call allows you to retrieve past entries from one or more feeds. Note that you need to be subscribed to the feed(s) in order to do this.

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>hub.mode</td>
        <td>required</td>
        <td><code>retrieve</code></td>
      </tr>
      <tr>
        <td>hub.topic</td>
        <td>optional</td>
        <td>The URL of the HTTP resource for which you want the past entries.</td>
      </tr>
      <tr>
        <td>hub.callback</td>
        <td>optional</td>
        <td>The value can either be a callback with which you are subscribed to one or more feeds or a search query that should match one or more callback urls used to subscribed to several feeds. Please, use the query syntax used to <a href="#search-queries">search for subscriptions</a>. In both cases, make sure there are less than 200 matching feeds.</td>
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
    </tbody>
  </table>
</div>

#### Example (retrieving by topic)

{% prism markup %}
curl https://push.superfeedr.com/ 
  -H 'Accept: application/json'
  -G 
  -u demo:demo 
  -d'hub.mode=retrieve' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
{% endprism %}

**Response:**

{% prism javascript %}
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
{% endprism %}

#### Example (retrieving by matching callback)

{% prism markup %}
curl https://push.superfeedr.com/ 
  -H 'Accept: application/json'
  -G 
  -u demo:demo 
  -d'hub.mode=retrieve' 
  -d'hub.callback=http://my.domain.com/webhook/1' 
{% endprism %}

#### Example (retrieving by searching callback)

{% prism markup %}
curl https://push.superfeedr.com/ 
  -H 'Accept: application/json'
  -G 
  -u demo:demo 
  -d'hub.mode=retrieve' 
  -d'hub.callback[endpoint][hostname]=my.domain.com' 
{% endprism %}

#### Response

Superfeedr will return `200` with the content if it could retrieve the past entries.

If you are not subscribed to the corresponding feed(s), or if the feed has not yet been added to Superfeedr, you will receive a `404`.

If you receive a `422` HTTP, please check the body as it will include the reason for the failure.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

### Streaming RSS

When retrieving past RSS content, it is possible to keep the HTTP connection to Superfeedr alive. This ensures new entries are sent directly to your client.

To do this, you need to use the `stream.superfeedr.com` endpoint:

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://stream.superfeedr.com</code>
  </div>
</div>

You will then perform a [retrieve call](/subscribers.html#retrievingentrieswithpubsubhubbub), as outlined above, with the following extra parameter:

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>wait</td>
        <td>required</td>
        <td><code>stream</code> or <code>poll</code></td>
      </tr>
    </tbody>
  </table>
</div>

#### Stream

If you supply the `stream` value, Superfeedr will return the content that corresponds to the retrieve API call. It will also keep the connection and serve any future entries to this connection.

##### Example:

{% prism bash %}
curl -G 'https://stream.superfeedr.com?wait=stream&hub.mode=retrieve&hub.callback=http://my.webhook.com/path&format=json' -u'demo:demo' -D-
{% endprism %}

#### Poll

If you supply the `poll` value, there are two potential responses.

* If Superfeedr has the content that corresponds to the retrieve API call (for past entries), the response will include that content. The connection will be closed after that.

* If Superfeedr does not have the corresponding content, then the connection will be kept alive until new entries are added to the feed. These new entries will then be served and the connection will be closed. If you use the `poll` value, we strongly recommend using the `after` query parameter as well. This will let you keep the connection open until new content has been added.

##### Example:

{% prism bash %}
curl -G 'https://stream.superfeedr.com?wait=stream&hub.mode=retrieve&hub.topic=http://push-pub.appspot.com/feed&format=json' -u'demo:demo' -D-
{% endprism %}

#### Server Sent Events

Superfeedr also supports [Server Sent Events](http://www.w3.org/TR/eventsource/) (or EventSource). This W3C specification defines a browser-side Javascript API to receive content from a server in the form of events.

##### Example:

{% prism javascript %}
var url = "https://stream.superfeedr.com/";
url += "&hub.mode=retrieve";
url += "&hub.topic=<topic url>";
url += "&authorization=<token>";

var source = new EventSource(url);
source.addEventListener("notification", function(e) {
  var notification = JSON.parse(e.data);
});
{% endprism %}

### PubSubHubbub Notifications

Notifications are POST requests that are sent to the callback you specified for the subscription. ​

The body of the response includes the notification, in the format you specified upon [subscription](/subscribers.html#addingfeedswithpubsubhubbub). Please check the [schema](/schema.html) if you need more detail on this.  

We consider notifications successful if we can reach your callback and it returns a `200` code. If the notification fails, we will **retry three times** after five, ten and 15 seconds (these times may vary slightly).

If we are not able to notify you after these additional attempts, we will drop the notification and you can use the [our retrieve feature](/subscribers.html#retrievingentrieswithpubsubhubbub), discussed above, to get the missing data.

Additionally, notifications will include the following headers for you to inspect:

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Header Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>

  </table>
</div>

#### Best Practice: use HTTPS

You should **always** use the `https` endpoints when sending requests to Superfeedr.
 
We also recommend using `https` for your own endpoints. This guarantees privacy and the integrity of the complete notification (including the headers).

#### Best Practice: use hub.secret

When subscribing to a feed, you should use `hub.secret`, unless you are using https for your callback URLs.
 
This secret will be used to compute a signature for each notification. You should always make sure these signatures match. You can [read more about that here](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html#authednotify) .

#### Best Practice: use different callback urls

Your callback urls should be *hard to guess*.

More importantly, you should **use different callbacks for each of your subscriptions**. 

This way, you can quickly identify which feed is involved in each notification, without having to parse the content.
 
It also makes it easier to identify problems using the access logs of your HTTP servers.

### Replaying Notifications

This call is mostly used as a debugging tool. It allows you to replay past notifications.

The token used to perform this call **must have** the `retrieve` right set to `true`.

<div class="panel">
  <div class="panel-body"><span class="label label-default">GET</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>hub.mode</td>
        <td>required</td>
        <td><code>replay</code></td>
      </tr>
      <tr>
        <td>hub.topic</td>
        <td>required</td>
        <td>The URL of the HTTP resource for which you want the past entries.</td>
      </tr>
      <tr>
        <td>hub.callback</td>
        <td>required</td>
        <td>The hub.callback parameter of the subscription.</td>
      </tr>
      <tr>
        <td>count</td>
        <td>optional</td>
        <td>Optional number of items you want to retrieve. Current max is 50 and default is 1.</td>  
      </tr>
      <tr>
        <td>async</td>
        <td>optional</td>
        <td>If set to true, Superfeedr will respond to this very request and issue the notification right <em>after</em>.</td>  
      </tr>
    </tbody>
  </table>
</div>

#### Example

{% prism markup %}
curl https://push.superfeedr.com/ 
  -G 
  -u demo:demo 
  -d'hub.mode=replay' 
  -d'hub.topic=http://push-pub.appspot.com/feed' 
  -d'hub.callback=http://mycallback.tld/ok'
{% endprism %}

#### Response

Superfeedr will return `204` if the notification was performed successfully.
 
If you are not subscribed to the feed, or if the feed has not yet been added to Superfeedr, you will receive a `404` response.

If you receive a `422` HTTP response, please check the body, as it will include the reason for the subscription failure.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

### PubSubHubbub API Wrappers

Multiple PubSubHubbub wrappers exist in a variety of languages. All of these should work fine with the Superfeedr endpoint.

You can also check [our Github](https://github.com/superfeedr/) repository for some platform-specific libraries, like our [Ruby Rack Gem](https://github.com/superfeedr/rack-superfeedr).

## XMPP PubSub

The XMPP API is based on the [XEP-0060 syntax](http://xmpp.org/extensions/xep-0060.html#subscriber-subscribe). Additional data has been included within a Superfeedr-specific namespace.

You can use the XMPP console of any XMPP desktop client to inspect that traffic.


### Authentication

You can connect your Jabber client to Superfeedr by using JID: `username@superfeedr.com` and your main Superfeedr password.

You should, however,[create a specific token](https://superfeedr.com/tokens/new) as long as this token enables the XMPP right.

You can also specify another JID in your user settings if you want to connect from our own XMPP server. This is the most flexible option, but it does require you to host your own XMPP server.

Finally, make sure your client sends you a `<presence>` stanza when they are fully connected.

### Adding Feeds with XMPP

Subscribing to a new feed will allow you to receive notifications for any new entries from that feed.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>

  </table>
</div>

#### Example

{% prism markup %}
<iq type="set" from="login@superfeedr.com" to="firehoser.superfeedr.com" id="sub1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub" xmlns:superfeedr="http://superfeedr.com/xmpp-pubsub-ext">
  <subscribe node="http://domain.tld/feed1.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/feed2.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/feed3.xml" jid="login@superfeedr.com"/>
  <subscribe node="http://domain.tld/path/to/resource" jid="login@superfeedr.com" superfeedr:format="atom" />
 </pubsub>
</iq>
{% endprism %}

You can add up to 20 resources in you subscription query, as long as they all have the same `subscribe[@jid]`.

If you need to subscribe with multiple JIDs, we suggest that you send multiple subscription queries.

#### Response

The server will acknowledge the subscription(s) and send the status information for each resource.

{% prism markup %}
<iq type="result" to="login@superfeedr.com/home" from="firehoser.superfeedr.com" id="sub1">
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
</iq>
{% endprism %}

In other cases, you will receive an iq with `type="error"`. Please check that your subscription query abides by the constraints described above.

### Removing Feeds with XMPP

When you remove a feed, you will stop receiving notifications from it.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>

  </table>
</div>

#### Example

{% prism markup %}
<iq type="set" from="login@superfeedr.com/home" to="firehoser.superfeedr.com" id="unsub1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub">
  <unsubscribe node="http://domain.tld/feed1.xml" jid="login@superfeedr.com"/>
  <unsubscribe node="http://domain.tld/feed2.xml" jid="login@superfeedr.com"/>
  <unsubscribe node="http://domain.tld/feed3.xml" jid="login@superfeedr.com" />
 </pubsub>
</iq>
{% endprism %}

You can remove up to 20 resources in your unsubscribe query.

#### Response

The server acknowledges the unsubscribe:

{% prism markup %}
<iq type="result" from="firehoser.superfeedr.com" to="login@superfeedr.com/home" id="unsub1" />
{% endprism %}

### Listing Feeds with XMPP

You can list your existing subscriptions. This list is paginated with 20 items per page.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
        <td>Page number (subscriptions will be sent by batches of 20).  First page (default) is 1.</td>
      </tr>

      <tr>
        <td>subscribe[@jid]</td>
        <td></td>
        <td>The jid for which you want to list subscriptions. If you used a component jid (using your own XMPP server), you can use a more specific jid to filter subscriptions by jid.</td>
      </tr>
    </tbody>
  </table>
</div>

#### Example

{% prism markup %}
<iq type="get" from="login@superfeedr.com/home" to="firehoser.superfeedr.com" id="subman1">
 <pubsub xmlns="http://jabber.org/protocol/pubsub" xmlns:superfeedr="http://superfeedr.com/xmpp-pubsub-ext">
  <subscriptions jid="login@superfeedr.com" superfeedr:page="3"/>
 </pubsub>
</iq>
{% endprism %}

#### Response 

The server sends the list of resources to which you are subscribed for the page requested. It will also send the status information for each item.

{% prism markup %}
<iq type="result"  to="login@superfeedr.com/home" id="subman1" from="firehoser.superfeedr.com">
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
</iq>
{% endprism %}

### Retrieving Entries with XMPP

It is possible to query Superfeedr for previous entries in feeds to which you are subscribed.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">

      <tr>
        <th>Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>

  </table>
</div>

#### Example

{% prism markup %}
<iq type='get' to="firehoser.superfeedr.com" id='items1'>
  <pubsub xmlns='http://jabber.org/protocol/pubsub'>
    <items node='http://domain.tld/path/to/resource'/>
  </pubsub>
</iq>
{% endprism %}

#### Response

At this point, you will get a maximum of ten items per feed.

{% prism markup %}
<iq from="firehoser.superfeedr.com" type="result" to="login@superfeedr.com/home" id="items1" >
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
</iq>
{% endprism %}

If you have not subscribed to the feed, you will receive the following response:

{% prism markup %}
<iq from="firehoser.superfeedr.com" type="result" to="login@superfeedr.com/home" id="items1" >
  <pubsub xmlns="http://jabber.org/protocol/pubsub">
    <items node="http://domain.tld/path/to/resource" >
    </items>
  </pubsub>
</iq>
{% endprism %}

### XMPP Notifications

Once you’re subscribed to a resource, your XMPP client **must be connected at all times**. You will miss messages if your client is offline for too long.

Please see the [schema](/schema.html) for details on the status, as well as the feed and entry information.

{% prism markup %}
<message from="firehoser.superfeedr.com" to="login@superfeedr.com">
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
</message>
{% endprism %}

### XMPP API Wrappers

XMPP *can be scary*. If you don’t want to mess with it, we have various wrappers for the XMPP API. These include [Ruby](https://github.com/superfeedr/superfeedr-rb), [Perl](https://github.com/superfeedr/superfeedr-perl), [Python](https://github.com/superfeedr/superfeedr-python), [Node.js](https://github.com/superfeedr/superfeedr-node), [Java](https://github.com/superfeedr/superfeedr-java) and [PHP](https://github.com/superfeedr/superfeedr-php). They are all available on our GitHub page.

If you need a wrapper in another language, get in touch! We’re available on [info@superfeedr.com](mailto:info@superfeedr.com).

And don’t forget – the community creates these wrappers. If you can make improvements, feel free to do so.


