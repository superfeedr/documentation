---
title: Publishers
template: index.jade
toc: {
  "Discovery": {},
  "Ping": {}
}
---

The [PubSubHubbubb](http://pubsubhubbub.superfeedr.com/) hubs that Superfeedr hosts are compliant with the core spec (version [0.3](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html) and [0.4](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html)). In order to enable the hub as a publisher, you need to perform 2 actions : [discovery](#discovery) and [ping](#ping).

## Discovery

Discovery is aimed at informing your current (and future) subscribers (who poll your resources) that they can get content from your Superfeedr hosted hub. It's as easy as adding the following to your resources:


#### Any HTTP resources

```
# For HTTP resources, PubSubHubbub uses discovery in the HTTP Headers.
# Include the following HTTP Header with each resource:
Link: <http://your-hub-name.superfeedr.com/> rel="hub"
Link: <http://your-resource-url> rel="self"
```

#### RSS

```xml
<?xml version="1.0"?>
<rss>
 <channel>
  <title>...</title>
  <description>...</description>
  <link>...</link>

  <!-- PubSubHubbub Discovery -->
  <link rel="hub"  href="http://your-hub-name.superfeedr.com/" xmlns="http://www.w3.org/2005/Atom" />
  <link rel="self" href="your-feed-url" xmlns="http://www.w3.org/2005/Atom" />
  <!-- End Of PubSubHubbub Discovery -->
  ...
 </channel>
</rss>
```

#### Atom

```xml
<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom">
 <title>...</title>
 <link href="..." rel="self" type="application/atom+xml"/>

 <!-- PubSubHubbub Discovery -->
 <link rel="hub" href="http://<your-hub-name>.superfeedr.com/" />
 <!-- End Of PubSubHubbub Discovery -->

 <updated>...</updated>
 <id>...</id>
 ...
</feed>
```

## Ping

The next step is to ping the hub whenever you update the content of any resource. This will allow us to fetch this specific resource, identify what is new vs. what is old in it and finally push the updates to the subscribers.

Send an POST request to <code>http://&lt;your-hub&gt;.superfeedr.com</code>, with the following params and values:

* <code>hub.mode="publish"</code>
* <code>hub.url=&lt;the url of the feed that was updated&gt;</code>

Note: we wanted to make it simple for you to implement the PubSubHubbub protocol, so if you have implemented any type of ping, please get in touch, as we're probably able to receive these too. For example, we porvide an XML-RPC endpoint...
