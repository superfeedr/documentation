---
title: Trackers
layout: page
toc: {
  "Introduction": {},
  "Building": {
    "Queries": {},
    "Quotes": {},
    "site:": {},
    "link:": {},
    "language:": {},
    "porn:ok": {},
    "bozo:ok": {}
  },
  "Testing": {},
  "Scope": {}
}
---

## Introduction

You may want to subscribe transversally to any entry that matches a certain query, rather than subscribing to single feeds. The most common use case is to subscribe to any entry which matches a given keyword.

Only the "Tracker" users can use track feeds. However, the API calls for **subscribing**, **unsubscribing**, **listing** or **retrieving** past entries are the same that "[Subscriber](/subscribers.html)" users can use for *regular* feeds, using either the [PubSubHubbub API](subscribers.html#webhooks) or the [XMPP API](/subscribers.html#xmpp-pubsub).

## Building Track Feeds

Track feeds are *virtual* feeds in a sense that they're generated *on the fly* as long as their URL matches the following criteria:

* Can be `http` or `https`
* Uses the `track.superfeedr.com` hostname
* Has a `query` query string param whose value is the query itself.

Here's an example of track feed: `http://track.superfeedr.com/?query=superfeedr`. You can also use a `format` query string which `atom` or `json` as values. You should refer to our [schema](/schema.html) section for details on both ATOM and JSON.

### Queries

Queries are the equivalent of search queries. They contain several members separated by spaces. Each member is either a keyword or a flag with an associated value. Spaces are interpreted as `AND`.

Some special characters are also supported:

* \+ signifies AND operation
* \- negates the following member
* \| signifies OR operation
* \" (quote) wraps a number of tokens to signify a phrase for searching
* \( and \) indicate precedence

Here are valid examples of queries:

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>superfeedr</code></td>
        <td>will match any mention of <code>superfeedr</code></td>
      </tr>
      <tr>
        <td><code>laurel hardy</code></td>
        <td>will match any menion of <code>laurel</code> AND <code>hardy</code> in the same document. Both words can be appart.</td>
      </tr>
      <tr>
        <td><code>romeo -juliette</code></td>
        <td>will match any mention of <code>romeo</code> that does not have a mention of <code>juliette</code></td>
      </tr>
      

      <tr>
        <td><code>paris (texas | france)</code></td>
        <td>will match any mention of <code>paris</code> along with <code>texas</code> or <code>france</code>.</td>
      </tr>

      <tr>
        <td><code>"new york"</code></td>
        <td>will match any mention of <code>new york</code> (with <code>new</code> and <code>york</code> being consecutive.)</td>
      </tr>
      <tr>
        <td><code>"AAPL"</code></td>
        <td>will match any mention of <code>AAPL</code> but not <code>aapl</code>.</td>
      </tr>

    </tbody>
  </table>
</div>


### site:

The `site:` flag allows you to define from which site the content must have been published. The value needs to be any domain or subdomain and will match the host from which the content has been published.

The value is a hostname (full domain or subdomain) of the publishing site. You can add at most one `site:` per query.

Examples:

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pubsubhubbub site:blog.superfeedr.com</code></td>
        <td>will match any mention of <code>pubsubhubbub</code> published on <a href="http://blog.superfeedr.com/">our blog</a>.</td>
      </tr>

      <tr>
        <td><code>superfeedr site:techmeme.com</code></td>
        <td>will match any mention of <code>superfeedr</code> published on Techmeme</td>
      </tr>
      
    </tbody>
  </table>
</div>


You can use the *negation* of this flag by using `-site:` as a flag. In this case, however, you can use several `-site:` flags.

This is useful when refining tracking feeds for which a lot of content is coming from the same sources.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>apple -site:techmeme.com -site:techcrunch.com</code></td>
        <td>will match any mention of <code>apple</code> unless they're from either Techmeme or Techcrunch.</td>
      </tr>      
    </tbody>
  </table>
</div>


### link:

The `link:` flag allows you to select only the documents which include a link to a a specific page, or a domain.

You can add at most one `link:` per query.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>link:https://superfeedr.com/</code></td>
        <td>Only entries with a link to <a href="https://superfeedr.com/">our home page</a>.</td>
      </tr>

      <tr>
        <td><code>link:runscope.com</code></td>
        <td>Only entries with a link to any page with the <code>runscope.com</code> domains.</td>
      </tr>      
    </tbody>
  </table>
</div>

Similarly to `site`, You can use the *negation* of this flag by using `-link:` as a flag. You can have multiple `-link:` values.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pubsubhubbub -link:superfeedr.com -link:google.com</code></td>
        <td>will match any mention of <code>pubsubhubbub</code> unless it points to either superfeedr.com or google.com.</td>
      </tr>      
    </tbody>
  </table>
</div>


### language:

Superfeedr is able to extract the language of every entry individually. This means you can filter entries matching a specific language or excluse those from specific languages using  `-language`. A given entry cannot have more than one language, which mean you can't use more than one `language` operand. However, you can exclude multiple languages using multiple `-language` operands. The value should be the 2 letter value of the language using [ISO_639-1](https://en.wikipedia.org/wiki/ISO_639-1).

Please note that in some cases, we are unable to extract the language (not enough test, contradicting text with combination of 2 languages... etc). 

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>language:en</code></td>
        <td>will match only entries explicitly using the english language. If we are unable to extract the language, this won't match.</td>
      </tr>

      <tr>
        <td><code>-language:it</code></td>
        <td>will exclude entries which use the italian language. If the language can't be determined, the entries will not match.</td>
      </tr>
      
    </tbody>
  </table>
</div>

### porn:

By default, Superfeedr tries to identify porn content and will filter it out of matching requests. Please note that this algorithm "learns" from any given feed before it can start to classify an entry as porn, which means that if the exclusion of porn content is an absolute requirement, you should *also* implement filtering on your side.

That said, for some cases, (building porn filters for example!), it makes sense to **disable** our porn filter. You can achieve this by adding `porn:ok` to your query.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>porn:ok plug</code></td>
        <td>Will send any mention of <code>plug</code>, whether they are from porn feeds or not.</td>
      </tr>

    </tbody>
  </table>
</div>

### bozo:

Similar to porn filtering, Superfeedr is able to filter out matching entries from feeds we consider broken or spammy. For example, some feeds will generate infinite amounts of data using a random `id` for each new entry.

You can disable this filtering by using `bozo:ok`.

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Query</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>bozo:ok ham</code></td>
        <td>Will send any mention of <code>ham</code>, whether they are from spam feeds or not.</td>
      </tr>
    </tbody>
  </table>
</div>

## Testing

Tracking feeds are prospective, which means that you should use them to receive *upcoming* entries that match them. Because of that, it's not always simple to refine search queries because you have to wait for matches to improve them.

Superfeedr offers a *search* API which lets you match your tracking feeds queries against historical data. You can then quickly identify how to refine your queries for tracking feeds.

<div class="panel">
  <div class="panel-body"><span class="label label-default">POST</span>&nbsp;<code>https://push.superfeedr.com</code>
  </div>
</div>

<div class="box">
  <table class="feed-table table">
    <thead class="box__header">
      <tr>
        <th>Parameter Name</th>
        <th>Note</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>hub.mode</td>
        <td>required</td>
        <td><code>search</code></td>
      </tr>
      <tr>
        <td>query</td>
        <td>required</td>
        <td>The query you want to match. Please see previous sections on how to build search queries.</td>
      </tr>
      <tr>
        <td>format</td>
        <td>optional</td>
        <td>
          <code>json</code> or <code>atom</code> (default).
        </td>
      </tr>
  </tbody>
  </table>
</div>

#### Example

{% prism markup %}
  curl https://push.superfeedr.com/ 
  -X POST 
  -u demo:demo 
  -d'hub.mode=search' 
  -d'query=superfeedr' 
{% endprism %}

#### Response

Superfeedr will return `200` with the corresponding representation of the search results matching your query. Please, refer to our [schema section](/schema.html) for details.

If you receive a `422` HTTP response, please check the body, as it will include the reason for the subscription failure.

Other HTTP response codes are outlined in the [HTTP spec](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

## Scope

The scope for tracking feeds is the *total* number of feeds processed by Superfeedr. This includes feeds subscribed by [subscribers](https://superfeedr.com/subscriber) and feeds published by [publishers](https://superfeedr.com/publisher) subscribed by at least one subscriber on their hubs. 

We are working on extending this coverage to include any subscribed feed on the web.
