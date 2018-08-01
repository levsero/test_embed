## SEO and the Zendesk Web Widget

### The short version

The Zendesk Web Widget is loaded dynamically using an `<iframe>` element. While search engines such as Google crawl iframes, the presence of the Web Widget in a given page should have no impact —negative or positive— on a website's SEO ratings.

### A bit more detail

An `<iframe>` element allows a web page to "insert" or embed another page within it using a simple markup tag. You can think of it as a window of variable size to another website or page. It's also used widely as a way to embed rich media such as video, audio or, in our case, the Zendesk Web Widget.

The content inside the iframe is not considered by search engines to be part of that page. As a result, no rankings are passed on or "diluted" by content that may appear in the iframe.

The implication in the case of the Web Widget is that nothing inside it will have an effect on its containing site's SEO rankings.

Since the Web Widget's iframe is dynamically constructed, it does not have an external URL as a source and you _do not_ need to take any additional steps (such as modifying a `robots.txt` file or adding `noindex, nofollow` meta tags) to ensure your rankings are not diluted.

This also means you cannot rely on the Web Widget to have search engines index content, such as Help Center articles. In that case, you should [ensure your Help Center is host-mappped](https://support.zendesk.com/hc/en-us/articles/203664356-Changing-the-address-of-your-Help-Center-subdomain-host-mapping-) and add conventional links to the article or articles you'd like to index and rank.

### Additional Reading

* [<iframe>: The Inline Frame element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
* [How iFrames (Don’t) Affect SEO](http://tentacleinbound.com/articles/how-iframes-affect-seo)
* [Using iFrame: SEO and Accessibility Points](https://www.searchenginejournal.com/iframe-seo-and-accessibility/15217/)
