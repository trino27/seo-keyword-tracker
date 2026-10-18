import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S, SPA_PART_TITLE } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** Pages these chapters cite beyond the shared list; each was opened against its sentence on 2026-10-12. */
const SOURCES = {
	fixJavascript: {
		title: "Google Search Central: Fix Search-related JavaScript problems",
		url: "https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript",
	},
	dynamicRendering: {
		title: "Google Search Central: Dynamic rendering as a workaround",
		url: "https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering",
	},
	lazyLoading: {
		title: "Google Search Central: Fix lazy-loaded content",
		url: "https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading",
	},
	urlInspection: {
		title: "Search Console Help: URL Inspection tool",
		url: "https://support.google.com/webmasters/answer/9012289",
	},
	canonicalTroubleshooting: {
		title: "Google Search Central: Fix canonicalization issues",
		url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting",
	},
	localeAdaptive: {
		title: "Google Search Central: How Google crawls locale-adaptive pages",
		url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
	},
	createRobots: {
		title: "Google Search Central: How to write and submit a robots.txt file",
		url: "https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt",
	},
	robotsReport: {
		title: "Search Console Help: robots.txt report",
		url: "https://support.google.com/webmasters/answer/6062598",
	},
	robotsLibrary: {
		title: "GitHub: google/robotstxt — Google's robots.txt parser and matcher library",
		url: "https://github.com/google/robotstxt",
	},
	commonCrawlers: {
		title: "Google: Google's common crawlers",
		url: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
	},
	yandexRobots: {
		title: "Yandex Webmaster: How to use the robots.txt file",
		url: "https://yandex.com/support/webmaster/en/controlling-robot/robots-txt",
	},
	yandexCleanParam: {
		title: "Yandex Webmaster: The Clean-param directive",
		url: "https://yandex.com/support/webmaster/en/robot-workings/clean-param",
	},
	breadcrumbsMobile: {
		title: "Google Search Central Blog: Simplifying the visible URL element on mobile search results",
		url: "https://developers.google.com/search/blog/2025/01/simplifying-breadcrumbs",
	},
	howtoFaq: {
		title: "Google Search Central Blog: Changes to HowTo and FAQ rich results",
		url: "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
	},
	sitelinksSearchBox: {
		title: "Google Search Central Blog: Farewell, Sitelinks Search Box",
		url: "https://developers.google.com/search/blog/2024/10/sitelinks-search-box",
	},
	simplifyingResults: {
		title: "Google Search Central Blog: Simplifying the search results page",
		url: "https://developers.google.com/search/blog/2025/06/simplifying-search-results",
	},
	richResultsTest: {
		title: "Google: Rich Results Test",
		url: "https://search.google.com/test/rich-results",
	},
	schemaValidator: {
		title: "Schema.org: Schema Markup Validator",
		url: "https://validator.schema.org/",
	},
	jsonLd: {
		title: "W3C: JSON-LD 1.1",
		url: "https://www.w3.org/TR/json-ld11/",
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

const WRS_BEHAVIOUR = [
	{
		topic: "Resource caching",
		how: "Google caches JS and CSS aggressively and may ignore caching headers — a page can be rendered with an old script or stylesheet.",
		act: "Put a content fingerprint in the file name (main.2bb85551.js): a new version is a new URL.",
	},
	{
		topic: "State",
		how: "The renderer keeps nothing between loads: cookies, localStorage and sessionStorage are cleared.",
		act: "Content must not depend on saved state — cookie consent, an experiment flag, “has been here before”. Nor should a service worker be the only way to get the content: Google promises no support for it.",
	},
	{
		topic: "User actions",
		how: "Google Search does not interact with the page: it does not click, scroll or type.",
		act: 'Text that only enters the DOM on a click (“Show more”, a tab) or a scroll event is invisible to Google. Do lazy loading with loading="lazy" or an IntersectionObserver.',
	},
	{
		topic: "Permissions",
		how: "Googlebot declines permission requests — location, notifications, camera.",
		act: "The page has to show its content without them.",
	},
	{
		topic: "The robots meta tag and the canonical",
		how: "On meeting a noindex in the source HTML, Google may skip rendering. A canonical inserted by a script, Google reads while rendering.",
		act: "Put the robots rule and the canonical in the server's HTML; do not change them with a script and do not add a second canonical.",
	},
	{
		topic: "Routes and links",
		how: "Google finds links only in <a> elements with an href; routes in fragments (#/pricing) are not reliably resolved.",
		act: "The History API and real URLs; navigation through ordinary links.",
	},
] as const;

const RENDER_PROBLEMS = [
	{
		symptom: "After a release Google still sees the old layout or text",
		cause: "The renderer took the previous bundle, under the same file name, from its cache.",
		act: "Content fingerprints in the JS and CSS file names.",
	},
	{
		symptom: "The URL Inspection screenshot is blank, or shows only the cookie banner",
		cause: "The content waits for a click, consent or saved state; or a script threw.",
		act: "Read the console messages under More info; serve the content with no interaction needed.",
	},
	{
		symptom: "The rendered HTML has no styles, or is missing part of the content",
		cause: "Scripts or styles are blocked in robots.txt, or answer with an error.",
		act: "Check the page's resource list: every blocked or failed request is listed there.",
	},
	{
		symptom: "Google picked the wrong canonical",
		cause: "A script rewrites the canonical, or adds a second one.",
		act: "One canonical, in the server's HTML.",
	},
] as const;

const INDEX_STATUSES = [
	{
		status: "Server error (5xx)",
		means: "The server answered Googlebot's request with a 5xx.",
		act: "Check the hosting and the Crawl stats report: overload, timeouts, a configuration error. Then test the URL live.",
	},
	{
		status: "Redirect error",
		means: "The redirect chain is too long or loops, the URL exceeded the allowed length, or a hop in the chain is empty or invalid.",
		act: "Walk the chain (curl -sIL) and send the old address straight to the final URL that answers 200.",
	},
	{
		status: "URL blocked by robots.txt",
		means: "A robots.txt rule forbids Googlebot from crawling the page.",
		act: "If it belongs in search, remove the rule. If it should leave search, unblock it and add a noindex: robots.txt does not forbid indexing.",
	},
	{
		status: "URL marked ‘noindex’",
		means: "A robots meta tag or an X-Robots-Tag header forbids indexing the page.",
		act: "If that is intended, nothing. If not, remove the noindex from both the HTML and the response headers (often a plugin, or a “discourage search engines” setting).",
	},
	{
		status: "Soft 404",
		means: "The page looks like a “not found” or is empty, but answers 200.",
		act: "For a removed page, answer a real 404 or 410; for a live one, give it content that shows it is a real page.",
	},
	{
		status: "Blocked due to unauthorized request (401)",
		means: "Access needs credentials, and Googlebot does not authenticate.",
		act: "Take the authentication off the pages that belong in search, or open them to the verified Googlebot. Leave genuinely private sections as they are.",
	},
	{
		status: "Not found (404)",
		means: "The page answers 404; Google learned of the URL on its own, not from you.",
		act: "A removed page with no replacement needs nothing. A moved one needs a 301 to its new address.",
	},
	{
		status: "Blocked due to access forbidden (403)",
		means: "The server refused Googlebot. Googlebot sends no credentials, so this is most likely a server misconfiguration.",
		act: "Open the page without authentication. A common cause is a WAF or bot protection: allow the verified Googlebot.",
	},
	{
		status: "URL blocked due to other 4xx issue",
		means: "The server returned a 4xx that none of the other reasons covers.",
		act: "Find the code and the cause in URL Inspection and fix the server's answer.",
	},
	{
		status: "Crawled – currently not indexed",
		means: "Google fetched the page but has not added it to the index; it may do so later.",
		act: "There is no need to resubmit the URL. If the page matters, make it markedly more useful and distinct, link to it from the site's strong pages, and check it is not a near-duplicate of another.",
	},
	{
		status: "Discovered – currently not indexed",
		means: "Google knows the URL but has not crawled it yet: crawling was postponed, probably to spare the site. There is no last-crawl date.",
		act: "Usually wait. If there are many such URLs, check server speed and crawl budget (surplus URLs from parameters and filters), the links to the page, and whether it is in the sitemap.",
	},
	{
		status: "Alternate page with proper canonical tag",
		means: "The page correctly points its canonical at another page, which is indexed.",
		act: "Nothing to do.",
	},
	{
		status: "Duplicate without user-selected canonical",
		means: "Google considers the page a copy of another and chose that one as canonical; you declared no canonical.",
		act: "For real duplicates this is fine. If Google chose the wrong page, declare the canonical; if the page is not a duplicate, make its content markedly different.",
	},
	{
		status: "Duplicate, Google chose different canonical than user",
		means: "You declared a canonical, but Google judged a different URL to be the canonical one.",
		act: "Compare the two addresses in URL Inspection. If the page you named does not resemble this one, Google will not choose it; otherwise make the signals agree — redirects, internal links, the sitemap, hreflang.",
	},
	{
		status: "Page with redirect",
		means: "The URL redirects elsewhere, so it is not indexed itself; the target may be.",
		act: "Check that the target is indexed. Take the redirecting URL out of the sitemap and the internal links.",
	},
	{
		status: "Indexed, though blocked by robots.txt",
		means: "A warning: the page reached the index through external links although crawling it is forbidden.",
		act: "To take it out of search, remove the robots.txt block and add a noindex. To keep it in search, allow crawling.",
	},
	{
		status: "Page indexed without content",
		means: "A warning: the page is in the index but Google could not read its content — because of cloaking, say, or a format Google does not index.",
		act: "Inspect the URL and look at what Google actually receives (the coverage section and the tested page).",
	},
] as const;

/** Rendering, crawl budget and indexing statuses: what happens between "found" and "in results". */
export function CrawlIndexInDepth() {
	return (
		<>
			<GuideSection
				section={S.rendering}
				sources={[
					SRC.javascriptSeo,
					SOURCES.fixJavascript,
					SOURCES.lazyLoading,
					SOURCES.dynamicRendering,
					SOURCES.urlInspection,
					SRC.howSearchWorks,
				]}
			>
				<Text>
					Google processes a page in three phases: <b>crawling</b> (fetching it, after
					checking robots.txt), <b>rendering</b> (running its JavaScript in a headless
					Chromium — the Web Rendering Service, WRS) and <b>indexing</b> (storing what the
					rendered page says). Every page that answers 200 is queued for rendering, unless
					a robots meta tag or header forbids indexing it; it may wait seconds, sometimes
					longer. Links found in the rendered page are queued for crawling in turn.
				</Text>
				<Text>
					If the site is a single-page application (React, Vue or Angular with no
					server-side rendering), this is only the general mechanism. How routes and
					status codes, per-route metadata and Core Web Vitals work in an SPA, and how to
					test them, is in the part “{SPA_PART_TITLE}”.
				</Text>
				<Text>
					For traffic this means: content that only appears once JavaScript has run is
					seen later — and only if rendering worked. Most AI assistants' crawlers do not
					run JavaScript at all, so to them such a post is empty. Server-side rendering
					(SSR) or static generation (SSG) put the text in the HTML for every crawler.
				</Text>

				<Text fw={600}>How Google's renderer behaves</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={150}>What</Table.Th>
							<Table.Th>How it works</Table.Th>
							<Table.Th>What to do</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{WRS_BEHAVIOUR.map((row) => (
							<Table.Tr key={row.topic}>
								<Table.Td fw={600}>{row.topic}</Table.Td>
								<Table.Td>{row.how}</Table.Td>
								<Table.Td>{row.act}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>Dynamic rendering</b> — serving bots a pre-rendered version and people
						the client-side app — Google itself calls a workaround, not a long-term
						solution. It recommends server-side rendering, static generation or
						hydration instead.
					</List.Item>
					<List.Item>
						An app that shows “not found” with a 200 creates soft 404s: redirect with a
						script to a URL that answers 404, or add a noindex to the error view.
					</List.Item>
				</List>
				<Code block>
					{`<!-- Bad: the server sends an empty shell, the text needs JavaScript -->
<div id="root"></div>
<script src="/static/main.js"></script>

<!-- Good: the text is in the HTML (SSR/SSG); the bundle name changes with its content -->
<div id="root"><article><h1>Local SEO checklist</h1><p>Twelve steps…</p></article></div>
<script src="/static/main.2bb85551.js" defer></script>`}
				</Code>

				<Text fw={600}>How to check it yourself</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						Search Console → URL Inspection → Test live URL → View tested page. There
						you get the rendered HTML, a Screenshot tab and More info: the page
						resources that failed to load, and the JavaScript console messages. The
						screenshot exists only in the live test; for the indexed version there is
						View crawled page — the HTML and the resources, with no screenshot.
					</List.Item>
					<List.Item>
						Compare the source HTML with the rendered one: if a key phrase is absent
						from the server's answer, the text depends on JavaScript.
						<Code block>
							{`curl -s https://example.com/blog/local-seo/ | grep -c "Twelve steps"
# 0 means the text is not in the server's HTML: it depends on JavaScript`}
						</Code>
					</List.Item>
					<List.Item>
						In Chrome DevTools turn JavaScript off (Command Menu → Disable JavaScript)
						and reload — that is how crawlers that run no scripts see the page.
					</List.Item>
					<List.Item>
						Without access to Search Console, the Rich Results Test also shows the
						rendered HTML.
					</List.Item>
				</List>

				<Text fw={600}>Common problems</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Symptom</Table.Th>
							<Table.Th>Cause</Table.Th>
							<Table.Th>What to do</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{RENDER_PROBLEMS.map((row) => (
							<Table.Tr key={row.symptom}>
								<Table.Td>{row.symptom}</Table.Td>
								<Table.Td>{row.cause}</Table.Td>
								<Table.Td>{row.act}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<CheckedHere checks="Posts need JavaScript to show their text (CONTENT_NEEDS_JAVASCRIPT, site) — the tracker's crawler runs no scripts and flags posts that arrived as an empty shell; Links Google cannot follow (UNCRAWLABLE_LINKS); robots.txt blocks scripts or styles (ROBOTS_BLOCKS_RESOURCES); the Lighthouse audits, which see the rendered page." />
			</GuideSection>

			<GuideSection section={S.crawlBudget} sources={[SRC.crawlBudget]}>
				<Text>
					Crawl budget is how many of a site's URLs Google can and wants to crawl. Two
					quantities set it: the <b>crawl capacity limit</b> — how much the server can
					take without slowing down; it rises when the server answers quickly and
					steadily, and falls on slow answers, 5xx and 429 — and <b>crawl demand</b> — how
					many URLs Google sees on the site, how popular they are and how long ago they
					changed.
				</Text>
				<Text>
					Google writes its guidance for three kinds of site: large ones (from a million
					unique pages) whose content changes about weekly; medium and large ones (from
					10,000 unique pages) whose content changes daily; and sites with a large share
					of URLs in “Discovered – currently not indexed”. A blog whose new posts are
					crawled on the day they are published does not need to think about budget.
				</Text>
				<DoAvoid
					good={[
						"Consolidate duplicates: one URL per piece of content.",
						"Block in robots.txt the URLs that do not belong in search (endless filters, site search).",
						"Answer 404 or 410 for pages that are gone.",
						"Keep the sitemap current, with an accurate lastmod.",
						"Keep the server fast; support 304 Not Modified.",
					]}
					bad={[
						"Soft 404s — they go on being crawled.",
						"Long redirect chains.",
						"noindex to save crawling — Google still requests the page to see it; robots.txt is the tool for that.",
						"Blocking sections in robots.txt temporarily to “redistribute” budget: Google will not give what is freed to other pages unless it is hitting the server's limit.",
						"Endless URL variants from filters, sessions and parameters.",
					]}
				/>
				<Text size="sm">
					How to check: in Search Console open Settings → Crawl stats — the number of
					requests, the average response time, breakdowns by response code, file type and
					crawl purpose, and host status. A rising response time and a rising share of 5xx
					are the first sign that Google is about to slow down.
				</Text>
				<CheckedHere checks="Missing pages answer 200 (soft 404) (SOFT_404), Host redirects chain or are temporary (HOST_REDIRECT_CHAIN), The sitemap's lastmod dates look generated, not real (SITEMAP_LASTMOD_UNRELIABLE), Internal links to non-canonical URLs (INTERNAL_LINK_VARIANTS), Links on the site go through a redirect (LINKS_TO_REDIRECTS)." />
			</GuideSection>

			<GuideSection
				section={S.indexStatus}
				sources={[
					SRC.pageIndexing,
					SOURCES.urlInspection,
					SRC.searchConsole,
					SRC.howSearchWorks,
				]}
			>
				<Text>
					To get a new or updated page found, link to it from other pages, add it to the
					sitemap, and in URL Inspection test the URL live and press Request indexing.
					None of this guarantees indexing — Google decides.
				</Text>
				<Text>
					The <b>Page indexing</b> report shows how many pages are in the index and names
					a reason for the rest. Click a reason and you get a list of example URLs, each
					of which opens in URL Inspection. After a fix, run Validate fix in the report:
					Google recrawls the affected URLs. The names below are those of the Search
					Console help; the interface sometimes words them slightly differently.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={230}>Status</Table.Th>
							<Table.Th>What it means</Table.Th>
							<Table.Th>What to do</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{INDEX_STATUSES.map((row) => (
							<Table.Tr key={row.status}>
								<Table.Td fw={600}>{row.status}</Table.Td>
								<Table.Td>{row.means}</Table.Td>
								<Table.Td>{row.act}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					Work through the reasons you did not expect first: a sitemap page marked
					noindex, a robots.txt block, a 5xx. “Not found (404)” and “Page with redirect”
					for removed and moved addresses are ordinary, not errors.
				</Text>
				<Text size="sm" c="dimmed">
					The tracker cannot see Google's index; it finds the causes on the page —
					noindex, robots.txt, a canonical, duplicates, soft 404s — that these statuses
					report after the fact.
				</Text>
			</GuideSection>
		</>
	);
}

const TITLE_REWRITES = [
	["Half-empty", "Part of the title is missing, e.g. only the site name."],
	["Obsolete", "The title names a different year than the page shows."],
	["Inaccurate", "The title does not match what the page is about."],
	[
		"Micro-boilerplate",
		"Many pages share nearly the same title; Google adds what tells them apart.",
	],
	["No clear main title", "Several headings look equally important."],
	["Language or script mismatch", "The title is in another language or alphabet than the page."],
] as const;

/** Titles, descriptions and headings — the parts of a page a searcher reads first. */
export function OnPageInDepth() {
	return (
		<>
			<GuideSection section={S.titles} sources={[SRC.titleLinks, SRC.starterGuide]}>
				<Text>
					The headline of a search result is the <b>title link</b>. Google writes it
					mainly from the <Code>&lt;title&gt;</Code>, but also reads the page's main
					visible title, its <Code>&lt;h1&gt;</Code>, og:title, prominent text, anchor
					text of links to the page and WebSite structured data — and rewrites the title
					when it serves searchers badly:
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						{TITLE_REWRITES.map(([reason, means]) => (
							<Table.Tr key={reason}>
								<Table.Td w={200} fw={600}>
									{reason}
								</Table.Td>
								<Table.Td>{means}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Code block>
					{`Good: <title>Local SEO checklist: 12 steps to the map pack | Example</title>
Bad:  <title>Home</title>
Bad:  <title>SEO, SEO tips, SEO checklist, best SEO, SEO 2026</title>`}
				</Code>
				<DoAvoid
					good={[
						"A unique title on every page, naming what it offers.",
						"The subject first, the brand short at the end after a separator.",
						"The same language and alphabet as the page.",
						"A clear main heading that agrees with the title.",
					]}
					bad={[
						"The same or nearly the same title on many pages.",
						"Repeating keywords.",
						"A year in the title the page no longer lives up to.",
						"Titles that over-promise what the page delivers.",
					]}
				/>
				<CheckedHere checks="No title tag (TITLE_MISSING), Title length (TITLE_LENGTH), The title is in a different script from the page (TITLE_SCRIPT_MISMATCH), The title names a past year (TITLE_YEAR_OUTDATED), The same title as another page (TITLE_DUPLICATE); Lighthouse: The title tag is missing or empty (LH_DOCUMENT_TITLE)." />
			</GuideSection>

			<GuideSection section={S.descriptions} sources={[SRC.snippets]}>
				<Text>
					The text under the headline is the <b>snippet</b>. Google builds it mostly from
					the page itself, choosing the passage that best matches each search — so one
					page can show different snippets for different queries. It uses the{" "}
					<Code>meta description</Code> when that describes the page better. The
					description is not a ranking factor and has no fixed length; Google cuts
					snippets to fit the screen.
				</Text>
				<Code block>
					{`<meta name="description" content="Twelve steps to rank in Google's local map pack — from your Business Profile to reviews, with a printable checklist.">`}
				</Code>
				<DoAvoid
					good={[
						"A unique summary per page that makes the click worthwhile.",
						"Concrete facts: what is inside, for whom, by whom, when.",
						"For large sites, descriptions generated from the page's data — readable, not templated.",
					]}
					bad={[
						"The same description on every page.",
						"A list of keywords.",
						"Repeating the title.",
					]}
				/>
				<Text size="sm">
					To limit snippets: <Code>nosnippet</Code>, <Code>max-snippet</Code>, or{" "}
					<Code>data-nosnippet</Code> on a passage (see Meta robots).
				</Text>
				<CheckedHere checks="No meta description (META_DESCRIPTION_MISSING), Meta description length (META_DESCRIPTION_LENGTH), The description repeats the title (META_DESCRIPTION_REPEATS_TITLE), The same meta description as another page (META_DESCRIPTION_DUPLICATE), The snippet in results is restricted (SNIPPET_RESTRICTED); Lighthouse: The meta description is missing or empty (LH_META_DESCRIPTION)." />
			</GuideSection>

			<GuideSection
				section={S.headingsGuide}
				sources={[SRC.mdnHeadings, SRC.starterGuide, SRC.titleLinks]}
			>
				<Text>
					Headings are the page's outline. <Code>&lt;h1&gt;</Code> names the page — one
					per page, as MDN advises; <Code>&lt;h2&gt;</Code> names its sections,{" "}
					<Code>&lt;h3&gt;</Code> their subsections. Screen reader users jump from heading
					to heading, readers skim them, and Google reads them to understand each part
					and, together with the title, to build the title link.
				</Text>
				<Code block>
					{`<h1>Local SEO checklist</h1>
  <h2>1. Claim your Business Profile</h2>
    <h3>Choosing the right category</h3>
  <h2>2. Collect reviews</h2>`}
				</Code>
				<Text size="sm">
					Google says the number and order of headings do not affect ranking — skipping a
					level is an accessibility problem, not a ranking one. What matters to search is
					that headings say what each section is about.
				</Text>
				<DoAvoid
					good={[
						"One H1 that states the subject.",
						"H2s that would make sense as a table of contents.",
						"Headings in order, one level at a time.",
					]}
					bad={[
						"A title styled as a <div> instead of an <h1>.",
						"Headings chosen for their font size.",
						"A long text with no subheadings at all.",
					]}
				/>
				<CheckedHere checks="No h1 (H1_MISSING), More than one h1 (H1_MULTIPLE), A heading level is skipped (HEADING_SKIP), No subheadings (NO_SUBHEADINGS); Lighthouse: Heading levels are out of order (LH_HEADING_ORDER)." />
			</GuideSection>
		</>
	);
}

const CANONICAL_METHODS = [
	[
		"Permanent redirect (301/308)",
		"Strong",
		"When the duplicate should no longer be reachable at all.",
	],
	[
		'rel="canonical" (link or HTTP header)',
		"Strong",
		"When both URLs on your site must keep working — tracking parameters, print versions. The header form works for PDFs.",
	],
	[
		"Listing the URL in the sitemap",
		"Weak",
		"Always, alongside the others: list only canonical URLs.",
	],
	[
		"noindex on a partner's copy (syndication)",
		"Excludes the copy",
		"When another site reprints your post. Since 2023 Google has advised against rel=canonical for syndicated copies — partners' pages often differ a great deal from the original; it is safer for the partner to keep their copy out of the index.",
	],
] as const;

/** The copies of a page that appear without anyone making them; the self-referencing canonical answers them all. */
const HIDDEN_DUPLICATES = [
	[
		"Tags in other people's links",
		"?utm_source=newsletter, ?gclid=…, ?fbclid=…, ?ref=… — added by newsletters, ads, social networks and partners. You do not control which parameters people link to you with.",
	],
	[
		"Parameters the server quietly ignores",
		"/post/?anything=1 usually serves the same page with a 200 — to Google that is a new URL with the same content.",
	],
	[
		"Address variants",
		"A trailing slash, case, /index.html, http and www — if the redirect from one of them ever breaks during a change of hosting or CDN.",
	],
	[
		"A CMS's utility addresses",
		"?replytocom= in WordPress comments, ?amp, ?preview=true, /page/1/, and a ?p=123 address living beside the pretty one.",
	],
	[
		"Hosting mirrors",
		"The platform's technical domain (project.vercel.app, site.netlify.app, the server's IP address), left open to crawling.",
	],
	[
		"Scrapers",
		"Sites that copy your HTML wholesale. If they copied an absolute canonical too, it points back at you, and Google may take that into account. It is no protection against theft, but it does no harm.",
	],
] as const;

/** One piece of content in several languages: what canonical and hreflang say in each case. */
const LANGUAGE_CASES = [
	{
		situation: "A full translation on its own URL: /blog/local-seo/ and /de/blog/lokales-seo/",
		canonical: "Each version points at itself.",
		hreflang: "The same set on both versions, each including itself, plus x-default.",
		result: "Two separate pages in the index; Google shows each user their own version.",
	},
	{
		situation: "One language, different countries: /en-us/pricing/ and /en-gb/pricing/",
		canonical: "Each points at itself.",
		hreflang: "en-US and en-GB (plus x-default).",
		result: "If the pages are nearly identical Google may pick one as canonical, but hreflang still helps show each country its own URL. Currency, prices, shipping and contacts make the versions genuinely different.",
	},
	{
		situation: "Only the menu and footer are translated; the article's text is the same",
		canonical: "To the original — this is a copy, not a translation.",
		hreflang: "Do not use it until the main text is translated.",
		result: "The original stays in the index. An hreflang on a copy whose canonical points elsewhere contradicts itself.",
	},
	{
		situation: "One source page and a machine translation per country",
		canonical: "Each points at itself.",
		hreflang: "The full set.",
		result: "Technically correct; after that the translation's quality decides. Pages produced at scale that give users almost nothing are what Google calls scaled content abuse — however they were made, and translations are named explicitly.",
	},
	{
		situation: "One URL serving different languages by IP, cookie or Accept-Language",
		canonical:
			"One page, one canonical — but it describes only the version Googlebot happened to see.",
		hreflang: "Impossible: the versions have no addresses of their own.",
		result: "Googlebot crawls mostly from US IP addresses and without an Accept-Language header, so it usually sees and indexes one version — typically the English one. The other languages do not exist for search.",
	},
] as const;

/** Canonicals and structured data — the two places a page states facts about itself. */
export function SignalsInDepth() {
	return (
		<>
			<GuideSection
				section={S.canonicals}
				sources={[
					SRC.canonical,
					SOURCES.canonicalTroubleshooting,
					SRC.canonicalRfc,
					SRC.redirects,
					SRC.hreflang,
					SOURCES.localeAdaptive,
					SRC.spamPolicies,
				]}
			>
				<Text>
					When the same content is reachable at several URLs — with and without a slash,
					http and https, with tracking parameters — Google groups them and picks one to
					show: the <b>canonical</b>. You can tell it which one, by signals of different
					strength, and they work best combined:
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Method</Table.Th>
							<Table.Th w={110}>Signal</Table.Th>
							<Table.Th>Use it</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{CANONICAL_METHODS.map(([method, strength, use]) => (
							<Table.Tr key={method}>
								<Table.Td fw={600}>{method}</Table.Td>
								<Table.Td>{strength}</Table.Td>
								<Table.Td>{use}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					Google also weighs its own signals — it prefers HTTPS over HTTP, and pages in a
					consistent hreflang set — so a canonical is a strong hint, not an order: even
					with one declared, Google may choose another address. With no signal at all it
					picks the version it thinks is best. Which address it chose is visible in URL
					Inspection, which shows the User-declared canonical beside the Google-selected
					canonical.
				</Text>
				<Code block>
					{`<!-- on https://example.com/blog/local-seo/?utm_source=newsletter -->
<link rel="canonical" href="https://example.com/blog/local-seo/">`}
				</Code>

				<Text fw={600}>Why a page with no duplicates still canonicals to itself</Text>
				<Text>
					A fair question: a canonical says “the main version is this one”, so why would a
					page with no copies point at itself? Because almost every page has copies — you
					simply did not make them. Google does not see “a page”, it sees URLs, and any
					differing URL with the same content is a duplicate candidate:
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						{HIDDEN_DUPLICATES.map(([source, how]) => (
							<Table.Tr key={source}>
								<Table.Td w={200} fw={600}>
									{source}
								</Table.Td>
								<Table.Td>{how}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text>
					A self-referencing canonical answers all of them in advance. The template emits
					the same tag on every variant of the address, so{" "}
					<Code>/blog/local-seo/?utm_source=newsletter</Code> says of itself “I am a copy
					of <Code>/blog/local-seo/</Code>”, and <Code>/blog/local-seo/</Code> confirms “I
					am the main one”. Google explicitly recommends putting such a canonical on the
					canonical page itself, and gives four reasons to declare a canonical at all:
					which URL to show in results, consolidating similar pages' signals (links to
					tagged variants count for the main one), keeping the statistics for one piece
					together, and not spending crawling on duplicates. It does not call it required:
					with no tag it will choose an address itself — usually the right one, but not
					always.
				</Text>
				<Text size="sm">
					<b>The main trap:</b> the canonical must hold the <i>clean</i> address, not the
					one the page was requested at. A template that puts the current URL into the
					canonical emits a tagged canonical on <Code>?utm_source=…</Code> — and the copy
					declares itself the original. Build the canonical from the entry's permanent
					address (the CMS's permalink or slug field), with no query parameters.
				</Text>
				<Code block>
					{`<!-- requested: https://example.com/blog/local-seo/?utm_source=newsletter -->

<!-- Good: built from the post's permalink -->
<link rel="canonical" href="https://example.com/blog/local-seo/">

<!-- Bad: built from the request URL, so every copy calls itself the original -->
<link rel="canonical" href="https://example.com/blog/local-seo/?utm_source=newsletter">`}
				</Code>

				<Text fw={600}>Canonicals and a page's language versions</Text>
				<Text>
					A translation is not a duplicate: the German version has different text, and
					Google keeps it as a page of its own. So each language version's canonical
					points at itself, and the link between versions is carried by hreflang, not by
					the canonical. The two tags answer different questions: the canonical is “which
					address is the main one among <i>copies of this page</i>”, hreflang is “where is{" "}
					<i>this same page in another language</i>”. Point the German version's canonical
					at the English one and Google reads it as “German is a copy of English”: the
					German page drops out of the index, and the hreflang set breaks with it. Google
					asks explicitly for a canonical URL in the same language (or the closest one
					where no same-language version exists), and when choosing a canonical it prefers
					URLs that are part of an hreflang set.
				</Text>
				<Code block>
					{`<!-- on https://example.com/de/blog/lokales-seo/ -->
<link rel="canonical" href="https://example.com/de/blog/lokales-seo/">          <!-- itself -->
<link rel="alternate" hreflang="en" href="https://example.com/blog/local-seo/">
<link rel="alternate" hreflang="de" href="https://example.com/de/blog/lokales-seo/">
<link rel="alternate" hreflang="x-default" href="https://example.com/blog/local-seo/">

<!-- Bad: the German page declares itself a copy of the English one -->
<link rel="canonical" href="https://example.com/blog/local-seo/">

<!-- Ignored: Google does not use rel="canonical" that carries hreflang, lang, media or type -->
<link rel="canonical" hreflang="de" href="https://example.com/de/blog/lokales-seo/">`}
				</Code>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Situation</Table.Th>
							<Table.Th>canonical</Table.Th>
							<Table.Th>hreflang</Table.Th>
							<Table.Th>What you get</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{LANGUAGE_CASES.map((row) => (
							<Table.Tr key={row.situation}>
								<Table.Td fw={600}>{row.situation}</Table.Td>
								<Table.Td>{row.canonical}</Table.Td>
								<Table.Td>{row.hreflang}</Table.Td>
								<Table.Td>{row.result}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					<b>One URL for several languages does not work for search.</b> Pages that change
					language by location, cookie or browser setting on a single address are what
					Google calls locale-adaptive. It crawls them mostly from addresses in the United
					States and without an <Code>Accept-Language</Code> header; some crawling does
					come from other countries' IPs, but there is no guarantee every version will be
					found and indexed. Google's recommendation is a separate URL per language
					version (a <Code>/de/</Code> subdirectory, a subdomain or a country domain) plus
					hreflang annotations. The language switcher is then ordinary{" "}
					<Code>&lt;a href&gt;</Code> links to those addresses, not a change of cookie.
					Sets, language codes and x-default in detail are in “Hreflang and international
					sites”.
				</Text>

				<DoAvoid
					good={[
						"An absolute https URL, in <head>, on every page — self-referencing on originals.",
						"A canonical built from the entry's permanent address, with no query parameters.",
						"Each language version canonical to itself, with hreflang carrying the link between them.",
						"The same canonical in the tag, the sitemap and internal links.",
					]}
					bad={[
						"robots.txt to pick a canonical — a blocked URL can still be indexed.",
						"noindex to pick a canonical within a site — it removes the page from search altogether.",
						"The URL removals tool for canonicalisation — it hides every version of the URL from search.",
						"Two different canonicals, a relative path, or a URL fragment.",
						"A canonical to a page that redirects or is noindex.",
						"A canonical built from the request URL, utm parameters and all.",
						"A translation's canonical pointing at a version in another language.",
						"One URL that changes language by IP or cookie.",
					]}
				/>
				<CheckedHere checks="No canonical (CANONICAL_MISSING), The canonical points at another page (CANONICAL_MISMATCH), The canonical points to HTTP (CANONICAL_TO_HTTP), Conflicting canonicals (CANONICAL_CONFLICT), A relative canonical (CANONICAL_RELATIVE), The canonical leads to a broken page (CANONICAL_TARGET_BROKEN), References to a development or staging host (DEVELOPMENT_HOST_REFERENCES); Lighthouse: The canonical is invalid or misdirected (LH_CANONICAL)." />
			</GuideSection>

			<StructuredDataSection />
		</>
	);
}

const SD_FACTS = [
	{
		topic: "Formats",
		fact: "JSON-LD, Microdata and RDFa. Google recommends JSON-LD, but implemented correctly all three are equivalent to it.",
	},
	{
		topic: "Properties",
		fact: "Without every required property a rich result is impossible; the recommended ones improve the chances. Complete, accurate markup beats lots of it.",
	},
	{
		topic: "What to mark up",
		fact: "Only what a visitor can see on the page, and on the page the markup describes. Misleading markup is ignored or treated as spam — up to a manual action.",
	},
	{
		topic: "Guarantees",
		fact: "None: even flawless markup only makes a page eligible for a rich result. The markup itself does not affect ranking.",
	},
	{
		topic: "Breadcrumbs",
		fact: "Since January 2025, on mobile Google shows only the domain in a result's visible URL, with no trail; on desktop the breadcrumbs remain. There is no need to remove BreadcrumbList markup.",
	},
	{
		topic: "HowTo",
		fact: "Not shown on desktop or mobile since September 2023.",
	},
	{
		topic: "FAQ",
		fact: "Since August 2023 shown only for well-known, authoritative government and health sites.",
	},
	{
		topic: "Sitelinks search box",
		fact: "Not shown since 21 November 2024. The markup can stay: it causes no errors. A WebSite with a name is still needed for the site name.",
	},
	{
		topic: "Other retired types",
		fact: "In June 2025 Google announced it would stop showing Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement and Vehicle Listing.",
	},
] as const;

const SD_PROBLEMS = [
	{
		symptom: "The Rich Results Test finds no markup although it is in the code",
		cause: "The type is not one of Google's features (check it in the Schema Markup Validator), or the script that inserts the markup did not run.",
	},
	{
		symptom: "The author is a plain string, or a Person with no url",
		cause: "The template prints the name as text. It needs a Person with a name and the URL of the author's page (or sameAs).",
	},
	{
		symptom: "Two BlogPosting entries on one page, with different headlines or dates",
		cause: "Both the theme and an SEO plugin emit markup. Keep one source; link shared entities with @id.",
	},
	{
		symptom: "Breadcrumbs disappeared from the mobile results",
		cause: "Not a fault: that has been the case for every site since January 2025. On desktop they remain.",
	},
] as const;

/** Structured data: what it is for, how to link entities, what Google no longer shows, how to test it. */
function StructuredDataSection() {
	return (
		<GuideSection
			section={S.structuredData}
			sources={[
				SRC.structuredDataIntro,
				SRC.structuredDataPolicies,
				SRC.articleMarkup,
				SRC.breadcrumbMarkup,
				SRC.siteNames,
				SOURCES.breadcrumbsMobile,
				SOURCES.howtoFaq,
				SOURCES.sitelinksSearchBox,
				SOURCES.simplifyingResults,
				SOURCES.richResultsTest,
				SOURCES.schemaValidator,
				SOURCES.jsonLd,
			]}
		>
			<Text>
				Structured data states facts about a page in a form machines read without guessing:
				this is an article, here is its author, published on this date, with this image, in
				this part of the site, on this organisation's site. The markup makes a page eligible
				for <b>rich results</b> — a date, an image, breadcrumbs on desktop — but guarantees
				none of them and does not lift positions by itself.
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{SD_FACTS.map((row) => (
						<Table.Tr key={row.topic}>
							<Table.Td w={170} fw={600}>
								{row.topic}
							</Table.Td>
							<Table.Td>{row.fact}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>A connected graph: @graph and @id</Text>
			<Text>
				A blog page usually describes several entities: the publishing organisation, the
				site, the author, the article itself and its place in the site's structure. It is
				convenient to collect them into one JSON-LD block — a <Code>@graph</Code> array —
				and give each entity a permanent identifier, <Code>@id</Code>: usually its page's
				URL with a fragment, such as <Code>https://example.com/#organization</Code>. Other
				nodes then refer to it with a short <Code>{'{"@id": "…"}'}</Code> instead of
				repeating every field. The author is described once, identically on every post,
				rather than as separate copies that drift apart over time. Yoast SEO and many other
				plugins emit markup this way.
			</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Organization</b> — the publisher: name, url, logo, sameAs (the company's
					profiles). BlogPosting refers to it in <Code>publisher</Code>.
				</List.Item>
				<List.Item>
					<b>WebSite</b> — the site: name and url. From the WebSite on the home page
					Google takes the site name for results.
				</List.Item>
				<List.Item>
					<b>Person</b> — the author: the name alone in name (no “By:” and no
					credentials), url the page that unambiguously describes the author, sameAs their
					profiles. Each author is a node of its own.
				</List.Item>
				<List.Item>
					<b>BlogPosting</b> (or Article) — headline, image, datePublished and
					dateModified with a time zone, author → Person, publisher → Organization.
				</List.Item>
			</List>
			<Code block>
				{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Example Agency",
      "url": "https://example.com/",
      "logo": "https://example.com/img/logo-512.png",
      "sameAs": ["https://www.linkedin.com/company/example-agency"]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "name": "Example Agency",
      "url": "https://example.com/",
      "publisher": { "@id": "https://example.com/#organization" }
    },
    {
      "@type": "Person",
      "@id": "https://example.com/authors/jane/#person",
      "name": "Jane Doe",
      "url": "https://example.com/authors/jane/",
      "sameAs": ["https://www.linkedin.com/in/janedoe"]
    },
    {
      "@type": "BlogPosting",
      "@id": "https://example.com/blog/local-seo/#article",
      "mainEntityOfPage": "https://example.com/blog/local-seo/",
      "headline": "Local SEO checklist",
      "image": ["https://example.com/img/local-seo-1200.jpg"],
      "datePublished": "2026-03-02T09:00:00-05:00",
      "dateModified": "2026-09-28T14:30:00-04:00",
      "author": { "@id": "https://example.com/authors/jane/#person" },
      "publisher": { "@id": "https://example.com/#organization" },
      "isPartOf": { "@id": "https://example.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Blog", "item": "https://example.com/blog/" },
        { "@type": "ListItem", "position": 2, "name": "Local SEO checklist" }
      ]
    }
  ]
}
</script>`}
			</Code>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>The Rich Results Test</b> — by URL or by code. It checks only the types
					Google has rich results for, shows errors and warnings, and sees markup inserted
					by JavaScript. A type Google does not show (HowTo, say) it simply will not find
					— that is not a fault in the markup.
				</List.Item>
				<List.Item>
					<b>The Schema Markup Validator</b> (validator.schema.org) — the syntax and the
					Schema.org vocabulary for any markup, regardless of Google's features. Useful
					for @graph, @id references and types the Rich Results Test does not cover.
				</List.Item>
				<List.Item>
					In Search Console, the rich result reports (for breadcrumbs, for instance) and
					URL Inspection for a single page: which items were found and with what errors.
					Check immediately after a template change: a theme edit can break the markup on
					every page.
				</List.Item>
			</List>

			<Text fw={600}>Common mistakes</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom</Table.Th>
						<Table.Th>The cause, and what to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SD_PROBLEMS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td>{row.symptom}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				The tracker expands <Code>@graph</Code> and follows <Code>@id</Code> references, so
				an author described as a separate Person node counts exactly like a nested one.
			</Text>
			<CheckedHere checks="Structured data that cannot be read (STRUCTURED_DATA_INVALID), No article structured data (STRUCTURED_DATA_MISSING), The article markup is missing recommended fields (STRUCTURED_DATA_INCOMPLETE), The author markup is incomplete (AUTHOR_MARKUP_INCOMPLETE), The article dates are not in the format Google asks for (ARTICLE_DATE_FORMAT_INVALID), The headline in the markup does not match the page (ARTICLE_HEADLINE_MISMATCH), The dates contradict each other (DATES_INCONSISTENT), No breadcrumb markup (BREADCRUMB_MISSING), The breadcrumb markup is missing required fields (BREADCRUMB_INVALID), No site name declared for Google (SITE_NAME_NOT_DECLARED, site)." />
		</GuideSection>
	);
}

const ROBOTS_STATUS = [
	["2xx", "The file is read as served."],
	["3xx", "Redirects are followed (at least five hops), then treated as 404."],
	["4xx (except 429)", "As if there were no robots.txt: everything may be crawled."],
	[
		"5xx, 429, network error",
		"For the first 12 hours Google does not crawl the site and keeps trying to fetch the file; for up to 30 days it uses the last good copy; after that, if the site is otherwise up, it acts as if there were no file.",
	],
] as const;

/** How a rule's path matches URLs, from Google's specification. */
const ROBOTS_MATCHING = [
	[
		"/fish",
		"/fish, /fish.html, /fish/salmon.html, /fishheads, /fish.php?id=anything",
		"/Fish.asp, /catfish, /?id=fish, /desert/fish",
	],
	["/fish*", "The same as /fish: a trailing asterisk changes nothing.", "The same as /fish."],
	[
		"/fish/",
		"/fish/, /fish/?id=anything, /fish/salmon.htm",
		"/fish, /fish.html, /Fish/Salmon.asp",
	],
	[
		"/*.php",
		"/index.php, /folder/filename.php?parameters, /folder/any.php.file.html, /filename.php/",
		"/, /windows.PHP",
	],
	[
		"/*.php$",
		"/filename.php, /folder/filename.php",
		"/filename.php?parameters, /filename.php/, /filename.php5, /windows.PHP",
	],
	["/fish*.php", "/fish.php, /fishheads/catfish.php?parameters", "/Fish.PHP"],
	["/", "The whole site.", "—"],
	["(empty)", "Nothing: a Disallow with no path forbids nothing.", "—"],
] as const;

/** Which rule wins when several match one URL, from Google's specification. */
const ROBOTS_PRECEDENCE = [
	["/page", "allow: /p\ndisallow: /", "allow — its path is longer."],
	[
		"/folder/page",
		"allow: /folder\ndisallow: /folder",
		"allow — the paths are the same length, so the less restrictive rule wins.",
	],
	["/page.php5", "allow: /page\ndisallow: /*.ph", "allow — the path is longer."],
	["/page.htm", "allow: /page\ndisallow: /*.htm", "disallow — the path is longer."],
	["/page.htm", "allow: /$\ndisallow: /", "disallow — allow: /$ permits the site root only."],
] as const;

const ROBOTS_AGENTS = [
	{
		token: "Googlebot",
		does: "Google Search on phones and desktops, Discover, and Images, Video and News.",
		note: "Block it and you disappear from Google.",
	},
	{
		token: "Googlebot-Image",
		does: "Google Images and every result that carries images, logos and favicons.",
		note: "Block it wholesale and you lose the favicon in the results too.",
	},
	{
		token: "Googlebot-Video, Googlebot-News",
		does: "The video features of Search; Google News.",
		note: "Needed separately only if you want different rules for those products.",
	},
	{
		token: "Storebot-Google",
		does: "Google Shopping.",
		note: "For online shops.",
	},
	{
		token: "Google-InspectionTool, GoogleOther",
		does: "The testing tools (URL Inspection, Rich Results Test); Google's internal tasks and research.",
		note: "No effect on Search.",
	},
	{
		token: "Google-Extended",
		does: "Not a crawler but a switch: whether the content may be used to train the Gemini models and for grounding.",
		note: "Google states plainly that it affects neither appearing in Search nor ranking. The requests come from Google's ordinary bots.",
	},
	{
		token: "AdsBot-Google",
		does: "Quality checks of the pages Google Ads leads to.",
		note: "It ignores User-agent: * — rules reach it only if it is named.",
	},
	{
		token: "Bingbot",
		does: "Bing and the engines that run on its index.",
		note: "A group of its own is needed only if the rules for Bing differ.",
	},
	{
		token: "Yandex",
		does: "Yandex's robots.",
		note: "It also understands Clean-param (below).",
	},
	{
		token: "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot…",
		does: "AI crawlers: some collect data for training, others for answers with search.",
		note: "Which of them can be blocked without losing visibility is in “AI search”.",
	},
] as const;

const ROBOTS_MISTAKES = [
	{
		mistake: "A Disallow: / travelled from staging to production",
		effect: "Crawling of the whole site stops; pages gradually lose their descriptions and drop out.",
		fix: "Protect staging with a password, and check production's robots.txt after every release.",
	},
	{
		mistake: "/wp-content/, /assets/, /static/, /_next/ are blocked",
		effect: "Google cannot fetch the CSS and JS and renders a broken page.",
		fix: "Scripts and styles stay open, always.",
	},
	{
		mistake: "Disallow: /blog instead of /blog/",
		effect: "It also blocks /blog-news/ and /blogging-tips.html — everything beginning with those characters.",
		fix: "A trailing slash when you mean a folder; a $ when you mean an exact address.",
	},
	{
		mistake: "A Disallow and a noindex on the same URL",
		effect: "The noindex is never read; the URL can stay in the index with no description.",
		fix: "First the noindex with crawling open, then — once the page has dropped out — a Disallow if you want one.",
	},
	{
		mistake: "robots.txt as security: Disallow: /secret-admin/",
		effect: "The file is public: you are publishing a list of what you wanted to hide.",
		fix: "Private sections belong behind authentication.",
	},
	{
		mistake: "A Googlebot group with none of the general rules",
		effect: "Googlebot reads only its own group and ignores everything under *.",
		fix: "Repeat the general rules you need inside its group.",
	},
	{
		mistake: "/robots.txt serves HTML (an SPA, or an error page with a 200)",
		effect: "Lines that are not rules are ignored — so in effect there are no restrictions.",
		fix: "Serve a real text/plain file, or a 404 if there are no rules.",
	},
	{
		mistake: "Forgotten hosts",
		effect: "www, a subdomain, a CDN host and http each have their own robots.txt — or none.",
		fix: "Check /robots.txt on every host that answers 200.",
	},
] as const;

/** robots.txt as Google reads it: syntax, matching, precedence, crawlers, recipes, Yandex, mistakes, testing. */
export function RobotsTxtInDepth() {
	return (
		<GuideSection
			section={S.robotsTxt}
			sources={[
				SRC.robotsSpec,
				SRC.robotsIntro,
				SOURCES.createRobots,
				SRC.robotsRfc,
				SOURCES.commonCrawlers,
				SRC.googleCrawlers,
				SOURCES.robotsReport,
				SOURCES.robotsLibrary,
				SOURCES.yandexRobots,
				SOURCES.yandexCleanParam,
			]}
		>
			<Text>
				robots.txt is a text file at the root of a host where you tell crawlers which URLs
				they <i>may fetch</i>. It is a tool for managing crawling — not indexing, and not
				security: it does not take pages out of search (noindex does that) and it hides
				nothing from people (the file is public, and anyone can read it). Its real job is to
				keep bots out of the places where crawling is wasted: site search, the cart, endless
				combinations of filters and sorts, utility sections. For a small blog the right
				robots.txt is often two lines — or a single Sitemap line.
			</Text>
			<Code block>
				{`User-agent: *
Disallow: /cart/
Disallow: /search
Allow: /search/help
Disallow: /*?sessionid=

User-agent: Googlebot
Disallow: /cart/
Disallow: /beta/

Sitemap: https://example.com/sitemap.xml`}
			</Code>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Where:</b> at the root, <Code>/robots.txt</Code>, and only for that exact
					host, scheme and port — <Code>blog.example.com</Code> and <Code>http://</Code>{" "}
					need their own. Up to 500 KiB is read; UTF-8 plain text. Google caches it for up
					to 24 hours.
				</List.Item>
				<List.Item>
					<b>Which group:</b> a crawler obeys exactly one group — the most specific one
					naming it (case does not matter), else <Code>*</Code>. Groups are not combined
					with <Code>*</Code>: in the example, Googlebot ignores everything under{" "}
					<Code>*</Code>, which is why its group repeats <Code>/cart/</Code>. Several{" "}
					<Code>User-agent</Code> lines in a row make one group for several bots, and
					several groups for the same bot are merged into one. The order of the groups
					does not matter; text after a name is ignored (<Code>googlebot/1.2</Code> is the
					same as <Code>googlebot</Code>).
				</List.Item>
				<List.Item>
					<b>Syntax:</b> one directive per line, <Code>field: value</Code>; everything
					after a <Code>#</Code> is a comment; blank and unrecognised lines (a BOM at the
					start of the file included) are skipped. Field names are case-insensitive, paths
					are not. <Code>Disallow:</Code> with no path forbids nothing;{" "}
					<Code>Disallow: /</Code> forbids everything. A <Code>Sitemap:</Code> line
					belongs to no group and can sit anywhere. Non-Latin characters in paths may be
					written as they are or percent-encoded — Google compares them in their
					percent-encoded form, so <Code>/блог/</Code> and{" "}
					<Code>/%D0%B1%D0%BB%D0%BE%D0%B3/</Code> are the same.
				</List.Item>
				<List.Item>
					<b>Which rule:</b> the longest matching path wins; on a tie, Allow wins. Paths
					are case-sensitive and start with <Code>/</Code>. <Code>*</Code> matches
					anything, <Code>$</Code> anchors the end: <Code>Disallow: /*.pdf$</Code>.
				</List.Item>
				<List.Item>
					<b>Supported fields:</b> user-agent, allow, disallow, sitemap. Google ignores
					crawl-delay, noindex, host and anything else.
				</List.Item>
				<List.Item>
					<b>What it does not do:</b> keep a page out of the index — a blocked URL can
					still appear, known from links, without a description. Use noindex (and keep the
					page crawlable) for that.
				</List.Item>
			</List>
			<Text fw={600}>When robots.txt answers with an error</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{ROBOTS_STATUS.map(([status, means]) => (
						<Table.Tr key={status}>
							<Table.Td w={190} fw={600}>
								{status}
							</Table.Td>
							<Table.Td>{means}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How a rule's path is matched against a URL</Text>
			<Text size="sm">
				A rule's path is compared with the start of the URL's path (query string included),
				case-sensitively.
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={110}>Path</Table.Th>
						<Table.Th>Matches</Table.Th>
						<Table.Th>Does not match</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_MATCHING.map(([path, matches, misses]) => (
						<Table.Tr key={path}>
							<Table.Td>
								<Code>{path}</Code>
							</Table.Td>
							<Table.Td>{matches}</Table.Td>
							<Table.Td>{misses}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Which rule wins</Text>
			<Text size="sm">
				The order of the lines within a group does not matter. Of all the rules that match,
				the one with the longer path wins; on equal length, the less restrictive one — that
				is, Allow.
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={120}>URL</Table.Th>
						<Table.Th w={190}>Rules</Table.Th>
						<Table.Th>Outcome</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_PRECEDENCE.map(([url, rules, wins]) => (
						<Table.Tr key={`${url} ${rules}`}>
							<Table.Td>
								<Code>{url}</Code>
							</Table.Td>
							<Table.Td>
								<Code block>{rules}</Code>
							</Table.Td>
							<Table.Td>{wins}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Who to address the rules to</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={200}>User-agent</Table.Th>
						<Table.Th>What it is</Table.Th>
						<Table.Th>What to know</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_AGENTS.map((row) => (
						<Table.Tr key={row.token}>
							<Table.Td>
								<Code>{row.token}</Code>
							</Table.Td>
							<Table.Td>{row.does}</Table.Td>
							<Table.Td>{row.note}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Recipes</Text>
			<Code block>
				{`# 1. A WordPress blog: keep admin and internal search out, keep everything else open
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /?s=
Disallow: /search/

Sitemap: https://example.com/wp-sitemap.xml

# 2. Parameters that only sort or track: one rule catches them anywhere in the query
User-agent: *
Disallow: /*?*sort=
Disallow: /*?*sessionid=

# 3. Stay in Google Search, opt out of Gemini training and grounding
User-agent: Google-Extended
Disallow: /

# 4. One image out of Google Images
User-agent: Googlebot-Image
Disallow: /images/team-party.jpg

# 5. Everything closed except one crawler (e.g. an intranet search)
User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /`}
			</Code>
			<Text size="sm">
				Note that <Code>Disallow: /*.pdf$</Code> stops PDFs being crawled, but files Google
				already knows can stay in the results without a description. Taking them out of
				search needs <Code>X-Robots-Tag: noindex</Code> with crawling left open.
			</Text>

			<Text fw={600}>Yandex specifics</Text>
			<Code block>
				{`User-agent: Yandex
Disallow: /cart/
Clean-param: utm_source&utm_medium&utm_campaign
Clean-param: sort&view /catalog/`}
			</Code>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Clean-param</b> is a Yandex-only directive: the parameters it lists do not
					change the content, so Yandex folds such URLs into the address without them
					rather than crawling every variant. The second field is an optional path prefix.
					The directive is cross-section and can appear anywhere in the file; one rule is
					at most 500 characters. Google ignores it — there, canonicals and Disallow do
					the same jobs.
				</List.Item>
				<List.Item>
					<b>Crawl-delay and Host</b> are not among the directives Yandex's current help
					lists as supported (it names User-agent, Disallow, Allow, Sitemap and
					Clean-param). Crawl rate is set in Yandex Webmaster, and a site's main mirror is
					decided by a 301. Google ignores both directives too.
				</List.Item>
				<List.Item>
					Where a <Code>User-agent: Yandex</Code> group exists, Yandex, like Google,
					ignores the <Code>*</Code> group. A file over 500 KB, or any answer other than
					200 OK, Yandex treats as permission to crawl everything.
				</List.Item>
			</List>

			<Text fw={600}>Common mistakes</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Mistake</Table.Th>
						<Table.Th>What happens</Table.Th>
						<Table.Th>How it should be</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_MISTAKES.map((row) => (
						<Table.Tr key={row.mistake}>
							<Table.Td>{row.mistake}</Table.Td>
							<Table.Td>{row.effect}</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How to check it yourself</Text>
			<Code block>
				{`# 200, text/plain, no redirect to an HTML page
curl -sI https://example.com/robots.txt
curl -s https://example.com/robots.txt

# every host that answers has its own file
for h in example.com www.example.com blog.example.com; do
  echo "$h: $(curl -s -o /dev/null -w '%{http_code}' https://$h/robots.txt)"
done`}
			</Code>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Search Console → Settings → <b>the robots.txt report</b>: which files Google
					found for the site's 20 main hosts, when it last checked them, the status
					(Fetched, Not fetched — not found (404), Not fetched — other reason), and the
					parse warnings and errors. From there you can also ask for an urgent refetch
					after a fix.
				</List.Item>
				<List.Item>
					<b>URL Inspection</b> answers whether one particular address is blocked: the
					“Crawl allowed?” line.
				</List.Item>
				<List.Item>
					To test rules before a release, use Google's open-source{" "}
					<Code>google/robotstxt</Code> library: the same parsing as Googlebot's, locally,
					for any URL and user agent.
				</List.Item>
				<List.Item>For Yandex, Yandex Webmaster → Tools → robots.txt analysis.</List.Item>
			</List>

			<CheckedHere checks="robots.txt blocks Googlebot (ROBOTS_BLOCKS_GOOGLEBOT), robots.txt blocks scripts or styles (ROBOTS_BLOCKS_RESOURCES), robots.txt blocks the AI search crawlers (ROBOTS_BLOCKS_AI_SEARCH), robots.txt is past 500 KiB (ROBOTS_TXT_TRUNCATED), robots.txt rules Google does not support (ROBOTS_TXT_UNSUPPORTED_RULES), Googlebot's group drops the general rules (ROBOTS_GOOGLEBOT_GROUP_DROPS_RULES); Lighthouse: robots.txt is invalid or unreachable (LH_ROBOTS_TXT). A robots.txt answering a server error or a 429 stops this tracker's crawl, as it stops Google's." />
		</GuideSection>
	);
}
