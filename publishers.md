---
title: Publishers
description: Superfeedr's PubSubHubbub hubs for publishers are compliant with versions 0.3 and 0.4 of the spec; here's how to set them up.
layout: page
toc: {
  "Discovery": {},
  "Ping": {},
  "Subscription Callback": {},
  "Fat Pings": {},
  "Good Practices": {}
}
---

## Introduction

All the [PubSubHubbubb](http://pubsubhubbub.superfeedr.com/) hubs hosted here at Superfeedr are compliant with the core specifications for versions [0.3](http://pubsubhubbub.github.io/PubSubHubbub/pubsubhubbub-core-0.3.html) and [0.4](http://pubsubhubbub.github.io/PubSubHubbub/pubsubhubbub-core-0.4.html). To enable your publisher hub and get subscribers coming to your real-time feeds, you need to set up [discovery](#discovery) and [ping](#ping).

## Discovery

Discovery tells your current and future subscribers who poll your resources that they can get content from your Superfeedr hosted hub.It’s as easy as adding the following to your resources:

### Any HTTP resources

For HTTP resources, PubSubHubbub uses discovery in the HTTP Headers. Include the following HTTP Header as defined in [RFC5988](http://tools.ietf.org/html/rfc5988) with each resource.

{% prism javascript %}
Link: <https://your-hub-name.superfeedr.com/>; rel="hub"
Link: <http://your.resource.url>; rel="self"
{% endprism %}

### RSS

For RSS feeds, you need to add the links in the `channel` section of your feed.

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

For RSS feeds, you need to add the links in the `feed` section of your feed.

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

The next step is to ping the hub whenever you update the content of any resource. This will allow us to fetch this specific resource, identify what is new, and then push the update to your subscribers.

Send a POST request to `http://<your-hub-name>.superfeedr.com/`, with the following keys and values:

* `hub.mode="publish"`
* `hub.url=<the URL of the resource that was updated>`

You can submit multiple URLs per ping, either by using an array syntax like `hub.url[]=<url1>` and `hub.url[]=<url2>`, or by sending a comma-separated list of url-encoded URLs like this `hub.url=<url1>,<url2>`.

As a spam filtering measure, our server will always return `204` when you ping us. Your Superfeedr analytics lets you visualise successful pings received on your hub.

*Note*: If you’ve already implemented any type of ping, please get in touch, as we can probably receive it – we want to make it as easy as possible for you to implement the PubSubHubbub protocol.

## Subscription callback

**This feature is for Pro Hubs only**.

Your Superfeedr hosted hub allows access to your feeds, and we want to make sure you have direct control over this.

* If you want to *allow subscription*, just return `204`.
* If you do not want to allow the subscription, please return `401`.
  * Please include your reason for refusal in the body of the response as text, so we can forward this to the subscriber. The message can include requirements for subscription to your hub (such as the inclusion of an API key or contact information). We will forward any additional parameter submitted by the subscriber to your callback URL.

If the URL is not accessible, or if you don’t return a `204` code, we will refuse all subscriptions to the resource.

## Fat Pings

**This feature is for Pro Hubs only**.

If you have millions of feeds in our system, and are constantly pinging us with new content, we suggest you **fat ping*** us instead. The standard PubSubHubbub protocol specifies that the publisher (you) does light pings to the hub, because the origin of these pings cannot be verified. When we get a light ping, we will poll your feed to identify the new content.

However, this polling can become expensive and draining if you have tens of thousands of feeds – or more. In this case, performing fat pings is much more time and cost effective. You will use the same syntax as light pings, but you would add two additional parameters:

* `hub.content` : the content of the feed, including only the new entry or entries. Superfeedr will parse this content directly, rather than polling your feeds.
* `hub.signature` : this is an HMAC signature computed with the secret shown in your hub’s settings, and the `hub.content`. This lets us know the content is coming from you and hasn’t been forged by a third party.


## Good Practices

If you publish XML feeds (RSS or Atom), there are **good practices** that you should make sure to respect. This will *increase adoption and engagement* with your content.

### One feed per resource

A resource can be the home page of your site, a section, an author's page... etc. In an ideal world, you should have *distinct feeds for each of these resources*. However, you should always make sure to have **only one feed per resource**. Don’t use both RSS and ATOM: pick one! Any decent reader can consume both, so make your job easy by only maintaining a single format.

### Feed Auto-Discovery

Feed URLs are not "guessable". Every website uses a different pattern which is why you need to make your **XML feeds are discoverable**. This mechanism is used by feed readers and search engine to find your feeds when the user enters a domain name of a page's URL. For this, HTML offers a great mechanism: the `<head>` section. Here's an example:

{% prism markup %}
<html>
  <head>
    <!-- Auto-discovery: -->
    <link rel="alternate" type="application/rss+xml" title="title-of-the-page" href="url-of-the-feed">
    <!--  -->
  </head>
  <body>
    <!-- the web page's contents -->
  </body>
</html>
{% endprism %}

Make sure to use a **meaningful title** (not RSS or feed!), and replace `application/rss+xml` with `application/atom+xml` if your feed is in the ATOM format. It's also considered good practice to use absolute URLs for the `href`.

It's important that you have **bi-directional links** between your HTML resources and your XML feeds which point to each others.

You can find more details on this [RSS board page](http://www.rssboard.org/rss-autodiscovery).


### Keep your feeds valid

As opposed to HTML, feeds have a pretty **strong semantic aspect**. This means that it's important to respect to respect the format and schema you picked. There exists multiple tools to make sure your feeds are valid: [W3C's validator](https://validator.w3.org/feed/), [Flipboard's Validator](https://feedvalidator.flipboard.com/), [FeedValidator](http://feedvalidator.org/), [RSS Board's validator](http://www.rssboard.org/rss-validator/)... etc.

Here's also a list of DOs and DON’Ts:

* Use unique (immutable) identifiers for entries : `<guid>` in RSS and `<id>` in ATOM
* Use a valid date format: [ISO8601](https://en.wikipedia.org/wiki/ISO_8601).
* Use the *Roman Calendar*.
* It’s ok to have only `<summary>` instead of the full `<content>` but don’t show it as full content if it’s just a summary.



