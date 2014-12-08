---
title: Misc
layout: page
toc: {
  "Track": {},
  "IP list": {}
}
---

## Track

More than feeds, you may want to *subscribe transversally* to any entry that matches a certain condition. For example, you may want to receive any entry that contains a keyword... Our track feeds allow you to achieve this.

### Building Queries

We've built track so that you can use the **exact same calls** to subscribe, unsubscribe and receive notification than for any other feed (using both the [XMPP](/subscribers.html#xmpppubsub) and [PubSubHubbub](/subscribers.html#webhooks) APIs).

The next step consist in building your track feed. They all start with the same prefix url: <code>http://superfeedr.com/track</code>. You then complete them with query string parameters based on what you need.

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
  <td>If you set this to <code>ok</code>, we will not filter data from bozo sources. Check the [status section of our schema](/schema.html#status) for more details.</td>
</tr>
</table>

#### Examples

* `http://superfeedr.com/track?include=superfeedr` : Any mention of "superfeedr" will match.

* `http://superfeedr.com/track?include=starbucks&lat=37.781841&lon=-122.420311&within=10` : Any mention of starbucks within 10km of San Francisco.

* `http://superfeedr.com/track?include=france,paris` : Any entry that matches both france and paris.

* `http://superfeedr.com/track?include=apple&exclude=iphone` : Any mention of Apple, without iPhone.

## IP list

If you use Superfeedr to host your hub, you may want to make sure we can access your content. Similarly, if you're a subscriber, you may want to make sure you don't prevent us from sending you updates. Our IP list is below.

You can also certainly check the **UserAgent**, however, we have a tendency to change them quite often to communicate with other servers. You can still check that it contains Superfeedr. 

You should see most of our requests from theses guys (used for fetching and parsing):

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

Please remember that we can add or remove IPs to this list at any time, as we mostly use cloud services. Do not implement any blocking or limitation based on this list. 
