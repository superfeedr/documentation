---
title: Superfeedr Documentation
template: index.jade
toc: {
  "Table of Contents": {},
  "Audience": {},
  "Playing in the open": {},
  "Support and Questions": {},
  "Contribution": {},
  "Definitions": {
    "Publisher": {},
    "Subscriber": {}
  }
}
---

[Superfeedr](http://superfeedr.com) provides a realtime API to any application who wants to produce (publishers) or consume (subscribers) data feeds without wasting resources and maintaining an expensive and changing infrastructure.

This documentation shows how to integrate Superfeedr into a variety of diverse infrastructure, as well as highlights most of the features offered by Superfeedr.

## Table of Contents

You can find links to the pages below in the top menu bar as well.

* [Introduction](/): this page
* [Subscribers](/subscribers.html): your app consumes RSS feeds
* [Publishers](/publishers.html): your app publishes RSS feeds
* [Schema](/schema.html): learn about the data sent by Superfeedr
* [Misc](/misc.html): extra features and information.


## Audience
It is expected that the reader has a strong knowledge of the web's main protocols, as well as its design constraints. 

## Playing in the open
As we believe the web is a better ecosystem when **open protocols** are favored over proprietary APIs, we have decided to build on *existing protocols and implementations*. This means that there exists several libraries and modules, which, even though they have not been built with Superfeedr in mind could (and should!) be used to interract with our endpoints. We also strongly encourage that you inspect these protocols and the data formats to extract the biggest value out of them.

## Support and Questions

For any question, you may either email us directly (info@superfeedr.com) or use the [Issues Section](/superfeedr/documentation/issues). We will try to respond as quickly as possible on either channel.

## Contribution

If you see any discrepancy, typo or if you wish to add any missing information, please, **fork** that repository, and send us a **pull request**. *You're in a better position than us to make this doc awesome for you!*

## Definitions

### Publisher

A publisher is an *application* which produces and serves content to be consumed by subscribers. Ideally, new content is regularly added or updated and subscribers may be interested in receiving that content when it's been published.

### Subscriber

In Superfeedr's context, a subscriber is an *application* which consumes content published by 3rd party sites and services in the form of feeds. Subscribers register their interest in getting later notifications when the content to which they subscribed was updated.

