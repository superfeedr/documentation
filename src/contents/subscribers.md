---
title: Subscribers
template: index.jade
toc: {
  "Introduction": {},
  "What can you subscribe to": {
    "XML based feeds": {},
    "JSON feeds": {},
    "HTML fragments": {},
    "Other": {}
  },
  "What API to choose": {},
  "PubSubHubbub": {
    "Adding Feeds with PubSubHubbub": {},
    "Removing Feeds with PubSubHubbub": {},
    "Listing Feeds with PubSubHubbub": {},
    "Retrieving Entries with PubSubHubbub": {},
    "PubSubHubbub Notifications": {},
    "PubSubHubbub API Wrappers": {}
  },
  "XMPP PubSub": {
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

Urls may include an authentication element, but please, note that Superfeedr will not treat these urls with any kind of specific security concern, which means that we strongly discourage providing urls with an authentication mechanism.

Please see below for a couple examples.

### XML based feeds

Our *historical* use case is to allow you to subscribe to RSS or Atom feeds and get that content pushed to you in realtime. These are also normalized (see the [schema section](/schema.html)) for easier consumption on your end. We support RSS, Atom and RDF.

Updates will be detected when one or more entry (or item) as been added to the feed and the notification will only include this (or these) new items as well as part of the feed's main attributes (title, ... etc).

We map each entry in a feed with a unique identifier (the id element in our [schema](/schema.html)). Hence, we will send you a notification for each **new unique identifier** that we can detect, whatever the rest of the entry is. This means that *we won't use the title, or the links* or even a signature of the entries's content to detect update. We believe the behavior we chose is **compliant with the both the RSS and Atom specifications**. When we are not able to find a unique id, we will generate one, using complex rules that vary from feed to feed.

Updates in an entry are by default not propagated because we chose to avoid numerous false positives. There is an exception to that: we will send you a notification for an update in a feed if both the entry contains a valid "updated" element, and that update is very recent (less than 3 minutes). In practice that means that we will mostly propagate updates for feeds for which we received a ping by the publisher.

We will also send you notification when a *feed is an error state* (either at the HTTP level, with HTTP error codes or when we were unable to successfully parse its content)so that you can monitor things and decide whether you want to keep or drop a subscription for that specific faulty feed. These notification will only include the status part of our [schema](/schema.html).

### JSON feeds

It is obviously possible to subscribe to any kind of JSON document. To identify new content, we will compute a hash signature of the whole document. If that signature changes between 2 fetches, we will propagate the change by sending the full JSON document to your endpoint.

This present the significant disadvantage of triggering updates even when minor changes happen, like whitespace changes... etc. In practive though, most libraries generating JSON are deterministic and will always produce the same output, given the same input.

### HTML fragments

### Other


## What API to choose

## Webhooks
### Adding Feeds with PubSubHubbub
### Removing Feeds with PubSubHubbub
### Listing Feeds with PubSubHubbub
### Retrieving Past Entries & Feed Status with PubSubHubbub
### PubSubHubbub Notifications
### PubSubHubbub API Wrappers
## XMPP PubSub
### Adding Feeds with XMPP
### Removing Feeds with XMPP
### Listing Feeds with XMPP
### Retrieving Past Entries & Feed Status with XMPP
### Notifications with XMPP
### Wrappers with XMPP
