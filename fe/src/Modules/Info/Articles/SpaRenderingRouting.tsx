import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import type { ReactNode } from "react";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** First-party pages these chapters cite beyond the shared list; each was opened against its sentence on 2026-10-12. */
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
	renderingOnTheWeb: {
		title: "web.dev: Rendering on the Web",
		url: "https://web.dev/articles/rendering-on-the-web",
	},
	aiCrawlers: {
		title: "Vercel: The rise of the AI crawler",
		url: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
	},
	bingGuidelines: {
		title: "Bing Webmaster Guidelines",
		url: "https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a",
	},
	ajaxCrawlingEnd: {
		title: "Google Search Central Blog: Rendering AJAX-crawling pages",
		url: "https://developers.google.com/search/blog/2017/12/rendering-ajax-crawling-pages",
	},
	pagination: {
		title: "Google Search Central: Pagination, incremental page loading, and their impact on Google Search",
		url: "https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading",
	},
	structuredDataJs: {
		title: "Google Search Central: Generate structured data with JavaScript",
		url: "https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript",
	},
} satisfies Record<string, ISeoIssueSource>;

/** Where the tracker meets the subject, so each chapter ends on what to open next. */
function TrackerNote({ children }: { children: ReactNode }) {
	return (
		<Text size="sm" c="dimmed">
			<b>How this relates to the tracker.</b> {children}
		</Text>
	);
}

const WHO_RUNS_JS = [
	{
		who: "Googlebot",
		runs: "Yes",
		note: "It renders in the WRS — an evergreen Chromium — but in a queue of its own, after crawling. Gemini, by Vercel's measurements, uses the same infrastructure.",
	},
	{
		who: "Bingbot",
		runs: "Mostly yes",
		note: "Bing's webmaster guidelines say it generally processes JavaScript, but with limits at scale, and advise large sites not to rely on it — to serve Bingbot pre-rendered HTML instead.",
	},
	{
		who: "Link previews: Facebook, LinkedIn, X, Telegram, Slack and others",
		runs: "As a rule, no",
		note: "They build the card from the server's HTML response — the Open Graph and Twitter Card tags. Tags a script appends do not exist for them.",
	},
	{
		who: "AI assistants' crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot",
		runs: "On the evidence, no",
		note: "Vercel's measurement (December 2024) found no JavaScript execution in them: a CSR page is empty to them. The exceptions in the same measurement were Gemini and AppleBot. Bots change, so plan for the worst case.",
	},
	{
		who: "The tracker's crawler",
		runs: "No",
		note: "It reads the server's response only — it sees the site as social networks and AI crawlers do.",
	},
] as const;

const STRATEGIES = [
	{
		name: "CSR — client-side rendering",
		html: 'A shell: an empty <div id="root">, the bundles, and one title for every address.',
		plus: "None for SEO. Cheap static hosting and a simple architecture.",
		cost: "Content arrives only after the JS has loaded and run and the API has answered: a late LCP on weak phones; the bundle grows with the app and hurts INP. To social networks and AI crawlers the page is empty; status codes and metadata live on the client.",
		when: "Sections behind a login — accounts, dashboards — that do not need search.",
	},
	{
		name: "SSR — server-side rendering",
		html: "The page's full HTML, built for every request.",
		plus: "Text, links, metadata and the right status code in the first response, for every crawler. A fast FCP.",
		cost: "The server works on every request — a higher TTFB, needing a cache or a CDN. Hydration still follows the SSR. It needs a server running Node or an equivalent.",
		when: "Content that changes often or is personalised, large catalogues, pages that cannot be built ahead of time.",
	},
	{
		name: "SSG — static generation",
		html: "Full HTML built at build time: one file per URL.",
		plus: "Everything in the HTML; a steadily fast TTFB behind a CDN; a path that does not exist is easy to answer with a real 404.",
		cost: "A content change needs a rebuild; at hundreds of thousands of URLs the build is long; until the rebuild the data is stale.",
		when: "Blogs, documentation, landing pages — content that changes less often than it is read.",
	},
	{
		name: "ISR — incremental regeneration",
		html: "Full HTML as with SSG; the page is rebuilt on the server in the background, on a timer or an event, with no rebuild of the site.",
		plus: "SSG's SEO plus freshness; new URLs are generated on first request.",
		cost: "A stale version is served for a while; it needs a platform that supports it (the term is Next.js's; other frameworks have equivalents); the first request to an address that does not exist must give a 404, not a cached empty page.",
		when: "Large catalogues and media: SSR is expensive and a full rebuild cannot keep up.",
	},
	{
		name: "Streaming SSR",
		html: "HTML in chunks within one response: the <head> and the frame first, then blocks as their data arrives.",
		plus: "A fast TTFB and FCP with slow data; the content is still in the server's response.",
		cost: "The status code and headers go out with the first chunk: whether this is a 404 or a redirect has to be decided before the stream starts. Late blocks arrive at the end of the document and are moved into place by an inline script (that is how React does it). The metadata has to be in the first chunk's <head>.",
		when: "SSR pages with slow data sources.",
	},
	{
		name: "Prerendering",
		html: "Full HTML of the initial state: the CSR app is run at build time and the result saved per route.",
		plus: "An existing SPA gets HTML with content in it without a rewrite; hosting stays static.",
		cost: "Only the routes known at build time; the data is stale until the next build; interactivity needs more JavaScript than progressive enhancement would.",
		when: "A small CSR app with a finite list of public pages.",
	},
	{
		name: "Dynamic rendering",
		html: "Pre-rendered HTML for the bot (by user agent), the CSR shell for a person.",
		plus: "Quick to bolt onto an existing CSR app. Google does not count it as cloaking as long as the content matches.",
		cost: "Google calls it a workaround and does not recommend it. Two versions of the site that drift apart; a new bot with an unknown user agent gets nothing; separate rendering infrastructure.",
		when: "Only as a stopgap — while moving to SSR or SSG.",
	},
	{
		name: "Hydration",
		html: "The full HTML from SSR or SSG — this is a second step, not a strategy of its own.",
		plus: "The crawler gets HTML, the person gets SPA navigation with no reloads.",
		cost: "“One app at the price of two”: the HTML, the data and the bundle. Until the page is hydrated, clicks do nothing — a risk for INP. A mismatch between the server's and the client's HTML can repaint the page.",
		when: "The default in Next.js, Nuxt, SvelteKit, React Router and other meta-frameworks.",
	},
	{
		name: "Partial hydration and islands",
		html: "Fully static HTML; only the interactive “islands” hydrate — a form, a widget, a menu.",
		plus: "All the content in the HTML and the least JavaScript — better for INP.",
		cost: "An architecture of its own (Astro, for instance); shared state between islands is harder.",
		when: "Content sites — blogs, documentation, marketing — with a little interactivity.",
	},
	{
		name: "React Server Components",
		html: "With SSR or SSG, full HTML; the server components' code never reaches the bundle and only the client ones hydrate.",
		plus: "Content in the HTML and less JavaScript in the browser.",
		cost: "A new model: a strict split between server and client components, and harder caching; not every framework supports it.",
		when: "New React projects on the Next.js App Router and its equivalents.",
	},
] as const;

/** What reaches a crawler from a single-page app, who runs its JavaScript, and which rendering to choose. */
export function SpaHowSeenSection() {
	return (
		<GuideSection
			section={S.spaHowSeen}
			sources={[
				SRC.javascriptSeo,
				SOURCES.dynamicRendering,
				SOURCES.renderingOnTheWeb,
				SOURCES.aiCrawlers,
				SOURCES.bingGuidelines,
				SRC.openGraph,
			]}
		>
			<Text>
				In a single-page application with client-side rendering (CSR), the server answers
				every address with the same <Code>index.html</Code>: an empty{" "}
				<Code>&lt;div id="root"&gt;</Code> container, links to the bundles, and one{" "}
				<Code>&lt;title&gt;</Code> for the whole site. The page's text, links and metadata
				appear only once the browser has downloaded and run the JavaScript and received the
				data from the API. Anything that does not run scripts sees an empty page.
			</Text>
			<Text>
				Google goes through the three phases described in “Rendering and JavaScript”:
				crawling the source HTML, the render queue in the WRS (an evergreen — that is,
				regularly updated — Chromium), and indexing the rendered DOM. For an SPA, three
				things follow. <b>First:</b> from the source HTML Google gets only the shell — even
				the links to other routes it will find only after rendering. A page can spend
				seconds in the queue, Google says, and sometimes longer, so a new post reaches the
				index later than it would on a server-rendered site. <b>Second:</b> rendering can
				fail — a script threw, the API did not answer, the bundle is blocked in robots.txt —
				and then emptiness is indexed, or the page is not indexed at all. <b>Third:</b> on
				meeting a noindex in the source HTML, Google may skip rendering, so a noindex cannot
				be removed by a script (more in “SPA: metadata, markup and content”).
			</Text>

			<Text fw={600}>Who runs JavaScript</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={210}>Who</Table.Th>
						<Table.Th w={130}>Runs JS</Table.Th>
						<Table.Th>What to know</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{WHO_RUNS_JS.map((row) => (
						<Table.Tr key={row.who}>
							<Table.Td fw={600}>{row.who}</Table.Td>
							<Table.Td>{row.runs}</Table.Td>
							<Table.Td>{row.note}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				The conclusion: even where Google copes with CSR, a post served as an empty shell
				gets no card on social networks and is not cited by AI assistants. Google's
				“JavaScript SEO basics” gives the same reason for its advice to render on the
				server: not every bot can run JavaScript.
			</Text>

			<Text fw={600}>Rendering strategies</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={150}>Strategy</Table.Th>
						<Table.Th>What is in the first HTML</Table.Th>
						<Table.Th>What it gives SEO</Table.Th>
						<Table.Th>The price</Table.Th>
						<Table.Th>When to choose it</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{STRATEGIES.map((row) => (
						<Table.Tr key={row.name}>
							<Table.Td fw={600}>{row.name}</Table.Td>
							<Table.Td>{row.html}</Table.Td>
							<Table.Td>{row.plus}</Table.Td>
							<Table.Td>{row.cost}</Table.Td>
							<Table.Td>{row.when}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text>
				<b>Google's recommendation</b> is server-side rendering, static generation or
				hydration (server HTML brought to life by a client script), rather than hoping the
				search engine will render the page itself; dynamic rendering it calls a workaround
				outright. web.dev advises measuring the bottlenecks first and checking whether SSG
				or SSR already covers most of the problem. For the kind of blog a client is tracked
				for here, the answer is almost always SSG or ISR for the posts and CSR for the
				private sections only.
			</Text>

			<Text fw={600}>Example: one page under CSR and under SSR</Text>
			<Code block>
				{`<!-- CSR: curl https://example.com/blog/local-seo/ -->
<!doctype html>
<html lang="en">
<head>
  <title>Example</title>                        <!-- the same on every route -->
  <script type="module" src="/assets/index-4f9a1c.js"></script>
</head>
<body>
  <div id="root"></div>                          <!-- no text, no links -->
  <noscript>You need to enable JavaScript to run this app.</noscript>
</body>
</html>

<!-- SSR / SSG: the same URL -->
<!doctype html>
<html lang="en">
<head>
  <title>Local SEO checklist: 12 steps | Example</title>
  <meta name="description" content="Twelve steps to rank in the local pack.">
  <link rel="canonical" href="https://example.com/blog/local-seo/">
  <meta property="og:title" content="Local SEO checklist: 12 steps">
  <meta property="og:image" content="https://example.com/og/local-seo.png">
  <script type="module" src="/assets/index-4f9a1c.js"></script>
</head>
<body>
  <div id="root">
    <article>
      <h1>Local SEO checklist: 12 steps</h1>
      <p>Twelve steps…</p>
      <a href="/blog/google-business-profile/">Google Business Profile guide</a>
    </article>
  </div>
</body>
</html>`}
			</Code>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					See what the server sends and compare it with what a person sees: the word count
					in the server's response against the rendered page. Tens in the first and
					hundreds in the second means JavaScript is writing the text.
					<Code block>
						{`# Words in the server's HTML (scripts and styles stripped)
curl -s https://example.com/blog/local-seo/ \\
  | sed -E 's/<script[^>]*>.*<\\/script>//g; s/<style[^>]*>.*<\\/style>//g; s/<[^>]+>/ /g' \\
  | wc -w

# Words after rendering: paste into the DevTools console on the same page
document.body.innerText.split(/\\s+/).filter(Boolean).length`}
					</Code>
				</List.Item>
				<List.Item>
					Look in the server's response for an empty root element and the framework's
					fingerprints: <Code>{'<div id="root"></div>'}</Code>,{" "}
					<Code>{'<div id="app"></div>'}</Code>, <Code>__next</Code>, <Code>__nuxt</Code>,{" "}
					<Code>app-root</Code>. An empty container means CSR; a filled one means SSR, SSG
					or prerendering.
				</List.Item>
				<List.Item>
					Open the page in URL Inspection and, in the live test, compare the rendered HTML
					and the screenshot with the server's response — the steps are set out in
					“Rendering and JavaScript”. For an SPA it matters that you test the deep routes
					rather than the home page: a post, a category, the second page of a listing.
				</List.Item>
				<List.Item>
					Check what social networks see: paste the link into Facebook's Sharing Debugger
					or LinkedIn's Post Inspector. An empty card for a post that is complete in the
					browser means the metadata comes from JavaScript.
				</List.Item>
			</List>

			<Text fw={600}>Common mistakes</Text>
			<DoAvoid
				good={[
					"SSG, ISR or SSR for every public page: text, links and metadata in the server's response.",
					"The page's data fetched on the server (in the route's loader), not after the component mounts.",
					"The same HTML for people and bots; only the speed of delivery differs.",
					"Testing the deep routes, not just the home page, after every release.",
				]}
				bad={[
					"“SSR is on”, but the data loads in useEffect or onMounted: the server sends a frame with a spinner, not text.",
					"SSR for the home page only, with posts and categories left on CSR.",
					"A separate version for bots by user agent as a permanent solution: it drifts from the site, and a new bot gets nothing.",
					"A prerendered build made once: new posts stay a shell until the next build.",
				]}
			/>

			<TrackerNote>
				The tracker's crawler does not run JavaScript: it sees what social previews and AI
				assistants' crawlers see. A post that arrives as an empty shell (an empty framework
				container — <Code>#root</Code>, <Code>#app</Code>, <Code>#__next</Code>,{" "}
				<Code>#__nuxt</Code>, <Code>#___gatsby</Code>, <Code>app-root</Code> — or a{" "}
				<Code>&lt;noscript&gt;</Code> asking for JavaScript with almost no other text) is
				not analysed: the crawl log says why it was skipped, and the site check “Posts need
				JavaScript to show their text” (<Code>CONTENT_NEEDS_JAVASCRIPT</Code>) lists such
				posts. The per-page checks and the Lighthouse audits do not run for them — the text
				has to reach the HTML first.
			</TrackerNote>
		</GuideSection>
	);
}

const ROUTING_RULES = [
	{
		topic: "A URL per state",
		spa: "The router changes the screen with no reload; if the address does not change with it, the state has no URL and will never be indexed.",
		right: "Every state that should be findable gets a path of its own through the History API (pushState): /blog/local-seo/, not a screen inside /.",
	},
	{
		topic: "Hash routes #/page",
		spa: "Google discards everything after the #: /#/pricing and /#/blog are one URL to it, the home page. The documentation asks explicitly that different content not be loaded per fragment.",
		right: "The History API. Fragments are for anchors within a page only.",
	},
	{
		topic: "The #! scheme (AJAX crawling)",
		spa: "Google deprecated the _escaped_fragment_ scheme in 2015 and stopped using it in the second quarter of 2018: since then it renders old #! addresses itself, and has promised to keep supporting them in results.",
		right: "New sites are not built this way; move old ones to ordinary paths. The fragment is invisible to the server, so a script has to do the redirect.",
	},
	{
		topic: "Landing straight on a route",
		spa: "A person and Googlebot arrive at /blog/local-seo/ directly, not through the home page. A server that only knows / answers 404, or redirects to the home page.",
		right: "The server answers every existing route with a 200 and the content (SSR/SSG), or at the very least the app shell.",
	},
	{
		topic: "The index.html fallback",
		spa: "A rule of “any path serves index.html” answers 200 for addresses that do not exist too: every typo is a soft 404, and Google sees an endless URL space.",
		right: "A real 404 for unknown paths — one of the three ways below.",
	},
	{
		topic: "Redirects",
		spa: "router.push or navigate change the address with no request to the server — for search that is no redirect: the original URL renders with the target's content and becomes its duplicate.",
		right: "A server-side 301/308; under SSR, the framework's own redirect. With no server, window.location: Google sees it while rendering, but later and less reliably.",
	},
	{
		topic: "Links",
		spa: "Navigation by onClick on a div, a button or an <a> with no href works with a mouse, but Google finds links only in <a href>.",
		right: 'The router\'s link component renders a real <a href="/path"> and intercepts the click.',
	},
	{
		topic: "Filters, sorting, search",
		spa: "The state lives only in the store: on reload or from a link the filter is gone, and a filtered listing has no address.",
		right: "State that should be findable or shareable goes in query parameters (?category=seo), and the app restores it from the URL. Which combinations to index is in “Duplicates, parameters, pagination and facets”.",
	},
	{
		topic: "Pagination and infinite feeds",
		spa: "The feed loads posts on scroll and writes ?page=3 into the address bar, but arriving at ?page=3 directly shows the first page.",
		right: "?page=N serves its own posts on a direct visit (SSR/SSG reads the parameter), the pages are joined by <a href> links, and pushState updates the address as more loads.",
	},
	{
		topic: "Canonical and hreflang",
		spa: "index.html carries one canonical — often to the home page — for every route; the same hreflang set appears on every page.",
		right: "Every route gets its own self-canonical and its own hreflang set, in the server's HTML.",
	},
] as const;

/** Routes, URLs, status codes and links in an app whose router lives in the browser. */
export function SpaRoutingSection() {
	return (
		<GuideSection
			section={S.spaRouting}
			sources={[
				SRC.javascriptSeo,
				SOURCES.fixJavascript,
				SRC.crawlableLinks,
				SOURCES.ajaxCrawlingEnd,
				SRC.redirects,
				SRC.httpStatusCodes,
				SOURCES.pagination,
			]}
		>
			<Text>
				On an ordinary site a URL is a file or a route on the server, and the server answers
				200, 301 or 404 itself. In an SPA the router runs in the browser: the server knows
				nothing about the routes and answers every path with one shell and a 200, while
				“redirect” and “not found” are just other screens. To a person there is no
				difference. To Google, which judges by the status code and the address (see “Status
				codes and redirects in detail”), these are duplicates, soft 404s and redirects that
				do not exist.
			</Text>

			<Text fw={600}>The rules for routes</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={150}>What</Table.Th>
						<Table.Th>How it breaks in an SPA</Table.Th>
						<Table.Th>How it should be</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROUTING_RULES.map((row) => (
						<Table.Tr key={row.topic}>
							<Table.Td fw={600}>{row.topic}</Table.Td>
							<Table.Td>{row.spa}</Table.Td>
							<Table.Td>{row.right}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How to answer 404 in an SPA</Text>
			<Text size="sm">
				Google's “JavaScript SEO basics” admits that with client-side routing a meaningful
				status code is sometimes impossible, and offers two workarounds. With the proper
				solution that makes three, best first:
			</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>The server knows the routes and answers a real 404.</b> SSG: only existing
					pages have files, everything else is a 404. SSR: the route's loader did not find
					the post, so the framework answers 404 (<Code>notFound()</Code> in Next.js, say;
					the recipes are in “SPA: testing and framework recipes”).
				</List.Item>
				<List.Item>
					<b>A JS redirect to a URL the server answers with 404</b> (
					<Code>/not-found</Code>, for instance). It has to be a full navigation —{" "}
					<Code>window.location</Code>: a router transition (<Code>navigate</Code>,{" "}
					<Code>router.push</Code>) makes no request to the server, so nobody ever
					receives the 404.
				</List.Item>
				<List.Item>
					<b>
						Add <Code>{'<meta name="robots" content="noindex">'}</Code> with a script
					</b>{" "}
					on the error screen. This works because the source shell has no noindex, so
					Google renders the page; the reverse — removing a noindex with a script — does
					not.
				</List.Item>
			</List>
			<Code block>
				{`# nginx. Bad: every path, real or not, answers 200 with the app shell
location / {
    try_files $uri /index.html;
}

# Good for SSG or a prerendered build: one HTML file per route, the rest is a real 404
location / {
    try_files $uri $uri/index.html =404;
}
error_page 404 /404.html;

# A pure CSR app that cannot list its routes: keep the fallback for real routes,
# and make /not-found answer 404 while still serving the app shell
location / {
    try_files $uri /index.html;
}
location = /not-found {
    error_page 404 /index.html;   # the shell, served with status 404
    return 404;
}`}
			</Code>
			<Code block>
				{`// Google's two client-side options, for a post the API says does not exist
const response = await fetch(\`/api/posts/\${slug}\`);
if (response.status === 404) {
  // Option A: a real navigation to a URL the server answers with 404
  window.location.replace("/not-found");     // NOT router.navigate("/not-found")

  // Option B: stay on the URL, show the error screen, and keep it out of the index
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex";
  document.head.appendChild(robots);
}`}
			</Code>

			<Text fw={600}>Redirects</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>A server-side 301 or 308</b> is the only redirect that Google, Bing, social
					networks and AI crawlers all see alike. After a change of routing scheme,
					redirect the old addresses on the server or the CDN, not in the router.
				</List.Item>
				<List.Item>
					<b>
						<Code>window.location</Code>
					</b>{" "}
					Google understands, but only after rendering: later and less reliably, and
					anything that does not run JavaScript stays on the old address. A fallback for
					when there is no server.
				</List.Item>
				<List.Item>
					<b>
						<Code>router.push</Code>, <Code>navigate</Code>,{" "}
						<Code>history.replaceState</Code>
					</b>{" "}
					are not redirects as far as search is concerned. How Google handles such an
					address change is not documented; assume the old URL stays in the index with the
					new one's content — as its duplicate.
				</List.Item>
			</List>

			<Text fw={600}>Links: good and bad</Text>
			<Code block>
				{`// Bad: Googlebot finds nothing to follow
<div onClick={() => navigate("/blog/local-seo/")}>Local SEO</div>
<button onClick={() => navigate("/blog/local-seo/")}>Local SEO</button>
<a onClick={() => navigate("/blog/local-seo/")}>Local SEO</a>       // <a> without href
<a href="javascript:void(0)" onClick={open}>Local SEO</a>
<a href="#/blog/local-seo">Local SEO</a>                             // fragment route

// Good: the router's Link renders <a href="/blog/local-seo/"> and intercepts the click
<Link to="/blog/local-seo/">Local SEO</Link>`}
			</Code>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					The server's status codes for an invented address, a deep route and an old
					address:
					<Code block>
						{`for u in /this-page-cannot-exist-7f3a /blog/local-seo/ /old-route; do
  printf '%s ' "$u"
  curl -s -o /dev/null -w '%{http_code} %{redirect_url}\\n' "https://example.com$u"
done
# Expect: 404, 200 (with the post's text in the HTML), 301 to the new address`}
					</Code>
				</List.Item>
				<List.Item>
					Reload the browser on a deep route, and open it in a new tab from a link: the
					page should come up with the same content, filters and page number.
				</List.Item>
				<List.Item>
					In the DevTools console, find clickable elements with no address:
					<Code block>
						{`// <a> without href, and javascript: or fragment routes
document.querySelectorAll('a:not([href]), a[href^="javascript:"], a[href^="#/"], a[href^="#!"]')`}
					</Code>
					Navigation on a <Code>div</Code> or a <Code>button</Code> will not show up that
					way — check the menu items and the post cards by hand: hovering should show the
					address in the status bar.
				</List.Item>
				<List.Item>
					In Page indexing, open “Soft 404” and “Duplicate without user-selected
					canonical”: for an SPA those fill with routes that do not exist and screens
					served from the shared shell. The route from “the page is not in the index” to
					the cause is in “Debugging: the page is not indexed”.
				</List.Item>
			</List>

			<Text fw={600}>Common mistakes</Text>
			<DoAvoid
				good={[
					"A path of its own, through the History API, for every state that should be findable.",
					"A real 404 for unknown paths; where that is impossible, a full navigation to a URL that answers 404, or a noindex added by script.",
					"Server-side 301s for old addresses, former #/ routes included.",
					"Router links that render as <a href>.",
					"Filters and the page number in the URL, restored on a direct visit.",
				]}
				bad={[
					"try_files … /index.html with no exceptions: a 200 for any address.",
					"Redirecting addresses that do not exist to the home page — Google reads that as a soft 404 too.",
					"A “redirect” through router.push instead of an answer from the server.",
					"Navigation by onClick on a div, a button or an <a> with no href.",
					"Routes in the fragment (#/pricing) on a site that needs search.",
				]}
			/>

			<TrackerNote>
				“Missing pages answer 200 (soft 404)” (<Code>SOFT_404</Code>) — the tracker requests
				an address that cannot exist on the site and fails the check on any 2xx answer,
				after a redirect included: that catches both the <Code>index.html</Code> fallback
				and the “redirect to the home page”. “Links Google cannot follow” (
				<Code>UNCRAWLABLE_LINKS</Code>) flags an <Code>&lt;a&gt;</Code> with no href that
				navigates on click, an href that calls <Code>javascript:</Code> (except the empty
				ones such as <Code>javascript:void(0)</Code>: there is no page behind them), and
				routes in the fragment (<Code>#/pricing</Code>, <Code>#!pricing</Code>). It does not
				look for links on a <Code>div</Code> or a <Code>button</Code>, and the per-page
				checks see only the server's HTML — for CSR posts skipped as a shell (
				<Code>CONTENT_NEEDS_JAVASCRIPT</Code>) the links are not checked at all.
			</TrackerNote>
		</GuideSection>
	);
}

const META_TAGS = [
	{
		tag: "<title>",
		js: "Google takes the title from the rendered page. Social networks and AI crawlers see the generic title from index.html.",
		right: "Each route's own title in the server's HTML; on client-side transitions, updated by the same code.",
	},
	{
		tag: "meta description",
		js: "Google reads it after rendering; without JavaScript it is the site's generic description, or nothing.",
		right: "In the server's HTML for every route.",
	},
	{
		tag: "canonical",
		js: "Google will read a canonical inserted by a script, but asks that, where one exists in the source HTML, the script set the same value. A different value is a contradictory signal.",
		right: "One self-canonical in the server's HTML; no script changes it.",
	},
	{
		tag: "meta robots",
		js: "A noindex can be added by script — a page without one gets rendered. A noindex cannot be removed from the source HTML: Google may not render the page at all.",
		right: "The source HTML carries only the rule that is true for the page without JavaScript.",
	},
	{
		tag: "hreflang",
		js: "A set added by script depends on rendering; one generic set from index.html on every route is a mistake.",
		right: "A set of its own per route, in the server's HTML or in the sitemap.",
	},
	{
		tag: "Open Graph, Twitter Card",
		js: "Preview bots as a rule do not run JavaScript: the card is built from index.html — the site's title and image on every post.",
		right: "Required in the server's response for every route.",
	},
	{
		tag: "JSON-LD",
		js: "Google processes markup present in the DOM after rendering, including markup inserted by a script or by Google Tag Manager. For Product, Google warns that dynamic markup can make crawling for Shopping rarer and less reliable.",
		right: "Better in the server's HTML; if by script, test it in the Rich Results Test by URL, not by code.",
	},
] as const;

const SPA_SYMPTOMS = [
	{
		symptom: "Posts in results all share one title — the site's name",
		cause: "A script sets the title after the API answers; during rendering the request failed or did not finish in time, leaving the generic one from index.html.",
		fix: "Each route's title in the server's HTML (SSR/SSG).",
	},
	{
		symptom:
			"A link in Telegram, Facebook or Slack shows the site's logo and name instead of the post",
		cause: "The Open Graph tags exist only in index.html, or are added by a script.",
		fix: "og:title, og:description and og:image per route in the server's response; verify with the platforms' post debuggers.",
	},
	{
		symptom: "Many addresses under “Soft 404”",
		cause: "The index.html fallback answers 200 for any path; the “not found” or “failed to load” screen is served with a 200.",
		fix: "A real 404, a full navigation to a URL that answers 404, or a noindex added by script — see “SPA: routes, URLs and status codes”.",
	},
	{
		symptom: "“URL marked ‘noindex’”, yet there is no noindex in DevTools",
		cause: "The noindex is in the source shell and the script removes it; Google skipped rendering.",
		fix: "Take the noindex out of the source HTML; add it by script only on the screens that need it.",
	},
	{
		symptom: "“Duplicate, Google chose different canonical than user”",
		cause: "index.html canonicals to the home page, and the script either changes it or does not get there in time.",
		fix: "One self-canonical in the server's HTML of every route.",
	},
	{
		symptom:
			"“Crawled – currently not indexed” on many routes, with a nearly empty screenshot in URL Inspection",
		cause: "The content waits for a click, a scroll or cookie consent; the API is blocked in robots.txt (Disallow: /api/) or does not answer Googlebot.",
		fix: "Content with no interaction needed; open the API to Googlebot; check the resources under More info.",
	},
	{
		symptom: "The snippet says “Loading…” or “Please enable JavaScript”",
		cause: "The state before the data arrived went into the index, or the shell's <noscript> text did.",
		fix: "SSR/SSG; fetch the data on the server, not after mounting.",
	},
	{
		symptom: "Rich results disappeared after a release",
		cause: "The JSON-LD moved into a script or a tag manager and is not inserted during rendering.",
		fix: "The Rich Results Test by URL; put the markup back into the server's HTML.",
	},
] as const;

/** Head tags, structured data and content an app sets from JavaScript, and who sees them. */
export function SpaMetadataSection() {
	return (
		<GuideSection
			section={S.spaMetadata}
			sources={[
				SRC.javascriptSeo,
				SOURCES.fixJavascript,
				SOURCES.lazyLoading,
				SOURCES.structuredDataJs,
				SRC.robotsMeta,
				SRC.canonical,
				SRC.openGraph,
				SOURCES.aiCrawlers,
			]}
		>
			<Text>
				In an SPA there is one <Code>&lt;head&gt;</Code> for the whole app: the title,
				description, canonical and Open Graph tags from <Code>index.html</Code> are the same
				on every route until a script changes them. Google sees the values JavaScript
				changed — but only after rendering, and only if rendering succeeded. Social
				previews, AI assistants' crawlers and the tracker's crawler see the server's HTML
				and nothing else. So the rule is single: everything that describes the page must be
				in the server's response for that route, and JavaScript merely repeats the same
				values on client-side transitions.
			</Text>

			<Text fw={600}>Metadata: what search sees</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={150}>Tag</Table.Th>
						<Table.Th>If only JavaScript sets it</Table.Th>
						<Table.Th>How it should be</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{META_TAGS.map((row) => (
						<Table.Tr key={row.tag}>
							<Table.Td fw={600}>{row.tag}</Table.Td>
							<Table.Td>{row.js}</Table.Td>
							<Table.Td>{row.right}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Two traps that cost you the index</Text>
			<Code block>
				{`<!-- Trap 1: index.html says noindex "for staging", the app removes it in production.
     Google may never render the page, so the noindex is what it keeps. -->
<meta name="robots" content="noindex">
<script>if (location.hostname === "example.com") document.querySelector('meta[name=robots]').remove();</script>

<!-- Trap 2: one canonical for every route, rewritten by the router after data loads.
     Before rendering, every post points to the home page; after it, to itself. -->
<link rel="canonical" href="https://example.com/">`}
			</Code>
			<Text size="sm">
				The right answer is the route's server HTML with its own values. In React 19 a{" "}
				<Code>&lt;title&gt;</Code>, <Code>&lt;meta&gt;</Code> or <Code>&lt;link&gt;</Code>{" "}
				rendered inside a component is hoisted into <Code>&lt;head&gt;</Code>, and under SSR
				it lands in the server's response; the meta-frameworks have APIs of their own for
				this (the recipes are in “SPA: testing and framework recipes”).
			</Text>
			<Code block>
				{`// React 19 with SSR: these tags land in the server's <head>, not only after hydration
function PostPage({ post }) {
  const url = \`https://example.com/blog/\${post.slug}/\`;
  return (
    <article>
      <title>{\`\${post.title} | Example\`}</title>
      <meta name="description" content={post.summary} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.ogImage} />
      <h1>{post.title}</h1>
      {/* … */}
    </article>
  );
}`}
			</Code>

			<Text fw={600}>Content Google may never see</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>After a click or a scroll.</b> Google does not click, scroll or type. Tabs,
					“Show more” and loading on a scroll event are empty to it. Do lazy loading with
					the native <Code>loading="lazy"</Code> or an IntersectionObserver — neither
					depends on a user action; for an infinite feed, follow “Duplicates, parameters,
					pagination and facets”.
				</List.Item>
				<List.Item>
					<b>An API failure.</b> The data request failed or timed out, and CSR paints an
					empty template or “Failed to load” with a 200. Google indexes the rubbish, or
					marks a soft 404. Under SSR, answer a temporary data failure with a 503: Google
					comes back later and keeps the indexed version meanwhile. Under CSR, retry the
					request, and where the thing genuinely does not exist, use the methods from
					“SPA: routes, URLs and status codes”.
				</List.Item>
				<List.Item>
					<b>A blocked API.</b> If <Code>/api/</Code> is blocked in robots.txt, the
					renderer gets no data and the page renders empty. The endpoints that public
					pages are built from have to be reachable by Googlebot.
				</List.Item>
				<List.Item>
					<b>Behind a login, a consent banner or a geo-redirect.</b> Googlebot does not
					sign in, does not press “Accept” on a cookie banner, and declines permission
					requests; it crawls mostly from IP addresses in the United States. Content
					painted only after consent, or only for “its own” country, does not exist for
					it. The banner should sit over the content, not in place of it.
				</List.Item>
				<List.Item>
					<b>Service workers and caches.</b> The renderer keeps no state between loads —
					cookies, localStorage and sessionStorage are cleared — so treat every visit of
					its as the first: there is no installed service worker and no cached data, and
					the content has to come over the network. Name the bundles with a content
					fingerprint: Google's renderer caches JS aggressively and may ignore caching
					headers.
				</List.Item>
			</List>

			<Text fw={600}>Symptom → the SPA cause → the fix</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom in Search Console or the results</Table.Th>
						<Table.Th>The cause in an SPA</Table.Th>
						<Table.Th>The fix</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SPA_SYMPTOMS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td>{row.symptom}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Compare the <Code>&lt;head&gt;</Code> of two different routes in the server's
					response. Identical titles, canonicals and og:image tags mean JavaScript is
					doing the metadata.
					<Code block>
						{`for u in /blog/local-seo/ /blog/google-business-profile/; do
  echo "== $u"
  curl -s "https://example.com$u" \\
    | grep -ioE '<title>[^<]*</title>|<meta[^>]+(name="(description|robots)"|property="og:[a-z:]+")[^>]*>|<link[^>]+rel="canonical"[^>]*>'
done`}
					</Code>
				</List.Item>
				<List.Item>
					Compare that with the rendered page: URL Inspection → Test live URL → View
					tested page → HTML. A tag that is only there is a tag only Google sees.
				</List.Item>
				<List.Item>
					Test script-inserted structured data in the Rich Results Test by URL: testing by
					code will not run the script's requests.
				</List.Item>
				<List.Item>
					Turn JavaScript off in DevTools and walk through the tabs, the “Show more” and
					the feed; then turn it back on and check that the text appears with no clicks or
					scrolling. For previews, use Facebook's and LinkedIn's post debuggers.
				</List.Item>
			</List>

			<TrackerNote>
				The tracker's per-page checks read the server's HTML, so metadata added by a script
				is absent for them — as it is for social networks. A disagreement between the two
				kinds of check is a hint: if “No title tag” (<Code>TITLE_MISSING</Code>) fails while
				the Lighthouse audit “The title tag is missing or empty” (
				<Code>LH_DOCUMENT_TITLE</Code>), which sees the rendered page, passes, then
				JavaScript is setting the title. The pair “No meta description” (
				<Code>META_DESCRIPTION_MISSING</Code>) and “The meta description is missing or
				empty” (<Code>LH_META_DESCRIPTION</Code>) reads the same way. From that same server
				HTML the tracker takes “No canonical” (<Code>CANONICAL_MISSING</Code>), “No Open
				Graph tags” (<Code>OG_TAGS_MISSING</Code>), “The page is set to noindex” (
				<Code>NOINDEX</Code>), “Conflicting canonicals” (<Code>CANONICAL_CONFLICT</Code>)
				and “No article structured data” (<Code>STRUCTURED_DATA_MISSING</Code>) — JSON-LD
				inserted by a script is invisible to the tracker, though Google may read it. None of
				these checks judges a post that arrived as an empty shell: that one is reported by
				“Posts need JavaScript to show their text” (<Code>CONTENT_NEEDS_JAVASCRIPT</Code>).
			</TrackerNote>
		</GuideSection>
	);
}
