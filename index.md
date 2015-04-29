---
layout: page
title: Introduction
toc: {
  "Table of Contents": {},
  "Audience": {},
  "Playing in the open": {},
  "Support and Questions": {},
  "Contribution": {},
  "Definitions": {
    "Publisher": {},
    "Subscriber": {},
    "Tracker": {}
  }
}
---

Maintaining real-time feeds – either to publish on them or to consume from them – is expensive and time-consuming.

If you’re a publisher, [Superfeedr](http://superfeedr.com) provides a real-time API that allows you to publish unlimited content, while providing push notifications to all your subscribers. 

And if you’re a subscriber, the [Superfeedr](http://superfeedr.com) Push API brings you every update as it happens. 

The following documentation outlines all the key features of Superfeedr, and will show you how it can be seamlessly integrated into a wide range of infrastructures.

So whether you’re a publisher wanting to leverage your RSS for SEO purposes, or a subscriber wanting instant results without any messy RSS to JSON conversions, you’re in the right place.


## Table of Contents

You can find links to the pages below in the top menu bar as well.

* [Introduction](/): this page
* [Subscribers](/subscribers.html): your app consumes RSS feeds
* [Publishers](/publishers.html): your app publishes RSS feeds
* [Trackers](/trackers.html): your app subscribes to keywords
* [Schema](/schema.html): learn about the data sent by Superfeedr
* [Misc](/misc.html): extra features and information.

## Who this is for
If you’re a Superfeedr user, we’re assuming you have a strong knowledge of the web’s main protocols, and how to work within their design constraints. 

## Why we use open protocols

We like to think of the web as an ecosystem. And the more resources any ecosystem has, the more it thrives. That’s why Superfeedr uses **open protocols** over proprietary APIs.  

We built Superfeedr on *existing protocols and implementations*, so you would be able to get easy access to existing libraries and modules that will interact with our endpoints. 

This makes your life much easier, and saves you from wasting precious time and resources learning a new system.

Using these resources will help you get the most out of Superfeedr, and we really encourage you to make use of them.

## Support and Questions

For any question, you may either email us directly ([info@superfeedr.com](info@superfeedr.com)) or use the [Issues Section](https://github.com/superfeedr/documentation/issues?page=1&state=open). We will try to respond as quickly as possible on either channel.

## Contribution

Is something wrong? Let us know! Any discrepancy, typo, or gap in the information – we want to hear about it! If you come across an issue, please **fork** the repository and send us a **pull request**. 
## Definitions

### Publisher

Superfeedr publishers are *applications* that produce and serve content for subscribers to consume. Ideally, new content would be added or updated regularly, to be sent to interested subscribers.

### Subscriber

A Superfeedr subscriber is an *application* that consumes content published to third party feeds. Subscribers register their interest in receiving notifications whenever new content is published. 

### Tracker

A Superfeedr tracker is an *application* that consumes content based on queries including keywords, meta-data and other fields. They register their queries (subscription) and receive notifications as soon as the data has been published.
