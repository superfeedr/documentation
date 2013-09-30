---
title: Schema & Data Formats
template: index.jade
toc: {
  "Status": {},
  "Entry": {},
  "JSON": {}
}
---

> This section mostly applies to **feed** subscriptions. If you're subscribing to arbitrary content resources, we will send you the exact content of the resource to which you've subscribed. Some of the status information is available to non-feeds resources as well.

Whatever the original format (RSS, Atom, or any other namespace) is, the notification that we will send to subscribers will use **standard ATOM**, as well as a few other namespaces detailed below. We will match as much as we can into this format. The overall goal here is to make it easy for the subscriber to consume a consistent schema.

## Status

Upon notifications, when subscribing ([XMPP](/subscribers.html#xmpppubsub) only), or when retrieving a resource's content from Superfeedr, you'll see that it *may* include the following information. This data is useful for you to know the current state of a resource. Please note that some items my be missing at some point, either because we haven't processed the feed yet, or because they wouldn't be accurate.

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>

<tr>
  <td>status[@feed]</td>
  <td>&nbsp;</td>
  <td>contains the URL of the resource</td>
</tr>

<tr>
  <td>http[@code]</td>
  <td>&nbsp;</td>
  <td>last HTTP status code, please see <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html">Status Code Definitions</a></td>
</tr>

<tr>
  <td>http</td>
  <td>&nbsp;</td>
  <td>the content of that tag is a more explicit log message for your information</td>
</tr>

<tr>
  <td>next_fetch</td>
  <td>&nbsp;</td>
  <td>the resource will be fetched at most before this time</td>
</tr>

<tr>
  <td>period</td>
  <td>&nbsp;</td>
  <td>the polling frequency in seconds for this resource (at least 60 seconds for feeds and at least 300 seconds for arbitrary content)</td>
</tr>

<tr>
  <td>last_fetch</td>
  <td>&nbsp;</td>
  <td>the last time at which we fetched the resource</td>
</tr>

<tr>
  <td>last_parse</td>
  <td>&nbsp;</td>
  <td>the last time at which we parsed the resource. It happens that we fetch a resource and do not parse it as its content hasn't been modified</td>
</tr>

<tr>
  <td>last_maintenance_at</td>
  <td>&nbsp;</td>
  <td>Each resource inside Superfeedr has a maintenance cycle that we use to detect stale resource, or related resource. We normally run maintenance at most every 24hour for each resource, but this is a low priority task, so it may go beyond this</td>
</tr>

<tr>
  <td>entries_count_since_last_maintenance</td>
  <td>only upon notification</td>
  <td>The number of updates in the resource since we last ran the maintenance script. This is a very good indicator of the verboseness of a resource. You may want to remove resources that are too verbose</td>
</tr>

<tr>
  <td>title</td>
  <td>only upon notification</td>
  <td>The feed title</td>
</tr>

<tr>
  <td>publisher</td>
  <td>only upon retrieve</td>
  <td>Set to true if Superfeedr hosts a hub for this feed.</td>
</tr>

</table>

#### Example

<pre class="language-markup"><code><status feed="http://domain.tld/feed.xml" xmlns="http://superfeedr.com/xmpp-pubsub-ext">
  <http code="200">9718 bytes fetched in 1.462708s : 2 new entries.</http>
  <next_fetch>2013-05-10T11:19:38-07:00</next_fetch>
  <period>900</period>
  <last_fetch>2013-05-10T11:19:38-07:00</last_fetch>
  <last_parse>2013-05-10T11:17:19-07:00</last_parse>
  <last_maintenance_at>2013-05-10T09:45:08-07:00</last_maintenance_at>
  <entries_count_since_last_maintenance>5</entries_count_since_last_maintenance>
  <tilte>Lorem Ipsum</tilte>
</status></code></pre>

## Entry Schema (feeds only)

Notification entries will have the following form. It is standard ATOM. Please note that an entry might not have all of them.

Here are the components used to build the entries. Please note that they may use specific namespaces.

### Link

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>link[@href]</td>
  <td></td>
  <td>the url related to the parent node</td>
</tr>

<tr>
  <td>link[@rel]</td>
  <td>optional</td>
  <td>the type of relation to that parent node (alternate, reply... etc)</td>
</tr>
<tr>
  <td>link[@type]</td>
  <td>optional</td>
  <td>MimeType of the link destination (text/html by default)</td>
</tr>
<tr>
  <td>link[@title]</td>
  <td>optional</td>
  <td>the link title</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><link href="http://domain.tld/entries/12345" rel="alternate" type="text/html" title="The sky is Blue" />
<link href="http://domain.tld/entries/12345/comments.xml" rel="replies" type="application/atom+xml" title="Comments on The sky is Blue" /></code></pre>

### Category

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>category[@term]</td>
  <td>optional, multiple</td>
  <td>a keyword related to the entry... (tag, category or topic)</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><category term="tag" />
<category term="category" /></code></pre>

### Point

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>entry[@point]</td>
  <td>optional, multiple</td>
  <td>geolocation data. Contains a [georss](http://georss.org/) latitude and longitude. It's either extracted from the story or extrapolated from the content.</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><point xmlns="http://www.georss.org/georss">47.597553 -122.15925</point></code></pre>

### Author

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>author</td>
  <td>optional, multiple</td>
  <td>Author information</td>
</tr>
<tr>
  <td>name</td>
  <td>optional</td>
  <td>the author's name (or nickname)</td>
</tr>
<tr>
  <td>email</td>
  <td>optional</td>
  <td> the author's email address</td>
</tr>
<tr>
  <td>uri</td>
  <td>optional</td>
  <td>the author's URI</td>
</tr>
<tr>
  <td>object-type</td>
  <td>optional, multiple</td>
  <td>the object type, defined in the ActivityStreams spec</td>
</tr>
<tr>
  <td>link</td>
  <td>optional, multiple</td>
  <td>links (see above). They can include links to the author's profile, to the user's avatar...</td>
</tr>

</table>

#### Example

<pre class="language-markup"><code><author>
 <name>John Doe</name>
 <email>john@superfeedr.com</email>
 <uri>http://twitter.com/superfeedr</uri>
 <as:object-type>http://activitystrea.ms/schema/1.0/person</as:object-type>
 <link type="image/png" title="John Doe" href="http://domain.tld/john.png" rel="image"/>
</author></code></pre>

### Object

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>object</td>
  <td>optional, multiple</td>
  <td>ActivityStreams</td>
</tr>
<tr>
  <td>object-type</td>
  <td>optional, multiple</td>
  <td>the object type, defined in the ActivityStreams spec</td>
</tr>
<tr>
  <td>id</td>
  <td>optional</td>
  <td>the unique identifier of the object</td>
</tr>
<tr>
  <td>title</td>
  <td>optional</td>
  <td>the title of the object</td>
</tr>
<tr>
  <td>published</td>
  <td>optional</td>
  <td>the publication date (iso8601) of the object</td>
</tr>
<tr>
  <td>updated</td>
  <td>optional</td>
  <td>the updated date (iso8601) of the object</td>
</tr>
<tr>
  <td>content</td>
  <td>optional</td>
  <td>the content of the object</td>
</tr>
<tr>
  <td>author</td>
  <td>optional, multiple</td>
  <td>author information (see above)</td>
</tr>
<tr>
  <td>category</td>
  <td>optional, multiple</td>
  <td>categories (see above)</td>
</tr>
<tr>
  <td>link</td>
  <td>optional, multiple</td>
  <td>links (see above)</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><as:object-type>http://gowalla.com/schema/1.0/spot</as:object-type>
<as:object-type>http://activitystrea.ms/schema/1.0/place</as:object-type>
<id>object-id</id>
<title>Title of the Object</title>
<published>2013-04-20T15:00:40+02:00</published>
<updated>2013-04-21T14:00:40+02:00</updated>
<content>hello world</content>
<author>
  <name>Second</name>
  <uri>http://domain.tld/second</uri>
  <email>second@domain.tld</email>
</author>
<link type="text/html" title="" href="http://domain.tld/object/2" rel="alternate"/>
<link type="text/html" title="" href="http://domain.tld/object/2" rel="alternate"/></code></pre>

### Verb

<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>verb</td>
  <td>optional, multiple</td>
  <td>defined in the ActivityStreams spec</td>
</tr>
</table>

#### Example

<pre class="language-markup"><code><as:verb>http://activitystrea.ms/schema/1.0/post</as:verb></code></pre>

### Entries

Entries may include all the above elements. They also contain specific nodes, listed below.


<table class="table table-striped table-condensed table-responsive">
<tr>
  <th>Name</th>
  <th>Note</th>
  <th>Value</th>
</tr>
<tr>
  <td>entry[@xml:lang]</td>
  <td>optional</td>
  <td>The language of the entry. It's either extracted or computed from the content (the longer the content, the more relevant).</td>
</tr>
<tr>
  <td>entry[@title]</td>
  <td></td>
  <td>The title of the entry.</td>
</tr>
<tr>
  <td>entry[@published]</td>
  <td>optional</td>
  <td>The publication date (iso8601) of the entry.</td>
</tr>
<tr>
  <td>entry[@updated]</td>
  <td>optional</td>
  <td>The last updated date (iso8601) of the entry.</td>
</tr>
<tr>
  <td>entry[@content]</td>
  <td>optional</td>
  <td>The content of the entry. Check the type attribute to determine the mime-type.</td>
</tr>
<tr>
  <td>entry[@summary]</td>
  <td>optional</td>
  <td>The summary of the entry. Check the type attribute to determine the mime-type.</td>
</tr>
<tr>
  <td>entry[@source]</td>
  <td>optional</td>
  <td>The source of the entry. It includes all the available feed level elements, such as the feed title, the feed links, the feed's author(s)... etc. It's extremely useful for track feeds.</td>
</tr>
</table>

<pre class="language-markup"><code><entry xmlns="http://www.w3.org/2005/Atom" xmlns:geo="http://www.georss.org/georss" xmlns:as="http://activitystrea.ms/spec/1.0/" xml:lang="en">
   <id>domain.tld:09/05/03-1</id>
   <published>2013-04-21T14:00:40+02:00</published>
   <updated>2013-04-21T14:00:40+02:00</updated>
   <title>Entry published on hour ago</title>
   <content type="text">Entry published on hour ago when it was shinny outside, but now it's raining</content>
   <summary type="text">Entry published on hour ago...</summary>
   <geo:point>47.597553 -122.15925</geo:point>
   <link type="text/html" title="" href="http://domain.tld/entry/1" rel="alternate"/>
   <link type="application/atom+xml" title="" href="http://domain.tld/entry/1.xml" rel="replies"/>
   <link type="image/png" title="A beautiful picture that illustrates the entry" href="http://domain.tld/entry/image_.png" rel="picture"/>
   <category term="Things"/>
   <category term="Picture"/>
   <author>
      <name>First</name>
      <uri>http://domain.tld/first</uri>
      <email>first@domain.tld</email>
      <id>id-first</id>
      <title>First</title>
      <as:object-type>http://activitystrea.ms/schema/1.0/person</as:object-type>
      <as:object-type>http://activitystrea.ms/schema/1.0/dude</as:object-type>
      <link type="image/png" title="A beautiful picture that illustrates the author" href="http://domain.tld/first.png" rel="picture"/>
      <link type="text/html" title="The profile page of the author" href="http://domain.tld/first/profile" rel="alternate"/>
  </author>
  <author>
      <name>Second</name>
      <uri>http://domain.tld/second</uri>
      <email>second@domain.tld</email>
  </author>
  <as:verb>http://activitystrea.ms/schema/1.0/post</as:verb>
  <as:verb>http://activitystrea.ms/schema/1.0/publish</as:verb>
  <as:object>
      <as:object-type>http://gowalla.com/schema/1.0/spot</as:object-type>
      <as:object-type>http://activitystrea.ms/schema/1.0/place</as:object-type>
      <id>object-id</id>
      <title>Title of the Object</title>
      <published>2013-04-20T15:00:40+02:00</published>
      <updated>2013-04-21T14:00:40+02:00</updated>
      <content>hello world</content>
      <author>
         <name>Second</name>
         <uri>http://domain.tld/second</uri>
         <email>second@domain.tld</email>
     </author>
     <link type="text/html" title="" href="http://domain.tld/object/2" rel="alternate"/>
     <link type="text/html" title="" href="http://domain.tld/object/2" rel="alternate"/>
  </as:object>
  <source>
    <id>feed-id</id>
    <title>feed-title</title>
    <updated>2013-04-21T14:00:40+02:00</updated>
    <link href="http://domain.tld/entries/12345" rel="alternate" type="text/html" title="The sky is Blue" />
    <link href="http://domain.tld/entries/12345/comments.xml" rel="replies" type="application/atom+xml" title="Comments on The sky is Blue" />
  </source>
</entry></code></pre>

## JSON

Superfeedr offers the ability to subscribe to Atom and RSS feeds, but receive notifications (both via [XMPP](/subscribers.html#xmpppubsub) and [PubSubHubbub](/subscribers.html#webhooks)) in JSON. It's a mapping of our Atom schema. This mapping was created with the goal of being compatible with the [OSync](http://osync.org/) and [ActivityStreams](http://activitystrea.ms/) JSON schemas.

* Dates: the dates shown are Epoch Timestamps, expressed in UTC.
* Keys: expressed as camel case.

#### Example

<pre class="language-javascript"><code>{
 "status": {
   "entriesCountSinceLastMaintenance": 24,
   "lastParse": 1290793065,
   "period": "600",
   "lastMaintenanceAt": 1290778665,
   "feed": "http://domain.tld/feed.xml",
   "lastFetch": 1290796665,
   "code": 200,
   "title": "A wonderful feed",
   "nextFetch": 1290803865,
   "http": "Awesome we got the feed right"
  },
  "items": [
   {
    "geo": {
     "type": "point",
     "coordinates": [
      47.597553,
      -122.15925
     ]
    },
    "standardLinks": {
     "picture": [
      {
       "type": "image/png",
       "href": "http://domain.tld/entry/image_.png",
       "title": "A beautiful picture that illustrates the entry"
      }
     ],
     "replies": [
      {
       "type": "text/html",
       "href": "http://domain.tld/entry/1.xml",
       "title": ""
      }
     ]
    },
    "permalinkUrl": "http://domain.tld/entry/1",
    "verb": "publish",
    "content": "Entry published on hour ago when it was shinny outside, but now it's raining",
    "published": 1271851240,
    "actor": {
     "displayName": "First",
     "image": "http://domain.tld/first.png",
     "permalinkUrl": "http://domain.tld/first/profile",
     "id": "id-first",
     "objectType": "dude",
     "title": "First"
    },
    "categories": [
     "Things",
     "Picture"
    ],
    "id": "domain.tld:09/05/03-1",
    "object": {
     "permalinkUrl": "http://domain.tld/object/2",
     "content": "hello world",
     "published": 1271768440,
     "actor": {
      "displayName": "Second",
      "permalinkUrl": "http://domain.tld/second"
     },
     "id": "object-id",
     "updated": 1271851240,
     "title": "Title of the Object",
     "objectType": "place"
    },
    "title": "Entry published on hour ago",
    "updated": 1271851240,
    "source": {
      "id": "http://blog.superfeedr.com/",
      "title": "Superfeedr Blog",
      "updated": 1245776753,
      "permalinkUrl": "http://blog.superfeedr.com/"
    }
   },
   {
    "permalinkUrl": "http://www.macrumors.com/2009/05/06/adwhirl-free-ad-supported-iphone-apps-can-very-lucrative/",
    "published": 1241616887,
    "content": "Mobile advertising company AdWhirl issued a report (PDF) that details the success of some of the top ad-supported iPhone apps. AdWhirl serves 250 million ad impressions monthly to over 10% of the top 50 Apps in the App Store.br /\n   br /\n   br /\n   ...",
    "id": "http://www.macrumors.com/2009/05/06/adwhirl-free-ad-supported-iphone-apps-can-very-lucrative/",
    "title": "AdWhirl: Free Ad-Supported iPhone Apps Can Be Very Lucrative"
   }
  ],
  "subtitle": "This is certainly a wonderful feed that you need to read!",
  "standardLinks": {
   "canonical": [
    {
     "type": "application/atom+xml",
     "href": "http://feed.domain.tld/main.xml",
     "title": null
    }
   ],
   "self": [
    {
     "type": "application/atom+xml",
     "href": "http://domain.tld/feed.xml",
     "title": null
    }
   ]
  },
  "id": "http://domain.tld/feed.xml",
  "title": "A wonderful feed",
  "updated": 1290800265
 }</code></pre>

It is recommended that you check the schema for some of the feeds to which you subscribe to endure that all the required field for your application are included. Feel free to get in touch if you miss any content in the feeds.
