import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** First-party pages these three chapters cite that the shared source list does not carry. */
const SOURCES = {
	dnsNetworkErrors: {
		title: "Google: How network and DNS errors affect Google Search",
		url: "https://developers.google.com/crawling/docs/troubleshooting/dns-network-errors",
	},
	pauseBusiness: {
		title: "Google Search Central: Pausing or disabling a website",
		url: "https://developers.google.com/search/docs/crawling-indexing/pause-online-business",
	},
	sitemapsOverview: {
		title: "Google Search Central: What is a sitemap",
		url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
	},
	largeSitemaps: {
		title: "Google Search Central: Manage your sitemaps with sitemap index files",
		url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps",
	},
	imageSitemaps: {
		title: "Google Search Central: Image sitemaps",
		url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps",
	},
	videoSitemaps: {
		title: "Google Search Central: Video sitemaps",
		url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps",
	},
	newsSitemaps: {
		title: "Google Search Central: News sitemaps",
		url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap",
	},
	sitemapsReport: {
		title: "Search Console Help: Sitemaps report",
		url: "https://support.google.com/webmasters/answer/7451001",
	},
	mdnHsts: {
		title: "MDN: Strict-Transport-Security header",
		url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security",
	},
	hstsPreload: {
		title: "HSTS Preload List Submission",
		url: "https://hstspreload.org/",
	},
	mdnUpgradeInsecure: {
		title: "MDN: CSP upgrade-insecure-requests",
		url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/upgrade-insecure-requests",
	},
	mdnVary: {
		title: "MDN: Vary header",
		url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Vary",
	},
} satisfies Record<string, ISeoIssueSource>;

/** Which of the tracker's checks look at a subject, so each chapter ends on what to open next. */
function CheckedHere({ checks }: { checks: string }) {
	return (
		<Text size="sm" c="dimmed">
			<b>Checked here by:</b> {checks}
		</Text>
	);
}

const STATUS_DETAILS = [
	{
		code: "200 OK",
		url: "The content goes on to be processed and may be indexed — but a 200 guarantees nothing. An empty page, or one whose text is an error message, ends up as a soft 404.",
		crawl: "No effect.",
		use: "Any working page.",
	},
	{
		code: "204 No Content",
		url: "There is no content, so there is nothing to process.",
		crawl: "No effect.",
		use: "Not for pages meant to be in search.",
	},
	{
		code: "301 / 308",
		url: "Google follows it to the target and ignores the body of the redirect itself. A strong signal that the target is the canonical address: the new URL appears in results over time.",
		crawl: "Each hop is a separate request.",
		use: "The address has changed for good: a new URL, domain, protocol or host.",
	},
	{
		code: "302 / 303 / 307",
		url: "Google follows it to the target, but the signal is weak: the original URL usually stays in results. The target can still become the canonical if other signals point at it.",
		crawl: "Each hop is a separate request.",
		use: "Short term: a temporary campaign, a section being reworked, a product briefly unavailable.",
	},
	{
		code: "304 Not Modified",
		url: "The content has not changed since the last crawl. No effect on indexing; the page's signals may still be recomputed.",
		crawl: "Saves resources: an answer with no body.",
		use: "The answer to a conditional request (If-None-Match / If-Modified-Since) when the page has not changed.",
	},
	{
		code: "404 / 410",
		url: "The content is ignored. An indexed URL is dropped over time; one met for the first time is not processed at all. Google treats every 4xx but 429 the same way.",
		crawl: "That URL is crawled less and less; no effect on the site's crawl rate.",
		use: "404 — the page does not exist; 410 — removed on purpose and for good.",
	},
	{
		code: "401 / 403",
		url: "Like any 4xx: not indexed, the content ignored.",
		crawl: "No reduction. Google explicitly advises against using them to throttle Googlebot.",
		use: "Private sections, member areas, staging sites.",
	},
	{
		code: "429",
		url: "Treated as a server error, like a 5xx.",
		crawl: "Reduces it.",
		use: "The server really is overloaded — as a brief measure.",
	},
	{
		code: "500 / 502 / 503 / 504",
		url: "URLs already indexed are kept at first, but drop out if the errors persist; new ones are not indexed.",
		crawl: "Reduces it — the more URLs answer with an error, the more. The rate climbs back gradually after recovery.",
		use: "503 with Retry-After — planned work, for hours, at most a day or two.",
	},
	{
		code: "DNS, timeout, connection reset",
		url: "Like a 5xx, but with no content at all. Indexed URLs that stay unreachable drop out of the index within days.",
		crawl: "Falls immediately.",
		use: "Never — this is an outage to fix.",
	},
] as const;

const REDIRECT_SYMPTOMS = [
	{
		symptom: "Months after a move, the old URLs are still the ones in results.",
		cause: "The redirect is temporary (302 or 307) — often the default in a CMS, a framework or a CDN rule.",
		fix: "Change it to 301 or 308; check each kind of old address with curl.",
	},
	{
		symptom: "Page indexing reports “Redirect error”.",
		cause: "A loop (A → B → A), a chain longer than 10 hops, an empty or broken Location. The classic is the http ↔ https loop: the CDN talks to the origin over HTTP, and the origin, not seeing HTTPS, sends it back to https.",
		fix: "Walk the chain with curl -sIL; behind a proxy, test X-Forwarded-Proto rather than the connection's scheme, and switch the CDN to full SSL to the origin.",
	},
	{
		symptom: "Deleted pages show up as Soft 404.",
		cause: "“Not found” is served with a 200, or every removed address is redirected to the home page.",
		fix: "404 or 410 when there is no replacement; redirect only to a page that genuinely replaces it.",
	},
	{
		symptom: "Crawl stats shows a sharp fall in requests and a rising share of 5xx or 429.",
		cause: "An overloaded server, or bot protection (a WAF, rate limits) answering Googlebot with an error.",
		fix: "Fix the server's capacity; let the real Googlebot through by verifying it with reverse DNS or the published IP ranges, not by User-Agent.",
	},
	{
		symptom: "After a week of maintenance, pages started dropping out of the index.",
		cause: "The site answered 503 for longer than that code is meant for.",
		fix: "503 for hours, a day or two at most; for a long closure, an indexable holding page that answers 200.",
	},
] as const;

/** Status codes and redirects: what Google does with each answer, and how to set and test redirects. */
export function StatusRedirectsSection() {
	return (
		<GuideSection
			section={S.statusRedirects}
			sources={[
				SRC.httpStatusCodes,
				SOURCES.dnsNetworkErrors,
				SRC.redirects,
				SRC.siteMove,
				SOURCES.pauseBusiness,
			]}
		>
			<Text>
				The status code is the first thing Googlebot learns about a URL, before any content.
				It decides whether the content is processed at all, which address ends up in
				results, and how fast Google crawls the site from then on. “Technical SEO” has the
				short cheat sheet; this chapter is how Google handles each class of answer, how to
				set redirects up, and how to test all of it on a live site.
			</Text>
			<Text>
				The rule that matters: Google looks at the code, not at what a person sees. A tidy
				“Not found” page served with a 200 is, to Google, an ordinary page — one it will
				later mark as a soft 404. The bodies of 3xx and 4xx answers it discards entirely. So
				test the response headers, not the browser tab.
			</Text>

			<Text fw={600}>How Google handles each status code</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={130}>Code</Table.Th>
						<Table.Th>What Google does with the URL</Table.Th>
						<Table.Th>Crawl rate</Table.Th>
						<Table.Th>When to use it</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{STATUS_DETAILS.map((row) => (
						<Table.Tr key={row.code}>
							<Table.Td fw={600}>{row.code}</Table.Td>
							<Table.Td>{row.url}</Table.Td>
							<Table.Td>{row.crawl}</Table.Td>
							<Table.Td>{row.use}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				<b>404 or 410?</b> Google's documentation says it plainly: every 4xx but 429 is
				handled the same way. The difference sometimes claimed (that a 410 leaves the index
				slightly sooner) does not matter in practice — pick the code that says the truth.{" "}
				<b>Planned work:</b> answer 503 with a <Code>Retry-After</Code> header (seconds or a
				date) and an informative page; while the site answers 503, Google cannot refresh the
				titles, the descriptions or the structured data.
			</Text>

			<Text fw={600}>Permanent and temporary redirects</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>301 = 308, 302 = 307 (303 is temporary too).</b> Within each pair there is no
					difference to Google. 307 and 308 differ for browsers and HTTP clients: they
					forbid changing the request method (a POST stays a POST). For pages of a site,
					all that matters is “for good or not”.
				</List.Item>
				<List.Item>
					<b>A permanent redirect</b> is one of the strongest canonicalisation signals:
					Google moves the choice of canonical to the target and consolidates the old
					URL's signals there. <b>A temporary one</b> leaves the original address in
					results. Google's own people have said more than once that a redirect left
					temporary for years may eventually be treated as permanent — but the
					documentation does not say so, and it is not something to count on: if the move
					is permanent, use a 301.
				</List.Item>
				<List.Item>
					<b>meta refresh and JavaScript redirects</b> are only visible to Google once it
					has fetched and parsed the HTML, and JavaScript only after rendering, which is
					deferred and may not happen. Other search engines and AI assistants' crawlers
					often do not run JavaScript at all. These are fallbacks for when there is no
					server-side redirect; the last resort is a visible “This page has moved” link.
				</List.Item>
				<List.Item>
					<b>Chains.</b> Google's crawlers follow up to 10 hops by default, but every hop
					is one more request and one more delay for the reader. For a move Google advises
					pointing straight at the final address, and no more than three hops if that is
					impossible. For robots.txt the limit is stricter — five hops (see “robots.txt in
					detail”). Google's testing tools, URL Inspection among them, do not follow
					redirects: inspect the final address separately.
				</List.Item>
			</List>

			<Text fw={600}>One hop to the canonical address: nginx</Text>
			<Text size="sm">
				Every variant — <Code>http://</Code>, <Code>www</Code>, both at once — reaches{" "}
				<Code>https://example.com</Code> in a single hop, keeping the path and the query:
			</Text>
			<Code block>
				{`# http://example.com and http://www.example.com -> https://example.com
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

# https://www.example.com -> https://example.com
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.example.com;
    ssl_certificate     /etc/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.com/privkey.pem;
    return 301 https://example.com$request_uri;
}

# the canonical host serves the site
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com;
    # ...
}`}
			</Code>
			<Text fw={600}>The same in Apache (.htaccess, mod_rewrite)</Text>
			<Code block>
				{`RewriteEngine On
# not HTTPS, or the www host -> one 301 to the canonical address
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\\. [NC]
RewriteRule ^ https://example.com%{REQUEST_URI} [R=301,L]`}
			</Code>
			<Text size="sm">
				The trap: behind a CDN or a load balancer{" "}
				<Code>
					%{"{"}HTTPS{"}"}
				</Code>{" "}
				is always <Code>off</Code>, because TLS ends earlier, and the rule loops. There the
				condition is written against the proxy's header:{" "}
				<Code>
					RewriteCond %{"{"}HTTP:X-Forwarded-Proto{"}"} !https
				</Code>
				.
			</Text>

			<Text fw={600}>How to test a chain yourself</Text>
			<Code block>
				{`# every hop: status line and Location
curl -sIL http://www.example.com/old-post/ | grep -iE "^HTTP/|^location"

# HTTP/1.1 301 Moved Permanently
# Location: https://example.com/old-post/
# HTTP/2 301
# location: https://example.com/new-post/
# HTTP/2 200          <- two hops: point the first rule straight at /new-post/

# a summary line: final status, number of redirects, final URL
curl -sL -o /dev/null -w "%{http_code} %{num_redirects} %{url_effective}\\n" http://www.example.com/old-post/`}
			</Code>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Test all four entrances: <Code>http://</Code> and <Code>https://</Code>, with{" "}
					<Code>www</Code> and without. Each should reach the canonical address in one
					hop, with a 301 or a 308.
				</List.Item>
				<List.Item>
					<Code>-I</Code> sends a HEAD, and some servers answer HEAD differently from GET.
					When in doubt, repeat it without <Code>-I</Code>:{" "}
					<Code>curl -sL -D - -o /dev/null URL</Code>. In Windows PowerShell 5.1{" "}
					<Code>curl</Code> is an alias for Invoke-WebRequest; call <Code>curl.exe</Code>.
				</List.Item>
				<List.Item>
					In DevTools → Network, turn on Preserve log and open the old URL: each hop is a
					row of its own with its own status.
				</List.Item>
				<List.Item>
					In Search Console: the Page indexing report — the reasons “Page with redirect”,
					“Redirect error”, “Not found (404)”, “Soft 404”, “Server error (5xx)”; and in
					Crawl stats — requests broken down by response, plus host status.
				</List.Item>
			</List>

			<Text fw={600}>A redirect map for a URL change</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Collect every old address: the sitemap, the crawl log, the pages with clicks in
					the Performance report, the pages with external links, the server logs.
				</List.Item>
				<List.Item>
					Match each to the closest new page in meaning, one to one. Redirecting
					everything to the home page or to an unrelated page can be read as a soft 404.
					Where there is no replacement, answer 404 or 410.
				</List.Item>
				<List.Item>
					Implement the map as one rule straight to the final addresses, and move the
					internal links, canonicals, hreflang and sitemap to the new URLs — otherwise
					every internal link travels through a redirect.
				</List.Item>
				<List.Item>
					Keep the redirects as long as you can, at least a year; for readers with old
					bookmarks, indefinitely is better.
				</List.Item>
				<List.Item>
					Test a sample of the map with curl and watch both old and new URLs in Page
					indexing. The full plan is in “Site moves”.
				</List.Item>
			</List>
			<Code block>
				{`# nginx: a redirect map kept in one place (http {} context)
map $uri $new_uri {
    default             "";
    /blog/old-post/     /blog/new-post/;
    /services/seo.html  /services/seo/;
}

server {
    # ...
    if ($new_uri) {
        return 301 https://example.com$new_uri$is_args$args;
    }
}`}
			</Code>

			<Text fw={600}>Common scenarios</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom</Table.Th>
						<Table.Th>Cause</Table.Th>
						<Table.Th>What to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{REDIRECT_SYMPTOMS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td>{row.symptom}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<CheckedHere checks="“Host redirects chain or are temporary” (HOST_REDIRECT_CHAIN) — three hops or more, or a temporary redirect on the way; two permanent hops (http → https → the canonical host) are not flagged. “The site is also served from another host or scheme” (HOST_VARIANT_SERVES_CONTENT), “A sitemap URL leads to a redirect” (REDIRECTED), “Links on the site go through a redirect” (LINKS_TO_REDIRECTS), “Broken links in the text” (BROKEN_LINKS), “Missing pages answer 200 (soft 404)” (SOFT_404), “A meta refresh redirect” (META_REFRESH), “The page answers with an error code” (LH_HTTP_STATUS_CODE)." />
		</GuideSection>
	);
}

const SITEMAP_RULES = [
	{
		rule: "Formats",
		value: "XML to the sitemaps.org protocol; a text file (one URL per line, nothing else); RSS 2.0 and Atom 1.0 — which cover only the recent URLs.",
	},
	{
		rule: "Limit per file",
		value: "50,000 URLs or 50 MB uncompressed. The file may be gzipped (.xml.gz), but the limit counts the uncompressed size. More than that: split it and list the parts in a sitemap index.",
	},
	{
		rule: "Sitemap index",
		value: "Up to 50,000 entries; it lists sitemap files only — nested indexes are not supported. Submitting the one index in Search Console is enough.",
	},
	{
		rule: "Encoding and URLs",
		value: "UTF-8 only, with special characters escaped (& → &amp;). Full absolute URLs only: Google crawls them exactly as written.",
	},
	{
		rule: "Which URLs",
		value: "Canonical, indexable, 200-answering ones only: no redirects, no noindex, no errors, no parameter duplicates, no addresses blocked in robots.txt.",
	},
	{
		rule: "lastmod",
		value: "W3C Datetime format: 2026-10-12 or 2026-10-12T09:30:00+00:00. Google uses it only where it is consistently and verifiably accurate. It is the date of the last significant change: the main text, the structured data, the links — yes; the year in the copyright line — no.",
	},
	{
		rule: "priority, changefreq",
		value: "Google ignores both.",
	},
	{
		rule: "Location",
		value: "A sitemap not submitted through Search Console only covers URLs in its own folder and below: /blog/sitemap.xml cannot list /shop/. A file at the root covers the whole site.",
	},
	{
		rule: "How to tell Google",
		value: "A Sitemap: line in robots.txt (an absolute URL; several lines are allowed), the Sitemaps report in Search Console, or the Search Console API. Google switched the ping endpoint off, as announced in June 2023.",
	},
] as const;

/** Every element of a plain XML sitemap, in the order it appears. */
const SITEMAP_TAGS = [
	{
		tag: '<?xml version="1.0" encoding="UTF-8"?>',
		need: "First line",
		does: "Declares XML in UTF-8. Nothing may come before it — not a space, not a blank line, not PHP output.",
	},
	{
		tag: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		need: "Required",
		does: "The file's root and the protocol's namespace. Extensions (image, video, news, xhtml) declare their own xmlns here too.",
	},
	{
		tag: "<url>",
		need: "Required",
		does: "One entry, one URL; everything about that address is nested inside it.",
	},
	{
		tag: "<loc>",
		need: "Required",
		does: "The full absolute URL, exactly as the canonical is written: scheme, host, trailing slash. Special characters escaped.",
	},
	{
		tag: "<lastmod>",
		need: "Recommended",
		does: "The date the page last changed significantly. Google uses it only where it is consistently truthful — and then recrawls updated pages sooner.",
	},
	{
		tag: "<changefreq>, <priority>",
		need: "Not needed",
		does: "How often the page changes and how important it is relative to the others. Google ignores them; writing them only inflates the file.",
	},
] as const;

/** What else a sitemap can carry, and what each addition is for. */
const SITEMAP_EXTRAS = [
	{
		what: "Images",
		why: "Images Google will not find in the HTML: inserted by JavaScript, in galleries and sliders, used as backgrounds. It helps Google Images.",
	},
	{
		what: "Video",
		why: "Video that is hard to discover: in a player a script loads. It gives Google the thumbnail, title, description and duration — what it shows in video results.",
	},
	{
		what: "News",
		why: "For Google News publishers only: fast discovery of fresh articles. Articles from the last two days go in; older ones drop out.",
	},
	{
		what: "Language versions (hreflang)",
		why: "The whole set of translations in one file, rather than in the head of every page. Handy with many languages, or templates that are hard to edit.",
	},
	{
		what: "Mobile versions on separate URLs",
		why: "For the old m.example.com arrangement only: Google advises listing one version, and if both, marking which is the mobile one with an xhtml:link carrying a media attribute.",
	},
	{
		what: "URLs of another site",
		why: "One sitemap for several sites: allowed if every site is verified in Search Console, or each site's robots.txt points at this sitemap.",
	},
] as const;

const SITEMAP_EXTENSIONS = [
	{
		ext: "Images",
		ns: "http://www.google.com/schemas/sitemap-image/1.1",
		rules: "Inside a <url>, up to 1000 <image:image>, each with the only tag that is needed, <image:loc>. The caption, title, license and geo_location tags are deprecated. Useful for images JavaScript loads and that are in no src.",
	},
	{
		ext: "Video",
		ns: "http://www.google.com/schemas/sitemap-video/1.1",
		rules: "thumbnail_loc, title, description (up to 2048 characters) and either content_loc or player_loc are required; Google prefers content_loc where it exists. It can go into an ordinary sitemap.",
	},
	{
		ext: "News",
		ns: "http://www.google.com/schemas/sitemap-news/0.9",
		rules: "Articles created in the last two days only; up to 1000 <news:news> per file. publication (name, language), publication_date and title are required.",
	},
	{
		ext: "hreflang",
		ns: "http://www.w3.org/1999/xhtml",
		rules: "Every <url> carries an <xhtml:link> for each language version, the page itself included; these links do not count towards the 50,000-URL limit.",
	},
] as const;

const SITEMAP_PROBLEMS = [
	{
		symptom: "The report says “Couldn't fetch”.",
		cause: "The wrong address, a sitemap blocked in robots.txt, or a server or WAF answering Googlebot with 403 or 5xx.",
		fix: "Open the address with curl, check robots.txt, and look in the logs for Googlebot's requests to the sitemap.",
	},
	{
		symptom: "Status “Has issues”, the sitemap is “not in a supported format”.",
		cause: "HTML is served at that address: an SPA or CMS answering 200 with its home page for any path, or a PHP warning printed before the <?xml.",
		fix: "curl -s URL | head — the first line must be <?xml …>, and the Content-Type application/xml or text/xml.",
	},
	{
		symptom: "“Discovered pages” is far larger than the number of posts on the site.",
		cause: "Tags, author archives, attachments, pagination pages and utility URLs have found their way in.",
		fix: "Turn those types off in the generator; keep only the pages you want in results.",
	},
	{
		symptom: "Every entry carries the same lastmod — today's date.",
		cause: "The generator writes the time the sitemap was built instead of the date the page changed.",
		fix: "Take the date from the entry's “modified” field, and only on a significant edit.",
	},
	{
		symptom: "URLs in the sitemap use http:// or the other www variant.",
		cause: "The host comes from configuration that was never updated after a move.",
		fix: "Fix the site's base URL in the CMS or the generator.",
	},
] as const;

/** Sitemaps in depth: format and limits, lastmod, extensions, and reading the Sitemaps report. */
export function SitemapsSection() {
	return (
		<GuideSection
			section={S.sitemaps}
			sources={[
				SOURCES.sitemapsOverview,
				SRC.sitemaps,
				SOURCES.largeSitemaps,
				SOURCES.imageSitemaps,
				SOURCES.videoSitemaps,
				SOURCES.newsSitemaps,
				SRC.hreflang,
				SOURCES.sitemapsReport,
				SRC.canonical,
			]}
		>
			<Text>
				A sitemap is a file listing the URLs you want in search, with metadata about them:
				when the page changed, which images and videos it carries, where its translations
				are. Why have one when Google follows links anyway: it finds pages that links reach
				late or not at all (new posts, a deep archive, orphans), hints at what has changed
				since last time, and declares media and language versions that are invisible in the
				HTML. To Google it is a hint: submitting it guarantees neither that the file is
				fetched nor that every URL is crawled and indexed. It helps most on large sites, new
				sites with few external links, and sites with a lot of video, images or news. A site
				of up to about 500 well-linked pages may not need one, by Google's own account — but
				there is no harm in having it.
			</Text>
			<Text>
				A sitemap is worth more than discovery. Including an address in one is a
				canonicalisation signal (weaker than a redirect or a canonical), and the sitemap
				itself is the reference list of “what should be in the index” that the Search
				Console reports are read against. A sitemap that contradicts its own pages
				(redirects, noindex, canonicals pointing elsewhere) loses that meaning.
			</Text>

			<Text fw={600}>The file's structure: what each tag means</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={260}>Tag</Table.Th>
						<Table.Th w={120}>Needed?</Table.Th>
						<Table.Th>What it means</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SITEMAP_TAGS.map((row) => (
						<Table.Tr key={row.tag}>
							<Table.Td>
								<Code>{row.tag}</Code>
							</Table.Td>
							<Table.Td>{row.need}</Table.Td>
							<Table.Td>{row.does}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				What a sitemap does not and cannot hold: indexing rules (noindex belongs on the
				page), canonical tags (being listed at all is a weak vote for the URL being the
				canonical), and titles or descriptions of ordinary pages. A sitemap answers one
				question — which addresses exist and when they changed — plus the media and language
				extensions.
			</Text>

			<Text fw={600}>How to organise a site's sitemaps</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>An index at the root, files by type:</b> <Code>/sitemap_index.xml</Code> →{" "}
					<Code>sitemap-posts.xml</Code>, <Code>sitemap-pages.xml</Code>,{" "}
					<Code>sitemap-categories.xml</Code>. Search Console then shows which kind of
					page indexes badly, and each file has a lastmod of its own.
				</List.Item>
				<List.Item>
					<b>Split large sections</b> into 10,000–50,000 URLs (by date, alphabetically, by
					id): the file with the newest entries changes, while the old ones stay stable
					and are not re-read for nothing.
				</List.Item>
				<List.Item>
					<b>Generate from the database, on publish:</b> a new entry, a deletion or a
					changed address shows up in the file at once. Serve it with caching and
					compression — it is read often.
				</List.Item>
				<List.Item>
					<b>An XML sitemap plus RSS/Atom.</b> Google accepts RSS 2.0 and Atom 1.0 feeds
					as sitemaps. A feed covers only recent entries, but the CMS already generates
					it: the full XML sitemap says what the site has, the feed says what has just
					appeared.
				</List.Item>
			</List>

			<Text fw={600}>Rules and limits</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{SITEMAP_RULES.map((row) => (
						<Table.Tr key={row.rule}>
							<Table.Td w={170} fw={600}>
								{row.rule}
							</Table.Td>
							<Table.Td>{row.value}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Example: a sitemap and a sitemap index</Text>
			<Code block>
				{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/blog/core-web-vitals/</loc>
    <lastmod>2026-09-28</lastmod>
  </url>
  <url>
    <loc>https://example.com/blog/search?tag=seo&amp;page=2</loc>   <!-- & escaped -->
    <lastmod>2026-10-02T14:05:00+00:00</lastmod>
  </url>
</urlset>

<!-- sitemap_index.xml: one file per content type -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2026-10-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml.gz</loc>
  </sitemap>
</sitemapindex>`}
			</Code>
			<Code block>
				{`# robots.txt
Sitemap: https://example.com/sitemap_index.xml`}
			</Code>

			<Text fw={600}>What else can go into a sitemap, and why</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{SITEMAP_EXTRAS.map((row) => (
						<Table.Tr key={row.what}>
							<Table.Td w={200} fw={600}>
								{row.what}
							</Table.Td>
							<Table.Td>{row.why}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Extensions</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={110}>Extension</Table.Th>
						<Table.Th>Namespace</Table.Th>
						<Table.Th>Rules</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SITEMAP_EXTENSIONS.map((row) => (
						<Table.Tr key={row.ext}>
							<Table.Td fw={600}>{row.ext}</Table.Td>
							<Table.Td>
								<Code>{row.ns}</Code>
							</Table.Td>
							<Table.Td>{row.rules}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				hreflang in a sitemap is convenient when there are many versions, or the page
				template is hard to change: the markup lives in one file. Every version gets its own{" "}
				<Code>&lt;url&gt;</Code>, and each repeats the same full set of links. How hreflang
				works in general is in “Hreflang and international sites”.
			</Text>
			<Code block>
				{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/en/pricing/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/preise/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/"/>
    <image:image>
      <image:loc>https://example.com/img/pricing-table.png</image:loc>
    </image:image>
  </url>
  <url>
    <loc>https://example.com/de/preise/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/preise/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/"/>
  </url>
</urlset>`}
			</Code>
			<Text size="sm">
				Video and news go in the same file or in files of their own. Besides its required
				tags, video has optional ones: <Code>duration</Code> (seconds),{" "}
				<Code>publication_date</Code>, <Code>expiration_date</Code> (after which the video
				is not shown), <Code>family_friendly</Code>, <Code>restriction</Code> (countries),{" "}
				<Code>platform</Code>, <Code>requires_subscription</Code>, <Code>uploader</Code>,{" "}
				<Code>live</Code>, and up to 32 <Code>tag</Code>. Google has removed{" "}
				<Code>category</Code>, <Code>gallery_loc</Code>, <Code>price</Code> and{" "}
				<Code>tvshow</Code>.
			</Text>
			<Code block>
				{`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- a post with an embedded video -->
  <url>
    <loc>https://example.com/blog/local-seo/</loc>
    <video:video>
      <video:thumbnail_loc>https://example.com/img/local-seo-video.jpg</video:thumbnail_loc>
      <video:title>Local SEO in 10 minutes</video:title>
      <video:description>A walkthrough of the twelve-step checklist.</video:description>
      <video:content_loc>https://example.com/video/local-seo.mp4</video:content_loc>
      <video:duration>600</video:duration>
      <video:publication_date>2026-09-28T14:30:00-04:00</video:publication_date>
    </video:video>
  </url>

  <!-- a news article, at most two days old -->
  <url>
    <loc>https://example.com/news/core-update-october/</loc>
    <news:news>
      <news:publication>
        <news:name>Example News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-10-15T09:00:00-04:00</news:publication_date>
      <news:title>October core update: what changed</news:title>
    </news:news>
  </url>

  <!-- separate mobile site: the desktop URL, annotated with its mobile twin -->
  <url>
    <loc>https://example.com/pricing/</loc>
    <xhtml:link rel="alternate" media="only screen and (max-width: 640px)"
                href="https://m.example.com/pricing/"/>
  </url>
</urlset>`}
			</Code>
			<Code block>
				{`# robots.txt of example.com: its sitemap may live on another host you control
Sitemap: https://sitemaps.example-cdn.com/example.com/sitemap_index.xml`}
			</Code>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<Code>curl -sI https://example.com/sitemap_index.xml</Code> — a 200 and a
					Content-Type of <Code>application/xml</Code> or <Code>text/xml</Code>, with no
					redirect. <Code>curl -s URL | head -3</Code> — it should start with{" "}
					<Code>&lt;?xml</Code>, not HTML. The number of entries:{" "}
					<Code>curl -s URL | grep -c "&lt;loc&gt;"</Code> (for a .gz, through{" "}
					<Code>gunzip</Code>).
				</List.Item>
				<List.Item>
					Search Console → Sitemaps. The status is Success, Has issues (the file was read
					but has errors; the URLs it could parse were still taken) or Couldn't fetch.
					“Last read” says when Google last read the file. “Discovered pages” is how many
					URLs were parsed, not how many were indexed.
				</List.Item>
				<List.Item>
					The “See page indexing” icon on the sitemap's row, or the sitemap filter in Page
					indexing, shows how many submitted URLs are in the index and why the rest are
					not.
				</List.Item>
				<List.Item>
					Read the submitted-against-indexed gap by reason. “Page with redirect”,
					“Excluded by noindex” and “Duplicate, Google chose different canonical than
					user” are faults in the sitemap or the pages. “Crawled – currently not indexed”
					in quantity is a content-quality question. “Discovered – currently not indexed”
					means Google has not got there: look at internal linking and server speed.
				</List.Item>
				<List.Item>
					Split the sitemap by type (posts, categories, products): the gap then shows per
					section, and the template at fault is immediately visible.
				</List.Item>
			</List>
			<Text size="sm" c="dimmed">
				Removing a sitemap from the report does not remove its URLs from Google: it
				remembers both the file and the addresses. To make Google stop reading the file,
				delete it or block it in robots.txt; to take the pages out of search, answer 404/410
				or use noindex.
			</Text>

			<Text fw={600}>Common mistakes</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom</Table.Th>
						<Table.Th>Cause</Table.Th>
						<Table.Th>What to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SITEMAP_PROBLEMS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td>{row.symptom}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How this relates to the tracker</Text>
			<Text size="sm">
				The tracker finds the sitemap the way a crawler would: it reads the{" "}
				<Code>Sitemap:</Code> lines in robots.txt, and if there are none, or the files they
				name will not open, it tries the usual addresses (<Code>/sitemap.xml</Code>,{" "}
				<Code>/sitemap_index.xml</Code>, <Code>/wp-sitemap.xml</Code> and others). It walks
				a sitemap index, unpacks .gz and reads lastmod. From the crawl it raises: “The
				sitemap lists URLs that are not meant to be indexed” (SITEMAP_LISTS_NON_INDEXABLE) —
				over the entries the crawl requested, so it is a sample and not the whole file; “The
				sitemap lists URLs on another scheme or host variant”
				(SITEMAP_LISTS_OTHER_HOST_VARIANTS); “The sitemap's lastmod dates look generated,
				not real” (SITEMAP_LASTMOD_UNRELIABLE); “A sitemap URL leads to a redirect”
				(REDIRECTED).
			</Text>
			<DoAvoid
				good={[
					"Generate the sitemap from the CMS, so it updates on every publish and deletion.",
					"Set lastmod from the real date of a significant change.",
					"Split sitemaps by content type and submit the index in Search Console.",
					"Name the sitemap in robots.txt with an absolute URL.",
				]}
				bad={[
					"URLs with redirects, noindex, 404s or someone else's canonical in the sitemap.",
					"lastmod set to the file's generation time on every entry.",
					"Relying on priority and changefreq — Google does not read them.",
					"A sitemap on one host whose pages are on another host variant.",
				]}
			/>
		</GuideSection>
	);
}

const HEADERS = [
	{
		name: "Link: rel=canonical",
		why: "A canonical for files with no <head>: PDFs, documents. It works for HTML too, but if the header and the tag in <head> disagree, the hint contradicts itself and Google picks the address on its own.",
		example: '<https://example.com/guide.pdf>; rel="canonical"',
	},
	{
		name: "Link: rel=alternate hreflang",
		why: "hreflang for non-HTML versions. The header lists every version, the requested one included, and is identical on all of them.",
		example:
			'<https://example.com/file.pdf>; rel="alternate"; hreflang="en", <https://de.example.com/file.pdf>; rel="alternate"; hreflang="de"',
	},
	{
		name: "X-Robots-Tag",
		why: "Any meta robots rule — for any file type, and for many URLs at once. It can be addressed to one named bot.",
		example: "noindex  |  googlebot: nofollow",
	},
	{
		name: "Location",
		why: "The target of a 3xx. Write an absolute https URL on the canonical host: a Location on http://, or on an internal host behind a proxy, is an extra hop or a broken address.",
		example: "https://example.com/new-post/",
	},
	{
		name: "Retry-After",
		why: "With a 503 (and a 429): when to come back, in seconds or as a date. Google advises it for planned work.",
		example: "3600",
	},
	{
		name: "Content-Type; charset",
		why: "The response's type and encoding. The encoding in the header wins over <meta charset>. A wrong type or encoding can break parsing in browsers and crawlers — non-Latin text turns to mojibake.",
		example: "text/html; charset=utf-8",
	},
	{
		name: "Content-Encoding",
		why: "Compression. Google's crawlers support gzip, deflate and br; compressed HTML is several times lighter — faster for readers and cheaper to crawl.",
		example: "br",
	},
	{
		name: "ETag / Last-Modified",
		why: "Conditional requests: Googlebot sends If-None-Match / If-Modified-Since and the server answers 304 with no body. With both present Google takes the ETag, and recommends it.",
		example: 'ETag: "a3f9-5e1c"  |  Last-Modified: Fri, 09 Oct 2026 10:00:00 GMT',
	},
	{
		name: "Cache-Control",
		why: "max-age helps crawlers decide when to fetch a URL again; Google's crawlers support no other caching directive. no-store on a public page breaks the browsers' back/forward cache.",
		example: "max-age=3600",
	},
	{
		name: "Vary",
		why: "Tells caches and CDNs which request headers the answer depends on. Vary: User-Agent is needed when one URL serves different HTML to phones and desktops: otherwise a CDN may hand Googlebot Smartphone the desktop version. Vary: Accept-Encoding goes with compression.",
		example: "Accept-Encoding  |  User-Agent",
	},
	{
		name: "Strict-Transport-Security",
		why: "HSTS: the browser remembers that the site is HTTPS only and rewrites http:// itself — so repeat visits have no http → https hop and no window for interception. It does not replace the server's 301 from http: new visitors and crawlers have not received it yet.",
		example: "max-age=31536000; includeSubDomains",
	},
	{
		name: "CSP: upgrade-insecure-requests",
		why: "The browser loads every http:// resource of the page over https:// — a quick way to clear mixed content out of old posts. The canonical, the links and the sitemap still have to move to https in the HTML itself.",
		example: "Content-Security-Policy: upgrade-insecure-requests",
	},
] as const;

/** HTTP response headers that carry SEO signals: what each does, how to set it, how to see it. */
export function HttpHeadersSection() {
	return (
		<GuideSection
			section={S.httpHeaders}
			sources={[
				SRC.robotsMeta,
				SRC.canonical,
				SRC.hreflang,
				SRC.googleCrawlers,
				SRC.mdnCompression,
				SRC.htmlCharset,
				SOURCES.pauseBusiness,
				SOURCES.mdnVary,
				SOURCES.mdnHsts,
				SOURCES.hstsPreload,
				SOURCES.mdnUpgradeInsecure,
			]}
		>
			<Text>
				Response headers arrive before the HTML and work for any file type. Google reads
				some of them as signals about the page (<Code>X-Robots-Tag</Code>, <Code>Link</Code>{" "}
				with canonical and hreflang); some affect how efficiently the site is crawled
				(caching, compression, <Code>Retry-After</Code>); and some affect security and
				whether the page displays correctly (encoding, HSTS, CSP).
			</Text>
			<Text>
				What makes headers dangerous is that they are invisible: they are nowhere in the
				page source, they are added by the server, the CDN, the framework or a plugin, and
				they are easily lost or duplicated when hosting changes. A classic audit find is an{" "}
				<Code>X-Robots-Tag: noindex</Code> left over from staging at the server level, or a
				canonical in the header arguing with the tag in <Code>&lt;head&gt;</Code>.
			</Text>

			<Text fw={600}>The headers at a glance</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={170}>Header</Table.Th>
						<Table.Th>Why it matters for SEO</Table.Th>
						<Table.Th w={260}>Example value</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{HEADERS.map((row) => (
						<Table.Tr key={row.name}>
							<Table.Td fw={600}>{row.name}</Table.Td>
							<Table.Td>{row.why}</Table.Td>
							<Table.Td>
								<Code>{row.example}</Code>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>X-Robots-Tag for a PDF: nginx and Apache</Text>
			<Code block>
				{`# nginx
location ~* \\.pdf$ {
    add_header X-Robots-Tag "noindex" always;
}

# Apache (.htaccess or a <VirtualHost>)
<FilesMatch "\\.pdf$">
    Header always set X-Robots-Tag "noindex"
</FilesMatch>`}
			</Code>
			<List size="sm" spacing={4}>
				<List.Item>
					Without <Code>always</Code>, nginx adds the header only to successful answers
					and redirects (200, 201, 204, 206, 301, 302, 303, 304, 307, 308), and Apache
					with <Code>Header set</Code> only to successful ones (2xx); with{" "}
					<Code>always</Code> it goes on every answer, errors included.
				</List.Item>
				<List.Item>
					An nginx trap: if a nested <Code>location</Code> has an <Code>add_header</Code>{" "}
					of its own, every <Code>add_header</Code> from the <Code>server</Code> level
					stops applying inside it. That is how HSTS or CSP “disappear” on single sections
					of a site — repeat the headers you need in such a location.
				</List.Item>
				<List.Item>
					The rules themselves (<Code>noindex</Code>, <Code>nosnippet</Code>,{" "}
					<Code>unavailable_after</Code> and the rest) and how they combine are in “Meta
					robots”. Like the meta tag, the header only works if the URL is not blocked in
					robots.txt.
				</List.Item>
			</List>

			<Text fw={600}>HSTS and preload: carefully</Text>
			<Code block>
				{`# nginx, in the HTTPS server block only
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`}
			</Code>
			<Text size="sm">
				Start with a short <Code>max-age</Code> (minutes), make sure everything works, and
				raise it to a year. <Code>includeSubDomains</Code> extends the rule to every
				subdomain — if one of them (an old staging host, a webmail interface) lives on HTTP
				only, browsers will stop opening it. The <Code>preload</Code> directive and a
				submission to hstspreload.org bake the domain into the browsers' own lists (the
				requirements: a <Code>max-age</Code> of at least 31536000, includeSubDomains,
				preload). Getting off the list takes months, so preload is only for a domain where
				HTTPS is guaranteed everywhere, for good. In Chrome DevTools an HSTS hop shows as a{" "}
				<Code>307 Internal Redirect</Code>: the browser makes it, the server never sent it.
			</Text>

			<Text fw={600}>How to look at headers</Text>
			<Code block>
				{`# response headers (HEAD request)
curl -sI https://example.com/blog/post/

# the same for a real GET, asking for compression like Googlebot does
curl -s -D - -o /dev/null -H "Accept-Encoding: gzip, deflate, br" https://example.com/blog/post/

# conditional request: expect 304 if the page has not changed
curl -sI -H 'If-None-Match: "a3f9-5e1c"' https://example.com/blog/post/`}
			</Code>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					curl does not ask for compression by default, so without{" "}
					<Code>Accept-Encoding</Code> (or <Code>--compressed</Code>) you will not see a{" "}
					<Code>Content-Encoding</Code> even from a server that compresses. Some servers
					answer HEAD and GET differently — check both.
				</List.Item>
				<List.Item>
					DevTools → Network → turn on Disable cache, reload, pick the first request (the
					document) → Headers → Response Headers.
				</List.Item>
				<List.Item>
					Search Console → URL Inspection → View crawled page → More info: the HTTP status
					and headers exactly as Googlebot received them. For the current state, Test live
					URL.
				</List.Item>
				<List.Item>
					If the site is behind a CDN, compare the CDN's headers with the origin's: a CDN
					may add, strip or cache them in its own way.
				</List.Item>
			</List>

			<Text fw={600}>How this relates to the tracker</Text>
			<Text size="sm">
				The tracker reads the headers of every post it crawls. A canonical in the{" "}
				<Code>Link</Code> header counts the same as the tag: “No canonical”
				(CANONICAL_MISSING) accepts it, “Conflicting canonicals” (CANONICAL_CONFLICT) flags
				a header and tag that disagree, and “The canonical points to HTTP”
				(CANONICAL_TO_HTTP) checks it too. <Code>X-Robots-Tag</Code> is read by “The page is
				set to noindex” (NOINDEX), “The snippet in results is restricted”
				(SNIPPET_RESTRICTED) and “Large image previews are not allowed”
				(IMAGE_PREVIEW_NOT_LARGE). The encoding from <Code>Content-Type</Code> is used by
				“The character encoding is declared late or not at all” (CHARSET_MISSING_OR_LATE),
				compression by “The HTML is not compressed” (HTML_NOT_COMPRESSED), and{" "}
				<Code>Cache-Control: no-store</Code> by “Cache-Control: no-store keeps the page out
				of the back/forward cache” (BFCACHE_BLOCKED_BY_NO_STORE). “Insecure resources on a
				secure page” (MIXED_CONTENT) does not fire when the page sends a CSP with{" "}
				<Code>upgrade-insecure-requests</Code>, as a header or a meta tag. hreflang the
				tracker only checks in <Code>&lt;head&gt;</Code>; it does not read a{" "}
				<Code>Link</Code> header carrying hreflang.
			</Text>
			<DoAvoid
				good={[
					"Check the headers after every change of hosting, CDN or caching plugin.",
					"X-Robots-Tag and Link: rel=canonical for PDFs and other files with no <head>.",
					"An ETag or Last-Modified, and a 304 for pages that have not changed.",
					"gzip or br compression for HTML, CSS, JS and XML.",
				]}
				bad={[
					"A server-wide X-Robots-Tag: noindex left over from staging.",
					"A canonical in the Link header that disagrees with the tag in <head>.",
					"HSTS with preload while any subdomain is still HTTP only.",
					"No Vary: User-Agent although phones are served different HTML.",
				]}
			/>
		</GuideSection>
	);
}
