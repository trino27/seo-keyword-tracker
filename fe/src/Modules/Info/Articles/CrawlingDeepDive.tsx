import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import type { ReactNode } from "react";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** First-party pages this file's chapters rest on that the shared source list does not carry. */
const SOURCES = {
	httpCaching: {
		title: "Google Search Central Blog: Crawling December: HTTP caching",
		url: "https://developers.google.com/search/blog/2024/12/crawling-december-caching",
	},
	reduceCrawlRate: {
		title: "Google Search Central: Reduce the Googlebot crawl rate",
		url: "https://developers.google.com/search/docs/crawling-indexing/reduce-crawl-rate",
	},
	sitemapPing: {
		title: "Google Search Central Blog: Sitemaps ping endpoint is going away",
		url: "https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping",
	},
	indexingApi: {
		title: "Google Search Central: Indexing API Quickstart",
		url: "https://developers.google.com/search/apis/indexing-api/v3/quickstart",
	},
	indexNow: {
		title: "IndexNow.org",
		url: "https://www.indexnow.org/",
	},
	urlInspection: {
		title: "Search Console Help: URL Inspection tool",
		url: "https://support.google.com/webmasters/answer/9012289",
	},
	statusDashboard: {
		title: "Google Search Status Dashboard",
		url: "https://status.search.google.com/",
	},
	mobileFirstLanded: {
		title: "Google Search Central Blog: Mobile-first indexing has landed - thanks for all your support",
		url: "https://developers.google.com/search/blog/2023/10/mobile-first-is-here",
	},
	pageExperience2023: {
		title: "Google Search Central Blog: The role of page experience in creating helpful content",
		url: "https://developers.google.com/search/blog/2023/04/page-experience-in-search",
	},
	lighthouse: {
		title: "Chrome for Developers: Introduction to Lighthouse",
		url: "https://developer.chrome.com/docs/lighthouse/overview",
	},
	verifyGooglebot: {
		title: "Google Search Central: Verifying Googlebot and other Google crawlers",
		url: "https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot",
	},
	crawlStats: {
		title: "Search Console Help: Crawl Stats report",
		url: "https://support.google.com/webmasters/answer/9679690",
	},
	robotsReport: {
		title: "Search Console Help: robots.txt report",
		url: "https://support.google.com/webmasters/answer/6062598",
	},
} satisfies Record<string, ISeoIssueSource>;

/** Which of the tracker's checks look at a subject, so each chapter ends on what to open next. */
function CheckedHere({ children }: { children: ReactNode }) {
	return (
		<Text size="sm" c="dimmed">
			<b>How this relates to the tracker.</b> {children}
		</Text>
	);
}

const URL_SOURCES = [
	{
		source: "Links in <a href>",
		how: "The main source. Googlebot takes URLs from the href attribute, in both the source and the rendered HTML. Links that exist only as an onclick handler, or as a button with no href, are never discovered.",
	},
	{
		source: "Sitemaps",
		how: "Submitted in the Sitemaps report, or named by a Sitemap: line in robots.txt. Google reads lastmod when the dates are honest, and ignores changefreq and priority entirely.",
	},
	{
		source: "Redirects",
		how: "The target of a Location header is queued as a URL of its own. This is how Google learns the new addresses after a move.",
	},
	{
		source: "URL Inspection → Request indexing",
		how: "Puts one URL in a priority queue. There is a daily quota, and the request guarantees nothing. For changes in bulk, use a sitemap.",
	},
	{
		source: "Indexing API",
		how: "Officially only for pages with JobPosting or BroadcastEvent markup. Google does not support it for articles or products.",
	},
	{
		source: "Sitemap ping (google.com/ping)",
		how: "Gone: Google announced the shutdown in June 2023 and switched the endpoint off six months later. Plugins that “ping Google” do nothing.",
	},
	{
		source: "IndexNow",
		how: "Google takes no part in the protocol. Bing, Yandex, Seznam, Naver and some others do — useful for them, useless for Google.",
	},
] as const;

const GOOGLE_CRAWLERS = [
	{
		name: "Googlebot Smartphone",
		token: "Googlebot",
		role: "The main crawl for the Search index: Google indexes most sites from their mobile version.",
	},
	{
		name: "Googlebot Desktop",
		token: "Googlebot",
		role: "A smaller share of the requests. In robots.txt it cannot be told apart from the smartphone crawler: the two share one token.",
	},
	{
		name: "Googlebot-Image / Googlebot-Video",
		token: "Googlebot-Image, Googlebot-Video",
		role: "Images (logos and favicons among them) and video, for Search, Images and Discover.",
	},
	{
		name: "Google-InspectionTool",
		token: "Google-InspectionTool",
		role: "The testing tools: URL Inspection in Search Console, the Rich Results Test. No effect on Search.",
	},
	{
		name: "GoogleOther",
		token: "GoogleOther (and -Image, -Video)",
		role: "The general-purpose crawler the product teams use, for internal research among other things. No effect on Search.",
	},
	{
		name: "Google-Extended",
		token: "Google-Extended",
		role: "Not a crawler but a robots.txt token only: it has no user agent of its own, and the requests come from Google's ordinary crawlers. It controls whether the content may be used to train the Gemini models and for grounding. It does not affect appearing in Search or in AI Overviews — those follow the rules for Googlebot, noindex and nosnippet.",
	},
] as const;

/** How a URL gets into Google's queue, when it is fetched, by whom and over what. */
export function CrawlDiscoverySection() {
	return (
		<GuideSection
			section={S.crawlDiscovery}
			sources={[
				SRC.googleCrawlers,
				SRC.googlebot,
				SOURCES.httpCaching,
				SRC.crawlBudget,
				SOURCES.reduceCrawlRate,
				SOURCES.sitemapPing,
				SOURCES.indexingApi,
				SOURCES.indexNow,
				SRC.aiFeatures,
			]}
		>
			<Text>
				Googlebot has no list of “every page on the web”. It has a queue of known URLs, fed
				from a handful of sources, and a scheduler that decides which URL to fetch and when.
				Discovering a URL and crawling it are two separate events: minutes or months can
				pass between them, and the status “Discovered – currently not indexed” means exactly
				that — the URL is in the queue and its turn has not come.
			</Text>

			<Text fw={600}>Where Google learns a URL from</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{URL_SOURCES.map((row) => (
						<Table.Tr key={row.source}>
							<Table.Td w={220} fw={600}>
								{row.source}
							</Table.Td>
							<Table.Td>{row.how}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How the scheduler decides what to crawl</Text>
			<Text>
				The scheduler balances two quantities. <b>Crawl demand</b> — how important and
				popular a URL is, how often it changes, and how many URLs Google knows on the site:
				popular pages are rechecked more often, and an honest lastmod in the sitemap hints
				that the copy is due for a refresh. <b>Crawl capacity</b> — how many parallel
				connections and requests the host can take. It adjusts itself: fast 200s raise it,
				while 5xx and 429 answers, timeouts and rising response times drop it quickly. When
				these two limits become a problem, and what to do about them, is in “Crawl budget”.
			</Text>

			<Text fw={600}>Who arrives from Google</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={190}>Crawler</Table.Th>
						<Table.Th w={170}>robots.txt token</Table.Th>
						<Table.Th>What for</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{GOOGLE_CRAWLERS.map((row) => (
						<Table.Tr key={row.name}>
							<Table.Td fw={600}>{row.name}</Table.Td>
							<Table.Td>
								<Code>{row.token}</Code>
							</Table.Td>
							<Table.Td>{row.role}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How Googlebot talks to the server</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Protocol.</b> HTTP/1.1 by default; if a site supports HTTP/2 and it pays off,
					Google may crawl over HTTP/2 — it saves connections, but is no ranking
					advantage. To opt out, answer HTTP/2 requests with <Code>421</Code>.
				</List.Item>
				<List.Item>
					<b>Compression.</b> gzip, deflate and Brotli (<Code>br</Code>); the crawler
					lists what it accepts in <Code>Accept-Encoding</Code>.
				</List.Item>
				<List.Item>
					<b>Conditional requests.</b> On a recrawl Googlebot sends{" "}
					<Code>If-None-Match</Code> (the value from <Code>ETag</Code>) or{" "}
					<Code>If-Modified-Since</Code> (the value from <Code>Last-Modified</Code>). If
					the page has not changed, a <Code>304 Not Modified</Code> with no body saves
					bandwidth and server time, and what it saves goes to other URLs. With both
					headers present Google uses the ETag, and recommends it: there is no date format
					to get wrong. The other HTTP caching directives the crawlers ignore.
				</List.Item>
				<List.Item>
					<b>Size.</b> For Search, Googlebot reads the first 2 MB of HTML (uncompressed)
					and the first 64 MB of a PDF; every CSS and JS file is fetched separately under
					the same limit. Anything past it is not indexed.
				</List.Item>
				<List.Item>
					<b>Rate.</b> For most sites Googlebot averages no more than one request every
					few seconds; short bursts happen.
				</List.Item>
			</List>

			<Text fw={600}>How to slow the crawl down for a while</Text>
			<Text size="sm">
				If Googlebot is overloading the server, answer some of its requests with{" "}
				<Code>503</Code> or <Code>429</Code> (optionally with <Code>Retry-After</Code>) —
				Google backs off quickly. Do it for hours, at most a day or two: a URL that answers
				that way for several days running can drop out of the index. Do not use{" "}
				<Code>401</Code>, <Code>403</Code> or <Code>404</Code> for this — they mean “no
				access” or “no page”, not “come back later”. The crawl rate limiter in Search
				Console was retired in January 2024; if answering with errors is impossible, a
				special request form in Search Console is what is left. There is no way to ask
				Google to crawl <i>more</i> often.
			</Text>

			<Text fw={600}>Example: what Googlebot Smartphone gets</Text>
			<Code block>
				{String.raw`UA='Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

# Googlebot sends GET; some servers answer HEAD differently, so dump GET headers instead of -I
curl -s -D - -o /dev/null -A "$UA" https://example.com/blog/local-seo/ \
  | grep -iE "^(HTTP|location|x-robots-tag|link|etag|last-modified|cache-control)"

# HTTP/2 200
# etag: "5f3a-1a2b"
# last-modified: Mon, 28 Sep 2026 14:30:00 GMT
# cache-control: max-age=600

# Do conditional requests work? Expect 304, not 200
curl -s -o /dev/null -w "%{http_code}\n" -A "$UA" \
  -H 'If-None-Match: "5f3a-1a2b"' https://example.com/blog/local-seo/`}
			</Code>
			<Text size="sm">
				Note that curl only fakes the user agent, not the IP. A CDN or WAF that checks
				Googlebot's IP may hand you a 403 while the real Googlebot gets a 200, or the other
				way round. The final word is a live test in URL Inspection — Google runs that one
				itself.
			</Text>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					URL Inspection → the Discovery block: which sitemap Google found the URL in, and
					which page it came from. If a post that is in your sitemap says “No referring
					sitemap”, the sitemap was never submitted or the URL is written differently in
					it.
				</List.Item>
				<List.Item>
					The Sitemaps report: status Success, a recent read date, and a URL count that
					matches what you expect.
				</List.Item>
				<List.Item>
					Crawl stats: the split of Discovery against Refresh, and the average response
					time (more in “Googlebot in the server logs”).
				</List.Item>
				<List.Item>
					The curl above: the status code, <Code>X-Robots-Tag</Code>,{" "}
					<Code>Link: rel=canonical</Code>, whether <Code>ETag</Code> or{" "}
					<Code>Last-Modified</Code> is present, and whether a conditional request gets a
					304.
				</List.Item>
			</List>

			<DoAvoid
				good={[
					"Link every page that matters from other pages of the site, with plain <a href>.",
					"A sitemap of canonical URLs only, with an honest lastmod.",
					"An ETag or Last-Modified, and a 304 for pages that have not changed.",
					"A 503 or 429 for a few hours when the server cannot cope.",
				]}
				bad={[
					"Counting on a sitemap ping or IndexNow to hurry Google along.",
					"Requesting indexing in bulk instead of fixing links and sitemaps.",
					"Blocking Google-Extended in the hope of disappearing from AI Overviews.",
					"Answering 503 for weeks, or throttling with 403 and 404.",
				]}
			/>

			<CheckedHere>
				The tracker starts from the client's sitemap itself, so it checks what gets in the
				way of discovery: “A sitemap URL leads to a redirect” (<Code>REDIRECTED</Code>),
				“The sitemap's lastmod dates look generated, not real” (
				<Code>SITEMAP_LASTMOD_UNRELIABLE</Code>), “Links Google cannot follow” (
				<Code>UNCRAWLABLE_LINKS</Code>), “robots.txt blocks Googlebot” (
				<Code>ROBOTS_BLOCKS_GOOGLEBOT</Code>). Conditional requests and HTTP/2 it does not
				check.
			</CheckedHere>
		</GuideSection>
	);
}

const DEBUG_STEPS = [
	{
		question: "1. Does Google know this URL?",
		where: "URL Inspection → Discovery: Sitemaps and Referring page.",
		fix: "“URL is unknown to Google” — nothing links to the page, or it is not in a submitted sitemap. Add links from related posts, and the URL to the sitemap.",
	},
	{
		question: "2. Can Google fetch it?",
		where: "Crawl allowed? and Page fetch; then Test live URL.",
		fix: "“No: blocked by robots.txt” — fix robots.txt. A fetch Error means a status code, a timeout, DNS, or a WAF that turns Googlebot away.",
	},
	{
		question: "3. Is indexing allowed?",
		where: "Indexing allowed?; the raw HTML and headers with curl; the rendered HTML under View crawled page.",
		fix: "A noindex can sit in a <meta>, in X-Robots-Tag, or appear only after JavaScript. A noindex in the raw HTML cannot be taken off by a script — Google may never get as far as rendering.",
	},
	{
		question: "4. Which canonical did Google choose?",
		where: "User-declared canonical against Google-selected canonical.",
		fix: "If they differ, a different URL is the indexed one — inspect that one. Google's choice exists only in the index data; the live test does not show it.",
	},
	{
		question: "5. What does Google see after rendering?",
		where: "Live test → View tested page: the HTML, the screenshot, More info — resources and JavaScript console messages.",
		fix: "No main text in the rendered HTML or the screenshot means blocked resources or a script that throws. Serve the content in the HTML from the server.",
	},
	{
		question: "6. Is the page worth indexing?",
		where: "The status in Page indexing; the results for the target query; similar pages on the site.",
		fix: "When everything is technically fine and the status is still “Crawled – currently not indexed”, this is a judgement about value. Merge near-identical pages, cover the topic properly, add internal links.",
	},
] as const;

const EXTRA_STATUSES = [
	{
		status: "Indexed, though blocked by robots.txt",
		means: "Google never fetched the page but indexed the URL from links to it. It appears in results without a description.",
		act: "If it belongs in search, unblock it. If it does not, unblock it and add a noindex: while the URL is blocked in robots.txt, Google cannot see the noindex.",
	},
	{
		status: "Redirect error",
		means: "The redirect chain is too long (Googlebot follows up to 10 hops), loops, or ends on an empty or over-long URL.",
		act: "Walk the chain with curl -sIL and collapse it to a single 301 to the final address.",
	},
	{
		status: "Blocked due to unauthorized request (401)",
		means: "The page asks for credentials; Googlebot does not log in.",
		act: "A public page: take the protection off (often a forgotten staging password). Private on purpose: take it out of the sitemap and the internal links.",
	},
	{
		status: "Blocked due to other 4xx issue",
		means: "A 4xx with no status of its own (401, 403 and 404/410 have theirs): a 400, 405 or 451, say.",
		act: "Repeat the request with Googlebot's user agent and find the server, CDN or WAF rule that answers that way.",
	},
] as const;

const TRAFFIC_DROPS = [
	{
		symptom: "A sharp sitewide drop on a single day, impressions near zero",
		where: "Page indexing, URL Inspection on the key pages, the robots.txt report",
		cause: "A sitewide noindex or Disallow after a release, 5xx in bulk, DNS trouble",
		action: "Roll the change back, confirm with a live test, request indexing for the key URLs.",
	},
	{
		symptom: "A gradual decline across many queries from the date of an update",
		where: "Performance with compared periods, plus the Google Search Status Dashboard",
		cause: "A core update or a spam update: Google re-assessed the site",
		action: "No technical fix: make the content more useful; recovery usually shows after later updates.",
	},
	{
		symptom: "One section or page type falls",
		where: "Performance filtered by page (a regular expression works too)",
		cause: "The template changed: canonical, noindex, internal links cut, content moved into JavaScript",
		action: "Compare the old and the new template; inspect a few URLs in URL Inspection.",
	},
	{
		symptom: "Positions and impressions hold, clicks and CTR fall",
		where: "Performance: clicks against impressions by query; the results page itself",
		cause: "The results page changed: AI Overviews, video and question blocks take the clicks; Google rewrote the title",
		action: "Look at the results for the main queries; rebuild the title and the snippet around the intent.",
	},
	{
		symptom: "Impressions fall, average position does not move",
		where: "Performance year on year over the same period",
		cause: "Seasonality or falling demand, not lost positions",
		action: "Compare with last year, not last month; there may be nothing to do.",
	},
	{
		symptom: "Only mobile traffic falls",
		where: "Performance filtered by device",
		cause: "The mobile version loses content or breaks while rendering",
		action: "See “Mobile-first indexing”.",
	},
	{
		symptom: "A Search Console message; pages or the site gone from results",
		where: "Manual actions, Security issues",
		cause: "A manual action for a policy breach, or a hack",
		action: "Fix the breach and file a reconsideration request.",
	},
	{
		symptom: "Analytics shows a drop, Search Console clicks do not",
		where: "Search Console clicks against organic sessions in analytics",
		cause: "A broken tag, a consent banner, attribution",
		action: "Fix the measurement, not the SEO.",
	},
] as const;

/** A decision tree for a page missing from the index, and a method for a traffic drop. */
export function IndexDebuggingSection() {
	return (
		<GuideSection
			section={S.indexDebugging}
			sources={[
				SOURCES.urlInspection,
				SRC.pageIndexing,
				SRC.performanceReport,
				SOURCES.statusDashboard,
				SRC.coreUpdates,
				SRC.manualActions,
				SRC.httpStatusCodes,
				SRC.canonical,
				SRC.javascriptSeo,
			]}
		>
			<Text>
				A page stays out of the index for one of a few reasons, and they have to be ruled
				out in order: Google has to learn the URL, fetch it, be allowed to index it, choose
				that very URL as the canonical, and find it worth keeping. Each step below removes
				one layer; do not move past a step until you have settled it. The tool for all of it
				is URL Inspection: it shows both the index data (what Google knows now) and the live
				test (what it would see on the next crawl). The <Code>site:</Code> operator is no
				use here — it shows a sample, and is not precise.
			</Text>

			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={170}>Question</Table.Th>
						<Table.Th>Where to look</Table.Th>
						<Table.Th>What the answer means</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{DEBUG_STEPS.map((row) => (
						<Table.Tr key={row.question}>
							<Table.Td fw={600}>{row.question}</Table.Td>
							<Table.Td>{row.where}</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>The URL Inspection fields read most often</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Last crawl</b> — when Google last fetched the page, in your time zone. A date
					older than your last edit means Google is looking at the previous version.
				</List.Item>
				<List.Item>
					<b>Crawled as</b> — smartphone or desktop. For most sites it should be Googlebot
					smartphone.
				</List.Item>
				<List.Item>
					<b>User-declared canonical</b> — what you said. “None” is acceptable for an
					ordinary page.
				</List.Item>
				<List.Item>
					<b>Google-selected canonical</b> — what Google chose out of a group of similar
					pages. A disagreement with yours is the prime reason to go looking for
					duplicates.
				</List.Item>
				<List.Item>
					<b>Viewing the page.</b> For the index data you get the HTML and HTTP headers of
					the crawled version; the screenshot exists only in the live test. In the live
					test, look for the main text in the HTML and see which resources failed to load.
				</List.Item>
			</List>

			<Code block>
				{String.raw`# $UA: the Googlebot Smartphone string from the crawl-discovery example
# noindex: raw HTML and headers (what Google reads before rendering)
curl -s -D - -A "$UA" https://example.com/blog/local-seo/ -o page.html | grep -i '^x-robots-tag'
grep -io '<meta[^>]*name="\(robots\|googlebot\)"[^>]*>' page.html
grep -io '<link[^>]*rel="canonical"[^>]*>' page.html

# Redirect chain: every hop with its code
curl -sIL -A "$UA" http://example.com/blog/local-seo | grep -iE '^(HTTP|location)'`}
			</Code>

			<Text fw={600}>Statuses the “Index statuses” table does not list</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={230}>Status</Table.Th>
						<Table.Th>What it means</Table.Th>
						<Table.Th>What to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{EXTRA_STATUSES.map((row) => (
						<Table.Tr key={row.status}>
							<Table.Td fw={600}>{row.status}</Table.Td>
							<Table.Td>{row.means}</Table.Td>
							<Table.Td>{row.act}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Traffic fell: how to find the cause</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>Confirm it and narrow it down.</b> Performance → Date → Compare: periods of
					equal length with the same weekdays, plus the same period a year ago to separate
					seasonality. Then the filters: page, query, country, device, search type (web,
					images, video, news).
				</List.Item>
				<List.Item>
					<b>Split the metrics.</b> Positions down is lost ranking. Positions steady and
					impressions down is less demand, or a changed results page. Impressions steady
					and CTR down means elements of the results page are taking the clicks. Remember
					that average position is averaged over impressions: a page that starts appearing
					for many new long-tail queries “loses” average position without losing anything.
				</List.Item>
				<List.Item>
					<b>Line the dates up.</b> The Google Search Status Dashboard publishes the dates
					of core updates, spam updates and incidents in crawling, indexing and serving. A
					drop that starts with an update is a strong hint; so is one that starts with
					your release.
				</List.Item>
				<List.Item>
					<b>Rule out the technical causes.</b> Page indexing: did the number of excluded
					pages grow; Crawl stats: spikes of 5xx and trouble fetching robots.txt; URL
					Inspection on several of the pages that fell.
				</List.Item>
				<List.Item>
					<b>Rule out penalties.</b> Manual actions and Security issues should both be
					empty.
				</List.Item>
			</List>

			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom</Table.Th>
						<Table.Th>Where to look</Table.Th>
						<Table.Th>Likely cause</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{TRAFFIC_DROPS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td fw={600}>{row.symptom}</Table.Td>
							<Table.Td>{row.where}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
							<Table.Td>{row.action}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<CheckedHere>
				The tracker cannot see Google's index, but it does find the reasons on the page that
				keep it out: “The page is set to noindex” (<Code>NOINDEX</Code>, X-Robots-Tag
				included), “robots.txt blocks Googlebot” (<Code>ROBOTS_BLOCKS_GOOGLEBOT</Code>),
				“The canonical points at another page” (<Code>CANONICAL_MISMATCH</Code>), “Almost
				the same text as another page” (<Code>NEAR_DUPLICATE_CONTENT</Code>), “Missing pages
				answer 200 (soft 404)” (<Code>SOFT_404</Code>), “The page answers with an error
				code” (<Code>LH_HTTP_STATUS_CODE</Code>). It has no Search Console data, so work a
				traffic drop in Search Console itself.
			</CheckedHere>
		</GuideSection>
	);
}

const PARITY = [
	{
		what: "Main content",
		breaks: "The text is cut down in the mobile version. Accordions and tabs are fine, as long as the content is in the DOM.",
	},
	{
		what: "Lazy loading",
		breaks: "Content that only loads on a swipe, a click or typing — Googlebot does none of those. Lazy loading on entering the viewport (loading=lazy, IntersectionObserver) works.",
	},
	{
		what: "Links",
		breaks: "The mobile menu and footer are shorter than the desktop ones, so internal links disappear, and with them discovery and the weight they pass.",
	},
	{
		what: "Meta robots",
		breaks: "Different rules: a noindex or nofollow in the mobile version alone applies to the whole site in the index.",
	},
	{
		what: "Title, description, headings",
		breaks: "Shortened or different headings in the mobile template.",
	},
	{
		what: "Structured data",
		breaks: "Markup only on desktop. On a separate m. site the markup has to carry the mobile URLs.",
	},
	{
		what: "Images and video",
		breaks: "Different image URLs, missing alt, low-quality images, video that cannot be found on the mobile page.",
	},
	{
		what: "Resources",
		breaks: "robots.txt blocks the mobile CSS, JS or images, so Google cannot render the page.",
	},
] as const;

/** Google indexes what its smartphone crawler sees; how to keep the two versions equal. */
export function MobileFirstSection() {
	return (
		<GuideSection
			section={S.mobileFirst}
			sources={[
				SRC.mobileFirst,
				SOURCES.mobileFirstLanded,
				SOURCES.pageExperience2023,
				SRC.googlebot,
				SOURCES.urlInspection,
				SOURCES.lighthouse,
			]}
		>
			<Text>
				Google indexes and ranks the version of the page that Googlebot Smartphone gets.
				Anything missing from the mobile version — text, a link, markup — does not exist for
				Google, however complete the desktop version is. Google declared the move to
				mobile-first indexing finished in 2023; the handful of sites that do not work on
				mobile at all it still crawls with the desktop crawler. With responsive design (one
				URL, one HTML) parity comes for free — except where a script or the template loads
				different content depending on the screen width.
			</Text>

			<Text fw={600}>What has to match</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={200}>Element</Table.Th>
						<Table.Th>How it usually breaks</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{PARITY.map((row) => (
						<Table.Tr key={row.what}>
							<Table.Td fw={600}>{row.what}</Table.Td>
							<Table.Td>{row.breaks}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>The three configurations</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Responsive design</b> — one URL, one HTML, a different layout through CSS.
					Google recommends it as the easiest to maintain.
				</List.Item>
				<List.Item>
					<b>Dynamic serving</b> — one URL, different HTML depending on the user agent. It
					needs the <Code>Vary: User-Agent</Code> header, or caches and CDNs will hand the
					desktop version to a phone, or the other way round.
				</List.Item>
				<List.Item>
					<b>A separate mobile site</b> (<Code>m.example.com</Code>) — different URLs. It
					needs paired annotations, a one-to-one match between pages, the same status
					codes on error pages, and hreflang between versions of the same kind (mobile to
					mobile, desktop to desktop).
				</List.Item>
			</List>
			<Code block>
				{`<!-- desktop: https://www.example.com/blog/local-seo/ -->
<link rel="alternate" media="only screen and (max-width: 640px)"
      href="https://m.example.com/blog/local-seo/">

<!-- mobile: https://m.example.com/blog/local-seo/ -->
<link rel="canonical" href="https://www.example.com/blog/local-seo/">

# dynamic serving: the response header on the shared URL
Vary: User-Agent`}
			</Code>

			<Text fw={600}>What to test with now</Text>
			<Text size="sm">
				The Mobile-Friendly Test, its API and the Search Console Mobile Usability report
				were all retired on 1 December 2023. What replaced them:
			</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>URL Inspection → live test.</b> Run by Googlebot Smartphone: the rendered
					HTML, a screenshot, the resources that failed. This is what goes into the index.
				</List.Item>
				<List.Item>
					<b>Lighthouse</b> in Chrome DevTools in mobile mode, or PageSpeed Insights:
					viewport, font sizes, performance on mobile.
				</List.Item>
				<List.Item>
					<b>Chrome DevTools</b> → Network conditions: pick the Googlebot Smartphone user
					agent and compare the page with the desktop one.
				</List.Item>
				<List.Item>
					<b>curl with two user agents</b> — for dynamic serving and m. sites, where the
					HTML itself differs:
				</List.Item>
			</List>
			<Code block>
				{String.raw`M='Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
D='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36'
URL=https://example.com/blog/local-seo/

curl -s -A "$M" "$URL" > m.html
curl -s -A "$D" "$URL" > d.html
for f in m.html d.html; do
  echo "$f words=$(sed 's/<[^>]*>/ /g' "$f" | wc -w)" \
       "links=$(grep -o '<a [^>]*href' "$f" | wc -l)" \
       "jsonld=$(grep -c 'application/ld+json' "$f")"
done
grep -io '<meta[^>]*name="robots"[^>]*>' m.html d.html
grep -io '<title>[^<]*' m.html d.html`}
			</Code>

			<Text fw={600}>A mobile-against-desktop checklist</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					The main text matches in length; nothing is hidden outside the DOM.
				</List.Item>
				<List.Item>
					The internal links from the menu, the footer and the body are in both versions.
				</List.Item>
				<List.Item>
					The same title, meta description, H1–H3, meta robots and canonical.
				</List.Item>
				<List.Item>
					The same structured data; the Rich Results Test passes with the smartphone
					agent.
				</List.Item>
				<List.Item>
					Images with the same URLs and alt text; lazy loading that needs no user action.
				</List.Item>
				<List.Item>
					robots.txt does not block the mobile version's resources; an m. site has its own
					robots.txt with the same rules, and a server that can take the whole crawl.
				</List.Item>
				<List.Item>
					In URL Inspection the crawler is the smartphone one, and the screenshot shows
					the whole content.
				</List.Item>
			</List>

			<CheckedHere>
				The tracker checks the page's mobile setup — “No mobile viewport” (
				<Code>VIEWPORT_MISSING</Code>) — and mobile speed from field data: “Poor LCP on
				mobile” (<Code>CWV_LCP_POOR</Code>) and its INP and CLS neighbours. It cannot
				compare the mobile and desktop versions: its crawler fetches one version of the
				HTML, under its own user agent.
			</CheckedHere>
		</GuideSection>
	);
}

const ALARMS = [
	{
		sign: "A steady share of 5xx, 429 or timeouts",
		means: "Google is slowing the crawl down; pages that answer with an error for long enough fall out of the index.",
	},
	{
		sign: "A large share of requests to URLs with parameters",
		means: "Filters, sorts, sessions and UTM tags are eating the crawling meant for content.",
	},
	{
		sign: "Googlebot regularly gets 404s and 301s from the site's own links",
		means: "Broken internal links and links to old addresses: each one costs an extra request.",
	},
	{
		sign: "Important sitemap URLs have not been requested for weeks",
		means: "They lack internal links, or the site is spending its crawling on junk URLs.",
	},
	{
		sign: "robots.txt answers 5xx or 429",
		means: "Google pauses crawling of the whole site.",
	},
	{
		sign: "A sharp fall in requests after a release",
		means: "A new robots.txt rule, a server that got slower, or a WAF that started turning Googlebot away.",
	},
	{
		sign: "Many “Googlebot” hits that fail verification",
		means: "Scrapers under someone else's user agent: you may block them, but only on the result of the IP check.",
	},
] as const;

/** Server logs as the only record of what Google actually fetched, and how to read them. */
export function ServerLogsSection() {
	return (
		<GuideSection
			section={S.serverLogs}
			sources={[
				SOURCES.verifyGooglebot,
				SRC.googlebot,
				SRC.googleCrawlers,
				SOURCES.crawlStats,
				SOURCES.robotsReport,
				SRC.crawlBudget,
				SRC.sitemaps,
			]}
		>
			<Text>
				Server logs are the only complete record of what Google actually crawled: every URL,
				status code, size, response time and user agent. Search Console shows aggregates and
				example URLs; URL Inspection shows one page at a time. Logs answer the questions
				nothing else answers: which sections Googlebot ignores, what it spends its requests
				on, how quickly it finds new posts. If a CDN sits in front of the site, take the
				logs from the CDN: requests served from its cache never reach the origin's logs.
			</Text>

			<Text fw={600}>First, make sure it is Googlebot</Text>
			<Text size="sm">
				A user agent is trivial to fake, so the word “Googlebot” in a log proves nothing.
				The check has two steps: a reverse DNS lookup on the IP must give a name in the{" "}
				<Code>googlebot.com</Code> or <Code>google.com</Code> domain (
				<Code>googleusercontent.com</Code> for user-triggered fetchers), and a forward
				lookup on that name must return the same IP.
			</Text>
			<Code block>
				{`$ host 66.249.66.1
1.66.249.66.in-addr.arpa domain name pointer crawl-66-249-66-1.googlebot.com.
$ host crawl-66-249-66-1.googlebot.com
crawl-66-249-66-1.googlebot.com has address 66.249.66.1`}
			</Code>
			<Text size="sm">
				To check in bulk it is easier to match IPs against the ranges Google publishes as
				JSON: <Code>common-crawlers.json</Code> (Googlebot and the other common crawlers),{" "}
				<Code>special-crawlers.json</Code>, <Code>user-triggered-fetchers.json</Code> and{" "}
				<Code>user-triggered-fetchers-google.json</Code> — the current links are on the
				“Verifying Googlebot” page. The Googlebot list used to be called{" "}
				<Code>googlebot.json</Code>; if your script downloads that, check the address
				against the documentation.
			</Text>

			<Text fw={600}>Analysis in a shell (combined log format)</Text>
			<Text size="sm">
				A combined log line reads{" "}
				<Code>{`IP - - [date] "GET /path HTTP/1.1" code bytes "referer" "user-agent"`}</Code>
				. Split on spaces, the path is field <Code>$7</Code> and the code <Code>$9</Code>;
				split on quotes, the user agent is <Code>$6</Code>.
			</Text>
			<Code block>
				{String.raw`# 30 days of rotated logs -> only requests claiming to be Googlebot
zcat -f access.log* | grep -i 'googlebot' > gbot.log

# Verify every IP: reverse DNS, then forward DNS back to the same IP
awk '{print $1}' gbot.log | sort -u | while read ip; do
  name=$(host "$ip" | awk '/pointer/ {print $NF}')
  case "$name" in
    *.googlebot.com.|*.google.com.)
      host "$name" | grep -qF "$ip" && echo "OK   $ip $name" || echo "FAKE $ip $name" ;;
    *) echo "FAKE $ip" ;;
  esac
done > verdict.txt
grep '^OK' verdict.txt | awk '{print $2}' > good-ips.txt
awk 'NR==FNR {ok[$1]; next} $1 in ok' good-ips.txt gbot.log > gbot-verified.log

# Share of response codes
awk '{c[$9]++; n++} END {for (s in c) printf "%s %d %.1f%%\n", s, c[s], 100*c[s]/n}' \
  gbot-verified.log | sort -k2 -rn

# Smartphone vs desktop Googlebot
awk -F'"' '$6 ~ /Googlebot\/2\.1/ { if ($6 ~ /Android/) m++; else d++ }
  END {print "smartphone", m, "desktop", d}' gbot-verified.log

# Top crawled URLs
awk '{print $7}' gbot-verified.log | sort | uniq -c | sort -rn | head -30

# Share of URLs with parameters, and which parameters
awk '{n++; if ($7 ~ /\?/) p++} END {printf "%d of %d (%.1f%%)\n", p, n, 100*p/n}' gbot-verified.log
awk '$7 ~ /\?/ {sub(/^[^?]*\?/, "", $7); print $7}' gbot-verified.log \
  | tr '&' '\n' | cut -d= -f1 | sort | uniq -c | sort -rn | head

# 404s and redirects Googlebot keeps hitting
awk '$9 == 404 {print $7}' gbot-verified.log | sort | uniq -c | sort -rn | head -20
awk '$9 ~ /^30[1278]$/ {print $9, $7}' gbot-verified.log | sort | uniq -c | sort -rn | head -20

# Sitemap URLs Googlebot has not requested in 30 days
curl -s https://example.com/sitemap.xml | grep -o '<loc>[^<]*' \
  | sed -E 's#<loc>https?://[^/]+##' | sort -u > sitemap.txt
awk '{sub(/\?.*/, "", $7); print $7}' gbot-verified.log | sort -u > crawled.txt
comm -23 sitemap.txt crawled.txt | wc -l
comm -23 sitemap.txt crawled.txt | head -20`}
			</Code>
			<Text size="sm">
				For a sitemap index, collect the addresses from every nested file. The URLs in the
				sitemap and in the log have to be written the same way — same trailing slash, same
				encoding — or <Code>comm</Code> will report misses that are not there.
			</Text>

			<Text fw={600}>Reconciling with Search Console</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Settings → Crawl stats</b> — for a domain property or a property at the root
					only. Total requests, total download size, average response time; breakdowns by
					response, by file type, by purpose (Discovery / Refresh) and by Googlebot type;
					and host status: fetching robots.txt, DNS resolution, server connectivity.
				</List.Item>
				<List.Item>
					The Search Console figures and the logs should be of the same order. If Search
					Console counts far more requests, some of them never reached your server or its
					logs (a CDN, a load balancer, an unreachable robots.txt).
				</List.Item>
				<List.Item>
					<b>The robots.txt report</b> (Settings → robots.txt) replaced the old robots.txt
					tester at the end of 2023. It shows which robots.txt files Google found for the
					site's top 20 hosts, when it fetched each one, with what status, its size and
					its parse errors; you can also ask for a refetch from there after a fix.
				</List.Item>
			</List>

			<Text fw={600}>Warning signs</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{ALARMS.map((row) => (
						<Table.Tr key={row.sign}>
							<Table.Td w={260} fw={600}>
								{row.sign}
							</Table.Td>
							<Table.Td>{row.means}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				A large share of requests to CSS, JS and images is normal in itself: those are the
				resources for rendering. Desktop Googlebot in the majority on an ordinary site is a
				reason to check that the site works on a phone.
			</Text>

			<CheckedHere>
				The tracker does not read server logs. Its own crawler is visible in them, though:
				it introduces itself as{" "}
				<Code>SeoKeywordTrackerBot/1.0 (+https://github.com/trino27/keyword-tracker)</Code>{" "}
				and obeys the robots.txt rules for the <Code>SeoKeywordTrackerBot</Code> token. It
				does not get in the way of a Googlebot analysis — a filter on “googlebot” does not
				catch it — and a site owner who wants to limit the tracker's crawl only needs rules
				for that token.
			</CheckedHere>
		</GuideSection>
	);
}
