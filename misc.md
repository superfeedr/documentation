---
title: Misc
layout: page
toc: {
  "Track": {},
  "IP list": {}
}
---

## Track

You may want to *subscribe transversally* to any entry that matches a certain condition, rather than subscribing to single feeds. For example, you might want to receive every entry that contains a particular keyword.

Our track feeds make this effortless.

### Building Queries

We’ve built track so that you can use **exactly the same calls** to subscribe, unsubscribe and receive notifications for any feed, using both the [XMPP](/subscribers.html#xmpppubsub) and [PubSubHubbub](/subscribers.html#webhooks) APIs.  

The next step consists of building your track feed.

All track feeds start with the same prefix URL: `http://superfeedr.com/track`. You then complete the URL with query string parameters based on what you want to track.

<table class="table table-striped table-condensed table-responsive">
  <tr>
    <th>Name</th>
    <th>Note</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>include</td>
    <td>required</td>
    <td>Just add as many keywords that you need, separated by a coma. Each of these words needs to have at least 4 characters. Please note that each word will be downcased and stemmed (english stemming only for now). This means that "HOUSING" will match also "house", and "technologies" will match "technology". You need at least one 'include' for any track search.</td>
  </tr>
  <tr>
    <td>exclude</td>
    <td>optional</td>
    <td>Exclude the keywords you don't need.</td>
  </tr>
  <tr>
    <td>lang</td>
    <td>optional, defaults to any</td>
    <td>Matches only items in the language requested. Must be the 2 letter ISO 639 denomination.</td>
  </tr>
  <tr>
    <td>Geo-filtering</td>
    <td>optional, disabled</td>
    <td>Provide 3 params : lat (latitude), lon (longitude) and within (in kilometers), to specify a central point and a radius within which you want the entries. You cannot exclude a circle just yet.</td>
  </tr>
  <tr>
    <td>hub</td>
    <td>optional</td>
    <td>Filtering based on the hub: use the hub's url for the host to filter content from this hub only.</td>
  </tr>
  <tr>
    <td>porn</td>
    <td>optional</td>
    <td>If you set this to <code>ok</code>, we will not filter data from porn sources.</td>
  </tr>
  <tr>
    <td>bozo</td>
    <td>optional</td>
    <td>If you set this to <code>ok</code>, we will not filter data from bozo sources. Check the <a href="/schema.html#status">status section of our schema</a> for more details.</td>
  </tr>
</table>

#### Examples

* `http://superfeedr.com/track?include=superfeedr` : Any mention of "superfeedr" will match.

* `http://superfeedr.com/track?include=starbucks&lat=37.781841&lon=-122.420311&within=10` : Any mention of starbucks within 10km of San Francisco.

* `http://superfeedr.com/track?include=france,paris` : Any entry that matches both france and paris.

* `http://superfeedr.com/track?include=apple&exclude=iphone` : Any mention of Apple, without iPhone.

## IP list

If you use Superfeedr to host your hub, it’s important that we can access your content in order to send your RSS PuSH notifications.

Similarly, if you’re a subscriber, it’s important that we can send you the updates you want.

To make sure you get what you’re after, our IP list is below:

{% prism markup %}
supernoder1 50.116.30.23
supernoder2 198.58.103.28
supernoder3 198.58.103.36
supernoder4 198.58.102.49
supernoder5 198.58.103.91
supernoder6 198.58.102.95
supernoder7 198.58.103.92
supernoder8 198.58.102.96
supernoder9 198.58.103.114
supernoder10 198.58.102.117
supernoder11 198.58.103.115
supernoder12 198.58.102.155
supernoder13 198.58.102.156
supernoder14 198.58.103.158
supernoder15 198.58.102.158
supernoder16 198.58.103.160
supernoder17 198.58.103.102
supernoder18 50.116.28.209
supernoder19 198.58.96.215
supernoder20 198.58.99.82
{% endprism %}

You can also check the **UserAgent**, although we change them frequently to communicate with other servers. You can still check that it contains Superfeedr though.

You should see most of our requests for parsing and fetching from addresses on the IP list above.

Please keep in mind that we may add or remove IPs from this list, as we mostly use cloud services. Please don’t implement any blocking or limitations based on this list.
