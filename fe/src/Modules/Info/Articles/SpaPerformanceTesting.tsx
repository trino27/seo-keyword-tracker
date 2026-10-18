import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import type { ReactNode } from "react";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

const SOURCES = {
	spaFaq: {
		title: "web.dev: How SPA architectures affect Core Web Vitals",
		url: "https://web.dev/articles/vitals-spa-faq",
	},
	softNavigations: {
		title: "Chrome for Developers: Measuring soft navigations",
		url: "https://developer.chrome.com/docs/web-platform/soft-navigations-experiment",
	},
	webVitalsLibrary: {
		title: "GitHub: GoogleChrome/web-vitals",
		url: "https://github.com/GoogleChrome/web-vitals",
	},
	renderingOnTheWeb: {
		title: "web.dev: Rendering on the Web",
		url: "https://web.dev/articles/rendering-on-the-web",
	},
	longTasks: {
		title: "web.dev: Optimize long tasks",
		url: "https://web.dev/articles/optimize-long-tasks",
	},
	contentVisibility: {
		title: "web.dev: content-visibility: the new CSS property that boosts your rendering performance",
		url: "https://web.dev/articles/content-visibility",
	},
	virtualizeLists: {
		title: "web.dev: Virtualize large lists with react-window",
		url: "https://web.dev/articles/virtualize-long-lists-react-window",
	},
	prerender: {
		title: "Chrome for Developers: Prerender pages in Chrome for instant page navigations",
		url: "https://developer.chrome.com/docs/web-platform/prerender-pages",
	},
	fixJavascript: {
		title: "Google Search Central: Fix Search-related JavaScript problems",
		url: "https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript",
	},
	urlInspection: {
		title: "Search Console Help: URL Inspection tool",
		url: "https://support.google.com/webmasters/answer/9012289",
	},
	googlebotBytes: {
		title: "Google Search Central Blog: Inside Googlebot: demystifying crawling, fetching, and the bytes we process",
		url: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
	},
	nextGenerateMetadata: {
		title: "Next.js: generateMetadata",
		url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
	},
	nextNotFound: {
		title: "Next.js: notFound",
		url: "https://nextjs.org/docs/app/api-reference/functions/not-found",
	},
	nextPermanentRedirect: {
		title: "Next.js: permanentRedirect",
		url: "https://nextjs.org/docs/app/api-reference/functions/permanentRedirect",
	},
	nextStreamingStatus: {
		title: "Next.js: loading.js (Status codes)",
		url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading",
	},
	nextHtmlLimitedBots: {
		title: "Next.js: htmlLimitedBots",
		url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots",
	},
	nuxtSeoMeta: {
		title: "Nuxt: useSeoMeta",
		url: "https://nuxt.com/docs/4.x/api/composables/use-seo-meta",
	},
	nuxtErrors: {
		title: "Nuxt: Error Handling",
		url: "https://nuxt.com/docs/4.x/getting-started/error-handling",
	},
	nuxtRendering: {
		title: "Nuxt: Rendering Modes",
		url: "https://nuxt.com/docs/4.x/guide/concepts/rendering",
	},
	reactRouterStatus: {
		title: "React Router: Status Codes",
		url: "https://reactrouter.com/how-to/status",
	},
	reactRouterRendering: {
		title: "React Router: Rendering Strategies",
		url: "https://reactrouter.com/start/framework/rendering",
	},
	svelteKitErrors: {
		title: "SvelteKit: Errors",
		url: "https://svelte.dev/docs/kit/errors",
	},
	svelteKitPageOptions: {
		title: "SvelteKit: Page options",
		url: "https://svelte.dev/docs/kit/page-options",
	},
	angularSsr: {
		title: "Angular: Server-side and hybrid-rendering",
		url: "https://angular.dev/guide/ssr",
	},
} satisfies Record<string, ISeoIssueSource>;

const METRICS_IN_SPA: {
	metric: string;
	hard: ReactNode;
	crux: ReactNode;
	soft: ReactNode;
}[] = [
	{
		metric: "TTFB",
		hard: "From the start of the navigation to the first byte of HTML.",
		crux: "Not measured: an API request after a click is not a navigation.",
		soft: "Reported as 0.",
	},
	{
		metric: "LCP",
		hard: "The largest element above the fold. Candidates stop updating after the first tap, scroll or key press.",
		crux: "Not measured: clicking a link finalises the first page's LCP, and the new route gets no LCP of its own.",
		soft: "The largest new element painted after the transition. Anything that stayed in place (the header, a shared cover) is not repainted and does not count.",
	},
	{
		metric: "INP",
		hard: "The worst interaction over the document's whole life (one outlier per 50 interactions is dropped), including the clicks that start transitions and everything that happens on later routes.",
		crux: "Accumulates over the whole visit and is attributed to the URL of the first load.",
		soft: "Measured afresh from each transition.",
	},
	{
		metric: "CLS",
		hard: "The worst window of shifts (shifts less than 1 s apart, a window no longer than 5 s) over the document's whole life.",
		crux: "Accumulates over the whole visit and is attributed to the URL of the first load.",
		soft: "Measured afresh from each transition.",
	},
];

const SPA_PERF_PROBLEMS: { symptom: string; cause: ReactNode; act: ReactNode }[] = [
	{
		symptom: "A bad LCP with a good TTFB; the source HTML has an empty root element",
		cause: "Client-side rendering: LCP waits for the bundle, the API request and the render, and the image is discovered last",
		act: "SSR or SSG for the first screen; at the very least the LCP image in the HTML or preloaded",
	},
	{
		symptom: "A bad INP on landing pages that have almost nothing to click",
		cause: "The whole visit's INP lands on the entry URL: a slow transition or a heavy route later in the session, or clicks during hydration",
		act: "RUM with the route on every value; code splitting per route, islands or Server Components, yielding to the main thread",
	},
	{
		symptom: "Following a link “hangs” before the screen changes",
		cause: "The handler renders the whole new route synchronously, or waits for a chunk without showing any response",
		act: "An instant response, prefetching the chunk and the data, rendering the new route as a non-urgent update",
	},
	{
		symptom: "CLS is bad in the field and near zero in Lighthouse",
		cause: "Shifts after transitions: a skeleton of a different height, data inserted above what is being read, scroll restored before the content loads",
		act: "Skeletons the size of the content, space reserved, scroll restored after the paint",
	},
	{
		symptom: "INP and CLS are worse in long sessions",
		cause: "The DOM and the subscriptions grow: an infinite feed, lists never unmounted, leaking listeners",
		act: "Virtualisation, content-visibility, unmounting routes that have been left; check the DOM node count after 20 transitions",
	},
	{
		symptom: "Going Back is slow and shifts about",
		cause: (
			<>
				No bfcache (<Code>Cache-Control: no-store</Code>, <Code>unload</Code> handlers) or
				the router refetches the data and shows a skeleton
			</>
		),
		act: "Remove the bfcache blockers; serve Back from the router's cache",
	},
	{
		symptom: "Inner routes have no URL-level field data",
		cause: "In CrUX a route only gets hard loads, and these are reached mostly by router transitions",
		act: "Read the origin-level data and your own RUM, grouped by route template",
	},
];

/** The vitals of a single-page application: what CrUX counts, why SPAs lose, and the fixes. */
export function SpaPerformanceSection() {
	return (
		<GuideSection
			section={S.spaPerformance}
			sources={[
				SOURCES.spaFaq,
				SOURCES.softNavigations,
				SOURCES.webVitalsLibrary,
				SOURCES.renderingOnTheWeb,
				SRC.lcp,
				SRC.inp,
				SRC.cls,
				SRC.optimizeInp,
				SOURCES.longTasks,
				SOURCES.contentVisibility,
				SOURCES.virtualizeLists,
				SOURCES.prerender,
				SRC.bfcache,
				SRC.pageSpeedInsights,
			]}
		>
			<Text>
				Core Web Vitals are built around <b>a document load</b>. On a multi-page site every
				click on a link is a new load with its own LCP, INP and CLS. In an SPA the document
				loads once, and from then on the router changes the URL through the History API and
				repaints part of the screen: that is a <b>soft navigation</b>. To the Chrome UX
				Report (CrUX) — and so to Search Console and to the field data in PageSpeed Insights
				— a whole visit to an SPA is one load: the metrics belong to the URL the visit
				started on, and everything that happened on later routes is added to it. The general
				picture of field and lab is in “Diagnosing the vitals: field, lab, attribution”;
				this chapter is what follows from it for an SPA.
			</Text>

			<Text fw={600}>How the metrics are counted in an SPA</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={70}>Metric</Table.Th>
						<Table.Th>The first load (a hard navigation)</Table.Th>
						<Table.Th>Router transitions in CrUX and Search Console</Table.Th>
						<Table.Th>Soft navigations API (Chrome 151+, your own RUM only)</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{METRICS_IN_SPA.map((row) => (
						<Table.Tr key={row.metric}>
							<Table.Td fw={600}>{row.metric}</Table.Td>
							<Table.Td>{row.hard}</Table.Td>
							<Table.Td>{row.crux}</Table.Td>
							<Table.Td>{row.soft}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text>
				<b>Why a long session is dangerous.</b> CLS is not the sum of every shift but the
				worst window — yet every transition is another chance at a bad window. Shifts within
				500 ms of a click do not count, so the change of screen itself is usually free; the
				API data that arrives a second later, and a skeleton replaced by content of a
				different height, are not. INP creeps towards the slowest interaction with every
				click: if a reader makes 30 clicks in a visit, one heavy transition will almost
				certainly make it into the result. And all of it lands on the landing URL: a bad INP
				for <Code>/blog/</Code> may be created by the <Code>/pricing</Code> route readers
				moved on to.
			</Text>
			<Text>
				<b>The Soft navigations API.</b> From Chrome 151 the browser recognises a soft
				navigation itself — a user interaction, a visible URL change, and a paint after it —
				and can measure the metrics per route. Chrome and Edge 151+ support it; Firefox and
				Safari do not. The <Code>web-vitals</Code> library (supported from version 6)
				reports such values with the <Code>reportSoftNavs: true</Code> option and marks them{" "}
				<Code>navigationType: "soft-navigation"</Code>. How soft navigations will count in
				CrUX, Google has not yet decided, so Search and Search Console still see hard loads
				only. With the option on, the first page's metrics are finalised at the first
				transition and may come out better than what CrUX sees; to compare yourself with
				CrUX, register the handlers twice — with the option and without.
			</Text>

			<Text fw={600}>Why SPAs are often bad at LCP</Text>
			<Text>
				Under client-side rendering the first load runs as a chain: the HTML shell → the
				bundle downloaded, parsed and executed → the API request → the render → and only now
				does the browser learn the address of the main image and start fetching it. The
				shell's TTFB is often excellent (a static file from a CDN), and the time goes into
				phases that web.dev's rule of thumb says should each be under 10%: for an image LCP,{" "}
				<b>resource load delay</b> balloons (the preload scanner cannot see an image that is
				not in the HTML); for a text LCP, <b>element render delay</b> does. Code splitting
				per route adds another link: the current route's chunk is discovered only after the
				main bundle runs, unless the server named it in the HTML.
			</Text>

			<Text fw={600}>Why SPAs are often bad at INP</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Input delay.</b> During the load the main thread is busy running the bundle
					and hydrating — restoring interactivity over the server's HTML. The page looks
					ready while the first clicks wait for long tasks to end. After a transition,
					executing the route chunk that has just arrived does the same.
				</List.Item>
				<List.Item>
					<b>Processing.</b> Clicking a link renders the whole new route synchronously, a
					change in the global store repaints an enormous component tree, and sending a
					page_view and recomputing data run in the same task.
				</List.Item>
				<List.Item>
					<b>Presentation delay.</b> The new route inserts thousands of nodes; the DOM
					grows over a session if the screens left behind and the long lists are never
					unmounted.
				</List.Item>
			</List>
			<Text size="sm">
				INP ends at the next frame after the handlers and does not include waiting on the
				network. If the router shows a transition indicator at once and awaits the data
				asynchronously, INP stays good even with a slow API. What ruins it is synchronous
				work in the same task as the click.
			</Text>

			<Text fw={600}>The recipes</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>SSR or SSG for the first screen.</b> The text and the LCP image's address
					arrive in the HTML — the bundle, the API and the render leave the LCP chain.
					Hydration remains, so watch INP after moving to SSR.
				</List.Item>
				<List.Item>
					<b>Streaming SSR.</b> The server sends the header and the first screen at once,
					and the slow blocks trickle in as they become ready (Suspense boundaries in
					React): the first byte and the first paint do not wait for the slowest query.
					The price is that the status code is fixed at the start of the stream (more in
					the next chapter).
				</List.Item>
				<List.Item>
					<b>Code splitting per route.</b> Each route gets its own chunk and the first
					load carries only what it needs. The server has to name the current route's
					chunk in the HTML (<Code>{'<link rel="modulepreload">'}</Code>); SSR frameworks
					do it for you.
				</List.Item>
				<List.Item>
					<b>Less hydration.</b> Partial hydration, an islands architecture, React Server
					Components: the static parts of the page get no JavaScript at all, and only the
					interactive parts are left to hydrate.
				</List.Item>
				<List.Item>
					<b>Prefetch the next route.</b> The chunk and the data load when the link enters
					the viewport or is hovered: the <Code>Link</Code> component in Next.js,{" "}
					<Code>{'<Link prefetch="intent">'}</Code> in React Router. The transition then
					needs no network at all.
				</List.Item>
				<List.Item>
					<b>Speculation Rules</b> only speed up document navigations: moves between the
					pages of an MPA, and entering an SPA from another page (the recipe is in “LCP —
					loading”). They do nothing for router transitions.
				</List.Item>
				<List.Item>
					<b>A transition with no long task.</b> A visual response first (an indicator, an
					active link), then <Code>await scheduler.yield()</Code>, the new route rendered
					as a non-urgent update (<Code>startTransition</Code> in React), analytics after
					the frame. The code for yielding is in “INP — responsiveness”.
				</List.Item>
				<List.Item>
					<b>Virtualise long lists:</b> only the visible rows are in the DOM. The SEO
					trap: links to the invisible items are absent from the rendered HTML Google gets
					too. If the list leads to indexable pages, give it pagination with ordinary{" "}
					<Code>{"<a href>"}</Code> links.
				</List.Item>
				<List.Item>
					<b>
						<Code>content-visibility: auto</Code>
					</b>{" "}
					for long routes: the DOM stays (the text and links are visible to search), but
					the browser does not render what is far from the viewport.
				</List.Item>
				<List.Item>
					<b>Against CLS:</b> a skeleton the same height as the content that replaces it (
					<Code>min-height</Code>, <Code>aspect-ratio</Code>); space reserved for banners
					and ads; new blocks below what is being read, or over it.
				</List.Item>
				<List.Item>
					<b>Scroll restoration.</b> On Back, the router should restore the position after
					the content is painted, and take the data from the cache rather than refetching
					it behind a skeleton. In React Router that is the{" "}
					<Code>{"<ScrollRestoration />"}</Code> component; Next.js does it for you.
				</List.Item>
				<List.Item>
					<b>bfcache.</b> When a reader leaves the SPA for another site and comes back
					with the Back button, the whole app is restored from the back/forward cache
					instantly — unless <Code>Cache-Control: no-store</Code> on the HTML or{" "}
					<Code>unload</Code> handlers block it.
				</List.Item>
			</List>
			<Code block>
				{`<!-- the current route's chunk is named in the HTML: no waterfall behind the main bundle -->
<link rel="modulepreload" href="/assets/route-post.4f1c2a.js">

/* CSS: placeholders the size of what replaces them */
.post-card--loading { min-height: 180px; }
.post-cover { aspect-ratio: 16 / 9; }
.related-posts { content-visibility: auto; contain-intrinsic-size: auto 600px; }`}
			</Code>

			<Text fw={600}>How to measure it</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>RUM per route.</b> Send the route a metric belongs to along with it — the
					template (<Code>/blog/:slug</Code>), not the full URL, so the values add up.
					Take it from <Code>navigationURL</Code> rather than the current address: INP and
					CLS are sent when the tab goes into the background, and by then the reader may
					be on another route.
				</List.Item>
				<List.Item>
					<b>Without the Soft navigations API</b> (Safari, Firefox) INP and CLS stay
					single values for the whole visit. Keep a log of the router's transitions (time
					and route) and line it up against INP's <Code>attribution.interactionTime</Code>{" "}
					and CLS's <Code>attribution.largestShiftTime</Code> — that shows which route the
					worst one happened on.
				</List.Item>
				<List.Item>
					<b>DevTools → Performance</b> with CPU throttling: start recording, click a link
					to another route, wait for the content, stop. The Interactions track holds that
					click and its three phases, Main beneath it the long tasks (the router, the
					render, running the chunk), Network the chain “chunk → API → image”, and Layout
					shifts the shifts after the data arrived.
				</List.Item>
				<List.Item>
					<b>A long session.</b> Make 20 transitions back and forth without reloading and
					compare the node count (<Code>document.querySelectorAll("*").length</Code> in
					the console) and INP at the start and at the end. Growth is a sign of screens
					never unmounted.
				</List.Item>
				<List.Item>
					A recorded flow with transitions is also what Lighthouse's timespan mode gives
					you (see “Diagnosing the vitals: field, lab, attribution”).
				</List.Item>
			</List>
			<Code block>
				{`import { onCLS, onINP, onLCP } from "web-vitals/attribution";

// the route TEMPLATE, so /blog/a and /blog/b add up: "/blog/:slug"
const routeOf = (url) => matchRouteTemplate(new URL(url, location.origin).pathname);

function send({ name, value, rating, navigationType, navigationURL, attribution: a }) {
  navigator.sendBeacon("/rum", JSON.stringify({
    name, value, rating,
    nav: navigationType,                   // "navigate", "back-forward-cache", "soft-navigation"…
    route: routeOf(navigationURL ?? location.href),
    target: a.interactionTarget ?? a.largestShiftTarget ?? a.target,
  }));
}

// Chromium 151+: one value per route; other browsers report per page load as before
for (const on of [onLCP, onINP, onCLS]) on(send, { reportSoftNavs: true });`}
			</Code>

			<Text fw={600}>Common situations</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Symptom</Table.Th>
						<Table.Th>The cause in an SPA</Table.Th>
						<Table.Th>What to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SPA_PERF_PROBLEMS.map((row) => (
						<Table.Tr key={row.symptom}>
							<Table.Td>{row.symptom}</Table.Td>
							<Table.Td>{row.cause}</Table.Td>
							<Table.Td>{row.act}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text size="sm">
				<b>How this relates to the tracker.</b> The tracker takes speed from PageSpeed
				Insights, per URL. The field data there is CrUX, that is to say the hard loads of
				that URL alone; their INP and CLS include everything readers did later in the
				session on other routes. The lab test is a cold load of the URL directly: for an SPA
				with client-side rendering it shows the whole “shell → bundle → API” chain, but sees
				no transitions. Hence the findings “Poor LCP on mobile” (<Code>CWV_LCP_POOR</Code>),
				“Poor INP on mobile” (<Code>CWV_INP_POOR</Code>), “Poor CLS on mobile” (
				<Code>CWV_CLS_POOR</Code>) and their variants. “A large DOM” (
				<Code>DOM_SIZE_LARGE</Code>) counts the elements in the server's HTML: what
				JavaScript paints later is not in it. The bfcache has its own check, “Cache-Control:
				no-store keeps the page out of the back/forward cache” (
				<Code>BFCACHE_BLOCKED_BY_NO_STORE</Code>). Per-route metrics the tracker does not
				collect — those need RUM of your own.
			</Text>
		</GuideSection>
	);
}

const FRAMEWORK_RECIPES: {
	name: string;
	meta: ReactNode;
	notFound: ReactNode;
	redirect: ReactNode;
	rendering: ReactNode;
}[] = [
	{
		name: "Next.js (App Router)",
		meta: (
			<>
				<Code>export const metadata</Code> or <Code>generateMetadata()</Code> in{" "}
				<Code>page.tsx</Code>/<Code>layout.tsx</Code> — in Server Components only.{" "}
				<Code>metadataBase</Code> in the root layout makes the canonical absolute.
			</>
		),
		notFound: (
			<>
				<Code>notFound()</Code> → 404 and <Code>noindex</Code>. If the stream has already
				started (<Code>loading.tsx</Code> or a Suspense boundary fired), the status stays
				200 and Next.js adds only the <Code>noindex</Code>.
			</>
		),
		redirect: (
			<>
				<Code>permanentRedirect()</Code> → 308, <Code>redirect()</Code> → 307; for old
				addresses, <Code>redirects()</Code> in <Code>next.config</Code> with{" "}
				<Code>permanent: true</Code> (308). Google treats a 308 as a 301.
			</>
		),
		rendering: (
			<>
				Server Components render on the server by default; static at build time through{" "}
				<Code>generateStaticParams()</Code>. <Code>app/sitemap.ts</Code> and{" "}
				<Code>app/robots.ts</Code> generate sitemap.xml and robots.txt.
			</>
		),
	},
	{
		name: "Nuxt",
		meta: (
			<>
				<Code>useSeoMeta()</Code> (title, description, Open Graph), <Code>useHead()</Code>{" "}
				for the canonical and the rest.
			</>
		),
		notFound: (
			<>
				<Code>{"throw createError({ status: 404, fatal: true })"}</Code>; before Nuxt 4.3 it
				was <Code>statusCode</Code>. On the server this is a 404; on the client an error
				without <Code>fatal</Code> shows no error page.
			</>
		),
		redirect: (
			<>
				<Code>{"navigateTo(url, { redirectCode: 301 })"}</Code> (302 by default) or{" "}
				<Code>routeRules</Code> with <Code>{"redirect: { to, statusCode: 301 }"}</Code> (307
				by default).
			</>
		),
		rendering: (
			<>
				Universal rendering (SSR) by default; <Code>routeRules</Code>:{" "}
				<Code>prerender</Code>, <Code>swr</Code>, <Code>isr</Code>. <Code>ssr: false</Code>{" "}
				turns the site into a CSR app.
			</>
		),
	},
	{
		name: "React Router v7 (framework mode) / Remix",
		meta: (
			<>
				With React 19 the documentation advises <Code>{"<title>"}</Code> and{" "}
				<Code>{"<meta>"}</Code> straight in the route component; the <Code>meta</Code>{" "}
				export still works.
			</>
		),
		notFound: (
			<>
				In the <Code>loader</Code>:{" "}
				<Code>{'throw data("Not Found", { status: 404 })'}</Code> — the{" "}
				<Code>ErrorBoundary</Code> renders and the response is a 404.
			</>
		),
		redirect: (
			<>
				In the <Code>loader</Code>: <Code>{'redirect("/new-path", 301)'}</Code> (302 by
				default).
			</>
		),
		rendering: (
			<>
				<Code>react-router.config.ts</Code>: <Code>ssr: true</Code>, prerender a list of
				URLs with <Code>prerender()</Code>; <Code>ssr: false</Code> is SPA mode.
			</>
		),
	},
	{
		name: "SvelteKit",
		meta: (
			<>
				<Code>{"<svelte:head>"}</Code> in <Code>+page.svelte</Code>, with the data from{" "}
				<Code>load</Code>.
			</>
		),
		notFound: (
			<>
				<Code>{"error(404, 'Not found')"}</Code> in <Code>load</Code> (
				<Code>+page.server.ts</Code> or <Code>+page.ts</Code>) → a 404 and the nearest{" "}
				<Code>+error.svelte</Code>.
			</>
		),
		redirect: <Code>{"redirect(301, '/new-path')"}</Code>,
		rendering: (
			<>
				SSR by default; <Code>export const prerender = true</Code> for static.{" "}
				<Code>ssr = false</Code> serves an empty shell.
			</>
		),
	},
	{
		name: "Angular",
		meta: (
			<>
				The <Code>Title</Code> and <Code>Meta</Code> services from{" "}
				<Code>@angular/platform-browser</Code>; under SSR the tags land in the HTML.
			</>
		),
		notFound: (
			<>
				<Code>status: 404</Code> on the server route (<Code>**</Code>, say) or, where the
				code is only known at request time, the <Code>RESPONSE_INIT</Code> token.
			</>
		),
		redirect: (
			<>
				Under SSR a <Code>redirectTo</Code> becomes an HTTP redirect; when prerendered, a
				meta refresh. Permanent 301s are safer set on the server or the CDN.
			</>
		),
		rendering: (
			<>
				<Code>ng add @angular/ssr</Code>; in <Code>app.routes.server.ts</Code>,{" "}
				<Code>RenderMode.Server</Code>, <Code>Prerender</Code> or <Code>Client</Code> per
				route.
			</>
		),
	},
	{
		name: "Vue or React with no SSR (CSR)",
		meta: "From JavaScript only: in the server's HTML every route carries the same title and description.",
		notFound: (
			<>
				The server answers <Code>index.html</Code> with a 200 for any path. What is left are
				Google's workarounds: a JS redirect to a URL that answers 404, or a{" "}
				<Code>noindex</Code> on the error screen.
			</>
		),
		redirect:
			"On the server or the CDN only; Google will understand a JS redirect, but it is no 301.",
		rendering: (
			<>
				Prerender the routes at build time (an HTML file each, an unknown path → 404), or
				move to a framework with SSR: Nuxt for Vue, Next.js or React Router v7 for React.
			</>
		),
	},
];

/** A step-by-step check of an SPA as crawlers see it, and per-framework SEO recipes. */
export function SpaTestingSection() {
	return (
		<GuideSection
			section={S.spaTesting}
			sources={[
				SRC.javascriptSeo,
				SOURCES.fixJavascript,
				SOURCES.urlInspection,
				SOURCES.googlebotBytes,
				SRC.robotsIntro,
				SOURCES.nextGenerateMetadata,
				SOURCES.nextNotFound,
				SOURCES.nextPermanentRedirect,
				SOURCES.nextStreamingStatus,
				SOURCES.nextHtmlLimitedBots,
				SOURCES.nuxtSeoMeta,
				SOURCES.nuxtErrors,
				SOURCES.nuxtRendering,
				SOURCES.reactRouterStatus,
				SOURCES.reactRouterRendering,
				SOURCES.svelteKitErrors,
				SOURCES.svelteKitPageOptions,
				SOURCES.angularSsr,
			]}
		>
			<Text>
				A page of an SPA has three versions. <b>The server's HTML</b> — what the tracker's
				crawler, AI assistants' crawlers and the previews of social networks and messengers
				see. <b>The rendered DOM</b> — what Google gets after rendering and indexes. And{" "}
				<b>the screen after a router transition</b> — which only a live user ever sees:
				crawlers always arrive at a URL by hard navigation, with no history and no saved
				state. So every route has to work as an entry point, and it is the first two
				versions, and the difference between them, that you test. The basics are in
				“Rendering and JavaScript”; below is the full procedure for an SPA.
			</Text>

			<Text fw={600}>The check, step by step</Text>
			<List type="ordered" size="sm" spacing={6}>
				<List.Item>
					<b>The source HTML.</b> Request the page the way a crawler with no JavaScript
					does, and look in the response for the title, canonical, robots, h1, a paragraph
					of text and <Code>{"<a href>"}</Code> links. An empty root element in place of
					the article means client-side rendering.
				</List.Item>
				<List.Item>
					<b>What Google sees.</b> URL Inspection → Test live URL → View tested page: the
					HTML after rendering, the screenshot, and More info — the page resources that
					failed to load and the JavaScript console messages. For an SPA the important
					things there are API requests that did not go through (blocked in robots.txt,
					answered with an error) and exceptions in the app's code — those cut the render
					short at the shell or the loading screen.
				</List.Item>
				<List.Item>
					<b>Compare the source and the rendered HTML.</b> Everything that exists only in
					the rendered one is seen by Google alone, and only after rendering. Save the
					rendered DOM from Chrome: in the console,{" "}
					<Code>copy(document.documentElement.outerHTML)</Code>, or from the command line,{" "}
					<Code>chrome --headless --dump-dom URL</Code>. A disagreement over robots is the
					dangerous one: with a <Code>noindex</Code> in the source HTML Google may not
					render the page at all, and the JavaScript that removes it never runs.
				</List.Item>
				<List.Item>
					<b>Turn JavaScript off</b> in DevTools (Command Menu → Disable JavaScript) and
					walk the site: are the navigation, the links to posts, the pagination and the
					article's text still there?
				</List.Item>
				<List.Item>
					<b>Direct entry and reload on a deep route.</b> Open a post's URL in a new tab
					and press F5: the page should arrive with a 200 and its content, not a server
					error or a redirect to the home page. Then a route that does not exist: expect a
					404 (or a 410), not a 200 saying “not found”. An old address should be a 301 or
					308 to the new one in the server's response, not a JS redirect.
				</List.Item>
				<List.Item>
					<b>A site crawler in two modes.</b> Crawl the site with a desktop crawler
					(Screaming Frog SEO Spider, say) without rendering and with JavaScript
					rendering, and compare: how many URLs were found, and how many pages only get a
					title, a canonical and text after JavaScript. If rendering finds far more pages,
					the links to them exist only in JS.
				</List.Item>
				<List.Item>
					<b>robots.txt must not block what the page is built from:</b> the JS, the CSS
					and the API endpoints the content comes from. Google's renderer fetches scripts,
					styles and XHR requests as ordinary URLs, checking robots.txt; what is forbidden
					is not fetched, and its content is absent from the rendered page. A separate
					limit: Googlebot downloads at most 2 MB of each resource, every JS file included
					— code past that boundary the renderer will not run.
				</List.Item>
				<List.Item>
					<b>The server logs.</b> Make sure Googlebot is requesting not only the HTML but
					the bundles and the API too, and that they answer 200. A 401, 403 or 429 on the
					API for Googlebot (bot protection, rate limits, authentication) means an empty
					render. How to tell the real Googlebot from a fake is in “Googlebot in the
					server logs”.
				</List.Item>
			</List>
			<Code block>
				{`# 1. the server's HTML: what a crawler without JavaScript gets
curl -s https://example.com/blog/local-seo/ \\
  | grep -o -i -E '<title>[^<]*</title>|<link[^>]*rel="canonical"[^>]*>|<meta[^>]*name="robots"[^>]*>|<h1[^>]*>'
curl -s https://example.com/blog/local-seo/ | grep -c '<a [^>]*href='   # links in the HTML

# 5. codes: a deep route, a made-up one, an old address
curl -s -o /dev/null -w "%{http_code}\\n" https://example.com/blog/local-seo/          # 200
curl -s -o /dev/null -w "%{http_code}\\n" https://example.com/blog/no-such-post-7f3a/  # 404, not 200
curl -sI https://example.com/posts/local-seo | grep -i -E "^HTTP|^location"          # 301/308 + Location

# 7. robots.txt: this breaks rendering when posts load from /api/posts/...
User-agent: *
Disallow: /api/
# instead: close only what is not needed for rendering
User-agent: *
Disallow: /api/admin/

# 8. what Googlebot fetched besides HTML (combined log format: $7 path, $9 code)
grep "Googlebot" access.log | grep -E '"GET /(assets|static|_next|api)/' \\
  | awk '{print $9, $7}' | sort | uniq -c | sort -rn | head -20`}
			</Code>

			<Text fw={600}>An SPA checklist before a release</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					Every indexable route serves its own title, meta description, canonical, h1 and
					main text in the server's HTML.
				</List.Item>
				<List.Item>
					Navigation uses <Code>{"<a href>"}</Code> links to real URLs; no <Code>#/</Code>{" "}
					fragments for different pages.
				</List.Item>
				<List.Item>
					Direct entry and F5 on any route give a 200; a path that does not exist gives a
					404; old addresses give a 301/308 from the server.
				</List.Item>
				<List.Item>
					The source HTML carries no <Code>noindex</Code> that JavaScript later removes.
				</List.Item>
				<List.Item>
					robots.txt does not block the JS, CSS and APIs needed for rendering, and those
					resources answer Googlebot with a 200.
				</List.Item>
				<List.Item>
					URL Inspection: the screenshot shows content, not a spinner, and the console has
					no errors.
				</List.Item>
				<List.Item>
					The bundle names carry a content hash: Google's renderer caches resources
					aggressively and may ignore caching headers.
				</List.Item>
				<List.Item>The sitemap lists the routes' canonical URLs.</List.Item>
				<List.Item>
					Core Web Vitals checked not only on the first load but on transitions too (see
					“Core Web Vitals in an SPA”).
				</List.Item>
			</List>

			<Text fw={600}>Framework recipes</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={130}>Framework</Table.Th>
						<Table.Th>Route metadata</Table.Th>
						<Table.Th>404</Table.Th>
						<Table.Th>301</Table.Th>
						<Table.Th>SSR and SSG</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{FRAMEWORK_RECIPES.map((row) => (
						<Table.Tr key={row.name}>
							<Table.Td fw={600}>{row.name}</Table.Td>
							<Table.Td>{row.meta}</Table.Td>
							<Table.Td>{row.notFound}</Table.Td>
							<Table.Td>{row.redirect}</Table.Td>
							<Table.Td>{row.rendering}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Next.js: a blog post</Text>
			<Text size="sm">
				Check that the thing exists before the first Suspense boundary, or the response goes
				out with a 200. One more trap is <b>streaming metadata</b> (from Next.js 15.2): on
				dynamically rendered pages the result of <Code>generateMetadata</Code> can be
				streamed in and land at the end of <Code>{"<body>"}</Code>. Next.js puts the
				metadata straight into <Code>{"<head>"}</Code> only for the bots on its own list
				(Bingbot, Twitterbot, Slackbot, Google's crawlers with the “-Google” suffix and
				others); Googlebot renders the page and sees them anyway. But a crawler that does
				not run JavaScript, looks for the title in <Code>{"<head>"}</Code> and is not on the
				list — the tracker's crawler or AI assistants' crawlers, say — gets a page with no
				title in <Code>{"<head>"}</Code>. Prerendered pages have no streaming metadata. The{" "}
				<Code>htmlLimitedBots</Code> option replaces the list wholesale, and{" "}
				<Code>/.*/</Code> turns streaming metadata off for everyone.
			</Text>
			<Code block>
				{`// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/posts"; // wrapped in React cache(): one query per request

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug })); // built as static HTML
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: \`/blog/\${post.slug}/\` }, // absolute thanks to metadataBase in app/layout.tsx
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();                                       // 404 + noindex: checked before any Suspense
  if (post.slug !== slug) permanentRedirect(\`/blog/\${post.slug}/\`); // 308, old slug
  return <article><h1>{post.title}</h1>{/* ... */}</article>;
}

// next.config.ts
export default {
  async redirects() {
    return [{ source: "/posts/:slug", destination: "/blog/:slug/", permanent: true }]; // 308
  },
};

// app/sitemap.ts
import type { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await getAllPosts()).map((post) => ({
    url: \`https://example.com/blog/\${post.slug}/\`,
    lastModified: post.updatedAt,
  }));
}`}
			</Code>

			<Text fw={600}>Nuxt: a blog post</Text>
			<Text size="sm">
				SSR is on by default in Nuxt — do not switch it off (<Code>ssr: false</Code>) for
				public sections. <Code>useSeoMeta</Code> accepts getters, so the tags update on
				router transitions too. Throw the 404 with <Code>fatal: true</Code>: without it an
				error that happens on the client after a transition shows no error page.
			</Text>
			<Code block>
				{`<!-- app/pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(\`/api/posts/\${route.params.slug}\`);

if (!post.value) {
  // 404 in the server's response; Nuxt < 4.3 spells it statusCode / statusMessage
  throw createError({ status: 404, statusText: "Not Found", fatal: true });
}

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.excerpt,
  ogTitle: () => post.value?.title,
});
useHead({
  link: [{ rel: "canonical", href: () => \`https://example.com/blog/\${post.value?.slug}/\` }],
});
</script>

// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    "/blog/**": { prerender: true },                       // static HTML at build time
    "/posts/local-seo": { redirect: { to: "/blog/local-seo/", statusCode: 301 } }, // default is 307
    "/account/**": { ssr: false },                         // private area: client-only is fine
  },
});`}
			</Code>

			<Text size="sm">
				<b>How this relates to the tracker.</b> The tracker's crawler runs no JavaScript and
				reads the server's HTML only — it essentially automates step 1. Posts that arrive as
				an empty shell it does not analyse as articles: they appear in the crawl log with a
				reason, and the site gets the finding “Posts need JavaScript to show their text” (
				<Code>CONTENT_NEEDS_JAVASCRIPT</Code>). Step 5 is partly done by “Missing pages
				answer 200 (soft 404)” (<Code>SOFT_404</Code>): the tracker requests a made-up
				address and looks only at the status code after redirects — so both an SPA serving{" "}
				<Code>index.html</Code> for any path and a Next.js app that streamed its 404 with a
				200 and a <Code>noindex</Code> fail it. “robots.txt blocks scripts or styles” (
				<Code>ROBOTS_BLOCKS_RESOURCES</Code>) checks the scripts and stylesheets named in
				the server's HTML against robots.txt; chunks loaded dynamically and API endpoints it
				cannot see — check those by hand (step 7). “Links Google cannot follow” (
				<Code>UNCRAWLABLE_LINKS</Code>) reads the server's HTML too. “Large HTML” (
				<Code>LARGE_PAGE</Code>) on an SSR framework often means a bloated inline hydration
				state ahead of the text. The comparison of the two versions comes from the pair “No
				title tag” (<Code>TITLE_MISSING</Code>, the title in the server HTML's{" "}
				<Code>{"<head>"}</Code> only) and the Lighthouse audit “The title tag is missing or
				empty” (<Code>LH_DOCUMENT_TITLE</Code>, the rendered page): if our check fails and
				Lighthouse passes, the title is set by JavaScript, or Next.js is streaming it.
			</Text>
		</GuideSection>
	);
}
