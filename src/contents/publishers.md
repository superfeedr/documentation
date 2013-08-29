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

<ul class="nav nav-tabs">
  <li class="active"><a href="#http-discovery" data-toggle="tab">All HTTP resources</a></li>
  <li><a href="#rss-discovery" data-toggle="tab">RSS</a></li>
  <li><a href="#atom-discovery" data-toggle="tab">ATOM</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="http-discovery">
    <pre class="language-bash"># For HTTP resources, PubSubHubbub uses discovery in the HTTP Headers.
# Include the following HTTP Header with each resource:
Link: &lt;http://your-hub-name.superfeedr.com/&gt;; rel=&quot;hub&quot;
Link: &lt;http://your-resource-url&gt;; rel=&quot;self&quot;</pre>
  </div>
  <div class="tab-pane" id="rss-discovery">
    <pre class="language-markup"><code><?xml version="1.0"?>
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
</rss></code></pre>
  </div>
  <div class="tab-pane" id="atom-discovery">
    <pre class="language-markup"><code><?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
 <title>...</title>
 <link href="..." rel="self" type="application/atom+xml"/>

 <!-- PubSubHubbub Discovery -->
 <link rel="hub" href="http://<your-hub-name>.superfeedr.com/" />
 <!-- End Of PubSubHubbub Discovery -->

 <updated>...</updated>
 <id>...</id>
 ...
</feed>></code></pre>
  </div>
</div>

## Ping

The next step is to ping the hub whenever you update the content of any resource. This will allow us to fetch this specific resource, identify what is new vs. what is old in it and finally push the updates to the subscribers.

<pre class="language-bash">Send an POST request to http://&lt;your-hub&gt;.superfeedr.com, with the following params and values:
  * hub.mode="publish"
  * hub.url=&lt;the url of the feed that was updated&gt;
</pre>

Note: At Superfeedr, we wanted to make it simple for you to implement the PubSubHubbub protocol, so if you have implemented any type of ping, please get in touch, as we're probably able to receive these too. For example, we porvide an XML-RPC endpoint...
