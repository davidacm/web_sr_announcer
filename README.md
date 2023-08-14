# Web Sr Announcer

A small utility to send messages to screen readers using aria-live

> [See Demo](https://davidacm.github.io/webSrAnnouncer/)

## Install

```sh
npm install --save web_sr_announcer
```

Or for a CDN version, you can use it on
[unpkg.com](https://unpkg.com/web_sr_announcer)

```html
<script src="https://unpkg.com/web_sr_announcer"></script>
<script>
  webSrAnnouncer.initialize()
</script>
```

## Usage

```js
import webSrAnnouncer from "webSrAnnouncer" // or use the script tag using cdn.
webSrAnnouncer.initialize()

// just the message is needed.
webSrAnnouncer.announce("this is a test with default params")

// using all params.
webSrAnnouncer.announce("this is a test", "polite", 3000)
```

## functions.

### initialize.

this function creates or initializes the containers for the aria-live regions.
call this before use announce function, otherwise the first message can be lost.

    * nodeId: string, an optional param if you want to use your own html container for the aria live regions.

### announce.

update the aria-live region with the specified message. If a screen reader is
active, should speak the message.

this function has 3 params:

    * text: string, the text to be announced.
    * politeness: 'assertive' or 'polite', 'assertive' by default.
    * timeout: number, the time the message is available for screen readers. Default is 1000 ms.

### terminate.

removes the containers used for live regions. you usually don't need to use
this.
