---
title: Publishers
layout: page
toc: {
  "Discovery": {},
  "Ping": {},
  "Subscription Callback": {},
  "Fat Pings": {}
}
---

The [PubSubHubbubb](http://pubsubhubbub.superfeedr.com/) hubs that Superfeedr hosts are compliant with the core spec (version [0.3](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html) and [0.4](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.4.html)). In order to enable the hub, as a publisher you need to perform two actions : [discovery](#discovery) and [ping](#ping).

## Discovery

Discovery is aimed at informing your current (and future) subscribers (who poll your resources) that they can get content from your Superfeedr hosted hub. It's as easy as adding the following to your resources:

### Any HTTP resources

For HTTP resources, PubSubHubbub uses discovery in the HTTP Headers.
Include the following HTTP Header as defined in [RFC5988](http://tools.ietf.org/html/rfc5988) with each resource:

{% prism javascript %}  
Link: <https://your-hub-name.superfeedr.com/>; rel="hub"
Link: <http://your.resource.url>; rel="self"
{% endprism %}  

### RSS

{% prism markup %}  
<?xml version="1.0"?>
<rss>
 <channel>
  <title>...</title>
  <description>...</description>
  <link>...</link>

  <!-- PubSubHubbub Discovery -->
  <link rel="hub"  href="https://your-hub-name.superfeedr.com/" xmlns="http://www.w3.org/2005/Atom" />
  <link rel="self" href="http://your.feed.url" xmlns="http://www.w3.org/2005/Atom" />
  <!-- End Of PubSubHubbub Discovery -->
  ...
 </channel>
</rss>
{% endprism %}  

### Atom

{% prism markup %}  
<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom">
 <title>...</title>
 <link href="http://your.feed.url" rel="self" type="application/atom+xml"/>

 <!-- PubSubHubbub Discovery -->
 <link rel="hub" href="https://<your-hub-name>.superfeedr.com/" />
 <!-- End Of PubSubHubbub Discovery -->

 <updated>...</updated>
 <id>...</id>
 ...
</feed>
{% endprism %}  

## Ping

The next step is to ping the hub whenever you update the content of any resource. This will allow us to fetch this specific resource, identify what is new vs. what is old in it and finally push the updates to the subscribers.

Send a POST request to <code>http://&lt;your-hub-name&gt;.superfeedr.com/</code>, with the following keys and values:

* <code>hub.mode="publish"</code>
* <code>hub.url=&lt;the URL of the resource that was updated&gt;</code>

Note: we wanted to make it simple for you to implement the PubSubHubbub protocol, so if you have implemented any type of ping, please get in touch, as we're probably able to receive these too. For example, we provide an XML-RPC endpoint...

## Subscription callback

**This feature is for Pro Hubs only**.

Your Superfeedr hosted hub allows access to your feeds. We want to make sure you have control over this. If you enter a URL in the subscription callback field of your hub's settings, we will forward any subscription request to any of your resources.

* If you want to *allow subscription*, just return `204`.
* If you don't want to allow the subscription, please return `401`. Also, please include any reason for the refusal in the body of the response (as text). We will forward that to the subscriber. The message can also include requirements for subscription to your hub, like the inclusion of an API key, contact information, etc. We will forward to your callback URL any additional parameter submitted by the subscriber.

If the URL is not accessible, or if you don't return a 204 code, we will refuse any subscription to it.

## Fat Pings

**This feature is for Pro Hubs only**.

If you have millions of feeds in our system and are constantly pinging us for new content, we suggest you start to **fat ping us**

The standard PubSubHubbub protocol specifies that the publisher (you) does light pings to the hub, because the origin of these pings cannot be verified. When we get a light ping, we will then poll your feed to identify the new content.

However, this polling can become pretty expensive if you have tens of thousands of feeds and more. In this case, you can start to perform fat pings.

You will use the same syntax as light pings, but add 2 additional parameters :

* `hub.content` : the content of the feed, including **only** the new entry(ies). We will directly parse this content, rather than poll the feed.
* `hub.signature` : this is an HMAC signature computed with the secret shown in your hub's settings, and the `hub.content`. This will allow us to know that this content is coming from you and wasn't forged by a 3rd party.



