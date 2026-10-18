import { Badge, Code, Group, List, Table, Text } from "@mantine/core";
import {
	CWV_BANDS,
	CWV_METRICS,
	CWV_SOURCES,
	CWV_THRESHOLDS,
	type ISeoIssueSource,
	type TCwvMetric,
} from "@app/contracts";
import { cwvBandColor, cwvBandLabel } from "@Core/Constants/cwvBandColor";
import { pageSpeedAvailabilityCopy } from "@Core/Constants/pageSpeedAvailabilityCopy";
import {
	CWV_METRIC_NAME,
	cwvSourceLabel,
	formatCwvValue,
} from "@Core/Helpers/DescribeCwv/describeCwv";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { CwvDiagnosticsSection } from "./CwvDiagnostics";
import { GuideSection } from "../GuideSection/GuideSection";
import { GuidePart } from "../GuidePart/GuidePart";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

const METRIC_ABOUT: Record<TCwvMetric, { full: string; measures: string }> = {
	lcp: { full: "Largest Contentful Paint", measures: "Loading — when the main content appears" },
	inp: {
		full: "Interaction to Next Paint",
		measures: "Responsiveness — how fast the page reacts",
	},
	cls: { full: "Cumulative Layout Shift", measures: "Visual stability — how much content jumps" },
};

const SOURCE_MEANING = {
	url: "Chrome users who visited this exact page over the last 28 days. The best evidence: it is what readers really got.",
	origin: "The page has too few visits of its own, so Google reports all visitors to the whole site. Real, but not about this page alone.",
	lab: "No real-visitor data, so one Lighthouse test on a simulated phone. It varies from run to run and cannot measure INP.",
} as const;

/** Pages these chapters cite beyond the shared list; each was opened against its sentence on 2026-10-12. */
const SOURCES = {
	fetchPriority: {
		title: "web.dev: Optimize resource loading with the Fetch Priority API",
		url: "https://web.dev/articles/fetch-priority",
	},
	earlyHints: {
		title: "Chrome for Developers: Faster page loads using server think-time with Early Hints",
		url: "https://developer.chrome.com/docs/web-platform/early-hints",
	},
	prerender: {
		title: "Chrome for Developers: Prerender pages in Chrome for instant page navigations",
		url: "https://developer.chrome.com/docs/web-platform/prerender-pages",
	},
	longTasks: {
		title: "web.dev: Optimize long tasks",
		url: "https://web.dev/articles/optimize-long-tasks",
	},
	contentVisibility: {
		title: "web.dev: content-visibility: the new CSS property that boosts your rendering performance",
		url: "https://web.dev/articles/content-visibility",
	},
	facades: {
		title: "Chrome for Developers: Lazy load third-party resources with facades",
		url: "https://developer.chrome.com/docs/lighthouse/performance/third-party-facades",
	},
	useTransition: {
		title: "React: useTransition",
		url: "https://react.dev/reference/react/useTransition",
	},
	debugLayoutShifts: {
		title: "web.dev: Debug layout shifts",
		url: "https://web.dev/articles/debug-layout-shifts",
	},
	sizeAdjust: {
		title: "web.dev: CSS size-adjust for @font-face",
		url: "https://web.dev/articles/css-size-adjust",
	},
	fontBestPractices: {
		title: "web.dev: Best practices for fonts",
		url: "https://web.dev/articles/font-best-practices",
	},
} satisfies Record<string, ISeoIssueSource>;

/** Part four: the three Core Web Vitals — what each measures, what makes it bad, how to fix it. */
export function CoreWebVitalsGuide() {
	return (
		<GuidePart
			title="Core Web Vitals"
			lead="Google's three measures of how a page feels to a real visitor, and how this tracker reads them."
		>
			<GuideSection
				section={S.cwv}
				sources={[
					SRC.webVitals,
					SRC.coreWebVitals,
					SRC.pageExperience,
					SRC.pageSpeedInsights,
				]}
			>
				<Text>
					Core Web Vitals measure the experience of loading and using a page, from real
					Chrome users. Each has three bands. A page passes when all three are good at the{" "}
					<b>75th percentile</b> — that is, for at least three visits out of four —
					measured separately for mobile and desktop.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Metric</Table.Th>
							<Table.Th>Measures</Table.Th>
							{CWV_BANDS.map((band) => (
								<Table.Th key={band}>
									<Badge color={cwvBandColor[band]} variant="light">
										{cwvBandLabel[band]}
									</Badge>
								</Table.Th>
							))}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{CWV_METRICS.map((metric) => {
							const { good, poor } = CWV_THRESHOLDS[metric];
							return (
								<Table.Tr key={metric}>
									<Table.Td fw={600}>
										{CWV_METRIC_NAME[metric]}
										<Text size="xs" c="dimmed">
											{METRIC_ABOUT[metric].full}
										</Text>
									</Table.Td>
									<Table.Td>{METRIC_ABOUT[metric].measures}</Table.Td>
									<Table.Td className="tabular">
										≤ {formatCwvValue(metric, good)}
									</Table.Td>
									<Table.Td className="tabular">
										{formatCwvValue(metric, good)} –{" "}
										{formatCwvValue(metric, poor)}
									</Table.Td>
									<Table.Td className="tabular">
										&gt; {formatCwvValue(metric, poor)}
									</Table.Td>
								</Table.Tr>
							);
						})}
					</Table.Tbody>
				</Table>
				<Text fw={600}>How much they matter</Text>
				<Text>
					Google says good Core Web Vitals align with what its ranking systems reward and
					recommends achieving them — but it ranks the most relevant page first even when
					its experience is worse. Treat them as a small ranking signal and a large user
					one: readers who wait, mis-tap or lose their place leave.
				</Text>
				<Text size="sm" c="dimmed">
					INP replaced First Input Delay (FID) as a Core Web Vital in 2024. Time to First
					Byte and First Contentful Paint are useful diagnostics but not Core Web Vitals.
				</Text>
			</GuideSection>

			<GuideSection
				section={S.lcp}
				sources={[
					SRC.lcp,
					SRC.optimizeLcp,
					SRC.lcpLazyLoading,
					SRC.ttfb,
					SOURCES.fetchPriority,
					SOURCES.earlyHints,
					SOURCES.prerender,
				]}
			>
				<Text>
					<b>What it measures:</b> the time from starting to load the page until the
					largest image or text block in the visible area has rendered — the moment a
					reader sees the page has loaded. On a blog post it is usually the featured image
					or the headline. The clock starts at the navigation, so redirects (from an ad
					link, say) count towards LCP. The browser stops looking for a new candidate as
					soon as the reader interacts: a tap, a scroll or a key press.
				</Text>
				<Text fw={600}>What can become the LCP element</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						<Table.Tr>
							<Table.Td fw={600} w={200}>
								<Code>{"<img>"}</Code>
							</Table.Td>
							<Table.Td>
								When it is displayed; for an animated image (a GIF), its first
								frame.
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>
								<Code>{"<image>"}</Code> inside an <Code>{"<svg>"}</Code>
							</Table.Td>
							<Table.Td>Like an ordinary image.</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>
								<Code>{"<video>"}</Code>
							</Table.Td>
							<Table.Td>
								The poster or the first frame, whichever comes first.
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>A background through url()</Table.Td>
							<Table.Td>
								An element with a background image loaded through the CSS{" "}
								<Code>url()</Code> function; CSS gradients do not count.
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>A block of text</Table.Td>
							<Table.Td>
								A block element with text: a heading, a paragraph, a lead.
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Not counted</Table.Td>
							<Table.Td>
								Chromium's heuristics exclude elements with <Code>opacity: 0</Code>,
								elements that fill the whole screen (treated as background rather
								than content) and placeholders — “low-entropy” images such as a
								blurred preview or a flat colour. If a full-screen hero does not
								count, the headline can become the LCP element.
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Text fw={600}>Where the time goes</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Phase</Table.Th>
							<Table.Th>What it covers</Table.Th>
							<Table.Th>Target share</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td fw={600} w={200}>
								Time to First Byte
							</Table.Td>
							<Table.Td>
								Until the first byte of HTML arrives: redirects, DNS, connection,
								the server's own work. Good is 0.8 s or less.
							</Table.Td>
							<Table.Td className="tabular">≈ 40%</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Resource load delay</Table.Td>
							<Table.Td>
								Until the browser starts fetching the LCP image — long when it is
								lazy-loaded or only discovered by a script or stylesheet.
							</Table.Td>
							<Table.Td className="tabular">&lt; 10%</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Resource load duration</Table.Td>
							<Table.Td>
								Downloading the image itself — long when it is oversized or
								uncompressed.
							</Table.Td>
							<Table.Td className="tabular">≈ 40%</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Element render delay</Table.Td>
							<Table.Td>
								Until it is painted — held back by render-blocking CSS, synchronous
								scripts in &lt;head&gt;, long JavaScript tasks.
							</Table.Td>
							<Table.Td className="tabular">&lt; 10%</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Text size="sm">
					web.dev's target is not a hard rule but a proportion: nearly all of LCP should
					go on fetching the HTML and the resource itself. If the two “delays” together
					take more than a fifth, the browser is idling — and those are the cheapest
					fixes. A text LCP has no resource-load phases at all (unless it waits for a web
					font).
				</Text>
				<Text fw={600}>Recipes, by phase</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>Discovery.</b> Put the LCP image in the HTML as an <Code>{"<img>"}</Code>
						, not as a CSS background or a script's insertion. Where that is impossible,{" "}
						<Code>{'<link rel="preload" as="image">'}</Code>. Never give it{" "}
						<Code>loading="lazy"</Code>: that always adds delay.
					</List.Item>
					<List.Item>
						<b>Priority.</b> <Code>fetchpriority="high"</Code> on the one image that
						will be the LCP. web.dev warns that giving more than one or two images high
						priority stops helping. Images early in the HTML that are not visible (the
						carousel's next slides) get their priority lowered instead.
					</List.Item>
					<List.Item>
						<b>Connections.</b> Serving the image from the same origin as the HTML is
						best. If it is on a third-party CDN,{" "}
						<Code>{'<link rel="preconnect">'}</Code> to it so DNS, TCP and TLS happen
						ahead of time.
					</List.Item>
					<List.Item>
						<b>While the server thinks.</b> A <Code>103 Early Hints</Code> response is
						sent before the main one and tells the browser what to connect to and fetch
						early. Chrome accepts only <Code>preconnect</Code> and <Code>preload</Code>{" "}
						in it, and only for navigation requests.
					</List.Item>
					<List.Item>
						<b>Weight.</b> AVIF or WebP, compression, a size matched to the space on
						screen through <Code>srcset</Code>/<Code>sizes</Code>, and a CDN with
						caching.
					</List.Item>
					<List.Item>
						<b>Painting.</b> A small critical CSS, <Code>defer</Code> on scripts, no A/B
						testing snippets that hide the page until the experiment loads; content in
						the source HTML rather than after client-side rendering.
					</List.Item>
					<List.Item>
						<b>The next navigation.</b> Speculation Rules let the browser prerender the
						page a reader is likely to go to — its LCP will be close to zero. Chromium
						browsers support them; the others simply ignore the rules.
					</List.Item>
				</List>
				<Code block>
					{`<head>
  <link rel="preconnect" href="https://cdn.example.com">
  <!-- only if the image is referenced from CSS or JS, not from <img> -->
  <link rel="preload" as="image" href="https://cdn.example.com/hero-1200.avif" fetchpriority="high">

  <script type="speculationrules">
  {
    "prerender": [{
      "where": { "href_matches": "/blog/*" },
      "eagerness": "moderate"
    }]
  }
  </script>
</head>
<body>
  <h1>Local SEO checklist</h1>
  <img src="https://cdn.example.com/hero-1200.avif"
       srcset="https://cdn.example.com/hero-800.avif 800w,
               https://cdn.example.com/hero-1200.avif 1200w"
       sizes="(max-width: 800px) 100vw, 800px"
       width="1200" height="675" alt="Map pack results"
       fetchpriority="high">
</body>

HTTP/2 103
link: <https://cdn.example.com>; rel=preconnect
link: </css/main.css>; rel=preload; as=style`}
				</Code>
				<Text fw={600}>How to check it</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						PageSpeed Insights: the field section gives p75 LCP by URL or origin; the
						lab section names the LCP element and breaks the time into phases.
					</List.Item>
					<List.Item>
						DevTools → Performance: the LCP card names the element straight away; record
						a load with CPU and network throttling and Insights shows which phase is
						bloated.
					</List.Item>
					<List.Item>
						The CrUX API: for images there are field p75 values per phase (
						<Code>largest_contentful_paint_image_resource_load_delay</Code> and its
						neighbours) and the share of LCP resource types.
					</List.Item>
					<List.Item>
						For real visitors, RUM with attribution (see “Diagnosing the vitals: field,
						lab, attribution”).
					</List.Item>
				</List>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Symptom</Table.Th>
							<Table.Th>Likely cause</Table.Th>
							<Table.Th>What to do</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td>TTFB is fine, the load delay is large</Table.Td>
							<Table.Td>
								The image is lazy-loaded, set in CSS or injected by a script
							</Table.Td>
							<Table.Td>
								Move it into an <Code>{"<img>"}</Code> in the HTML, drop the lazy
								loading, add <Code>fetchpriority</Code> or a preload
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>The image arrives fast but paints late</Table.Td>
							<Table.Td>
								Render-blocking CSS and scripts, a page-hiding A/B snippet,
								client-side rendering
							</Table.Td>
							<Table.Td>defer, critical CSS, content in the source HTML</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Good in the lab, bad in the field</Table.Td>
							<Table.Td>
								Distant readers with no CDN, redirect chains from ad links, a
								different LCP element for signed-in readers or in an A/B test
							</Table.Td>
							<Table.Td>
								A CDN for the HTML, direct links, and RUM with attribution to see
								the real element
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<DoAvoid
					good={[
						"Serve the featured image at the size it is shown, in WebP or AVIF, compressed.",
						'Put the LCP image in the HTML as an <img>, with fetchpriority="high".',
						"Use a CDN and caching so the HTML and image arrive fast.",
						"Defer scripts and keep critical CSS small.",
						"Redirect old URLs straight to the final one.",
					]}
					bad={[
						'loading="lazy" on the featured image at the top of the post.',
						"A hero image set only as a CSS background or injected by JavaScript.",
						"Several-megabyte images scaled down by the browser.",
						"Synchronous third-party scripts in <head>.",
						"Content that only appears after client-side JavaScript runs.",
						'fetchpriority="high" on every image alike.',
					]}
				/>
				<Text size="sm">
					<b>In the tracker:</b> the LCP values from PageSpeed Insights produce “Poor LCP
					on mobile” (<Code>CWV_LCP_POOR</Code>) and “LCP needs improvement on mobile” (
					<Code>CWV_LCP_NEEDS_IMPROVEMENT</Code>), with their desktop variants. The causes
					visible in the page's code are caught by “The featured image is lazy-loaded” (
					<Code>LCP_IMAGE_LAZY_LOADED</Code>), “Scripts in &lt;head&gt; block rendering” (
					<Code>RENDER_BLOCKING_SCRIPTS</Code>) and “Images could be a lot lighter” (
					<Code>IMAGE_DELIVERY_INEFFICIENT</Code>).
				</Text>
			</GuideSection>

			<GuideSection
				section={S.inp}
				sources={[
					SRC.inp,
					SRC.optimizeInp,
					SRC.domSize,
					SOURCES.longTasks,
					SOURCES.contentVisibility,
					SOURCES.facades,
					SOURCES.useTransition,
				]}
			>
				<Text>
					<b>What it measures:</b> how long the page takes to show a visible response
					after a click, a tap or a key press, across the whole visit. The worst
					interaction is reported (ignoring one outlier per 50 interactions). Scrolling
					and hovering do not count; a visit without any interaction has no INP — which is
					why an ordinary Lighthouse lab run cannot measure it, and shows Total Blocking
					Time instead.
				</Text>
				<Text fw={600}>Where the time goes</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Phase</Table.Th>
							<Table.Th>What happens</Table.Th>
							<Table.Th>Usual causes</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td fw={600} w={170}>
								Input delay
							</Table.Td>
							<Table.Td>
								From the press to the handler starting: the main thread is busy with
								something else.
							</Table.Td>
							<Table.Td>
								Scripts downloading, parsing and compiling during the page load;
								third-party tags' timers and handlers; a previous interaction that
								has not finished.
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Processing</Table.Td>
							<Table.Td>The page's own event handlers running.</Table.Td>
							<Table.Td>
								Too much work in one handler: recomputing data, sending analytics,
								rendering a large component synchronously; reading layout right
								after changing styles (layout thrashing).
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Presentation delay</Table.Td>
							<Table.Td>
								Recalculating styles, laying out and painting the next frame.
							</Table.Td>
							<Table.Td>
								An enormous DOM; large chunks of HTML inserted by JavaScript;
								expensive CSS selectors and effects.
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Text fw={600}>The recipes</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>Respond first, work after.</b> Update the interface, yield the main
						thread with <Code>await scheduler.yield()</Code> so the browser can paint a
						frame, and only then do the rest. <Code>scheduler.yield()</Code> is in
						Chrome and Edge from 129 and Firefox from 142, but not in Safari, so a{" "}
						<Code>setTimeout</Code> fallback is needed.
					</List.Item>
					<List.Item>
						<b>Break up long tasks</b> (over 50 ms): in a loop, yield not after every
						item but once about 50 ms have passed since the last yield.
					</List.Item>
					<List.Item>
						<b>Debounce input.</b> Run a search or filter after a pause in typing, not
						on every letter.
					</List.Item>
					<List.Item>
						<b>Less work to paint.</b> Shrink the DOM (surplus wrappers, whole long
						lists); for blocks below the fold use <Code>content-visibility: auto</Code>,
						so the browser does not render them until they approach the viewport.
					</List.Item>
					<List.Item>
						<b>Heavy computation into a Web Worker</b>, off the main thread.
					</List.Item>
					<List.Item>
						<b>Façades for third-party widgets.</b> Instead of an embedded video, chat
						or map, show a static image with a button first and load the real widget on
						click.
					</List.Item>
					<List.Item>
						<b>React:</b> wrap non-urgent updates in <Code>startTransition</Code> (
						<Code>useTransition</Code>) — React can interrupt them for new input, and
						the field stays responsive.
					</List.Item>
				</List>
				<Code block>
					{`function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0)); // Safari and older browsers
}

menuButton.addEventListener("click", async () => {
  menu.classList.toggle("open");   // visible response first
  await yieldToMain();             // let the browser paint the frame
  sendAnalytics("menu_open");      // the rest can wait
});

async function processAll(items) {
  let deadline = performance.now() + 50;
  for (const item of items) {
    process(item);
    if (performance.now() > deadline) {
      await yieldToMain();
      deadline = performance.now() + 50;
    }
  }
}

let timer;
searchInput.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => runSearch(searchInput.value), 300);
});

/* CSS */
.comments, .related-posts {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px; /* reserved height, so the scrollbar does not jump */
}

// React
const [isPending, startTransition] = useTransition();
function onChange(e) {
  setQuery(e.target.value);                          // urgent: the input itself
  startTransition(() => setFilter(e.target.value)); // interruptible: the heavy list
}`}
				</Code>
				<Text fw={600}>How to check it</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						Field INP from PageSpeed Insights or the CrUX API; pages with little traffic
						often have none at all.
					</List.Item>
					<List.Item>
						DevTools → Performance with CPU throttling: click the menu, the search, the
						buttons, the cookie banner. The INP card and the Interactions tab show the
						worst interaction and its three phases.
					</List.Item>
					<List.Item>
						Record a trace with that interaction and find the long task under it: whose
						script, and which function.
					</List.Item>
					<List.Item>
						If it cannot be reproduced in the lab, use RUM with attribution and Long
						Animation Frames (see “Diagnosing the vitals: field, lab, attribution”).
					</List.Item>
				</List>
				<DoAvoid
					good={[
						"Break long JavaScript tasks into small ones and yield to the main thread.",
						"Show the visual response first, do the rest of the work after.",
						"Keep the DOM small; render off-screen content lazily.",
						"Audit third-party scripts (ads, chat, analytics, A/B testing) and load them late.",
					]}
					bad={[
						"Heavy scripts running during load, when readers start to tap.",
						"Handlers that read layout right after changing styles (layout thrashing).",
						"Thousands of elements, or large chunks of HTML rendered by JavaScript.",
						"A search that rebuilds the results list on every key press.",
					]}
				/>
				<Text size="sm">
					<b>In the tracker:</b> the INP values from PageSpeed Insights produce “Poor INP
					on mobile” (<Code>CWV_INP_POOR</Code>), “INP needs improvement on mobile” (
					<Code>CWV_INP_NEEDS_IMPROVEMENT</Code>) and their desktop variants. From the
					page's code, the risk of a presentation delay shows up as “A large DOM” (
					<Code>DOM_SIZE_LARGE</Code>, more than 1400 elements in &lt;body&gt;).
				</Text>
			</GuideSection>

			<GuideSection
				section={S.cls}
				sources={[
					SRC.cls,
					SRC.optimizeCls,
					SRC.bfcache,
					SOURCES.debugLayoutShifts,
					SOURCES.sizeAdjust,
					SOURCES.fontBestPractices,
				]}
			>
				<Text>
					<b>What it measures:</b> how much visible content moves unexpectedly. Each shift
					scores how much of the screen moved times how far; shifts less than a second
					apart are grouped into windows of at most 5 seconds, and CLS is the worst
					window. It has no unit. A shift within half a second of a reader's tap, click or
					key press does not count — the reader caused it (scrolling gives no such
					protection).
				</Text>
				<Text>
					Only a change in the start position of an element that was already visible is a
					shift. A new element appearing, or an element resizing, is not a shift in itself
					unless it moves its neighbours. Animating with <Code>transform</Code> (
					<Code>translate()</Code>, <Code>scale()</Code>) causes no layout shifts, while
					animating <Code>top</Code>, <Code>left</Code>, <Code>width</Code> or{" "}
					<Code>height</Code> does.
				</Text>
				<Text fw={600}>How to find what is shifting</Text>
				<Text>
					Paste an observer into the DevTools console: it logs every shift, the elements
					that moved and their rectangles before and after. <Code>buffered: true</Code>{" "}
					also returns the shifts that happened before the code ran.
				</Text>
				<Code block>
					{`new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.hadRecentInput) continue; // caused by the reader's own input
    for (const source of entry.sources) {
      console.log(entry.value.toFixed(4), source.node, source.previousRect, source.currentRect);
    }
  }
}).observe({ type: "layout-shift", buffered: true });`}
				</Code>
				<List size="sm" spacing={4}>
					<List.Item>
						DevTools → Performance: the Layout shifts tab under the live metrics, and in
						a recorded trace the Layout shifts track and the “Layout shift culprits”
						hint in Insights.
					</List.Item>
					<List.Item>
						DevTools → Rendering → Layout Shift Regions highlights the shifting areas on
						the page itself.
					</List.Item>
					<List.Item>
						Scroll the page to the end: Lighthouse only sees the shifts during load,
						above the fold, while field CLS accumulates over the whole visit.
					</List.Item>
				</List>
				<Text fw={600}>Fonts</Text>
				<Text>
					When a web font arrives after the fallback and takes a different amount of
					space, the text reflows. Two routes: <Code>font-display: optional</Code> — a
					late font is simply not used for this view, so there is no shift; or{" "}
					<Code>font-display: swap</Code> plus a fallback tuned to the web font's metrics
					with <Code>size-adjust</Code>, <Code>ascent-override</Code>,{" "}
					<Code>descent-override</Code> and <Code>line-gap-override</Code> — then the
					lines barely move when the swap happens. A font that matters is worth preloading
					(with the <Code>crossorigin</Code> attribute).
				</Text>
				<Code block>
					{`@font-face {
  font-family: "Inter-fallback";
  src: local("Arial");
  /* values are tuned for each font pair; tools generate them */
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "Inter", "Inter-fallback", sans-serif;
}`}
				</Code>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Symptom</Table.Th>
							<Table.Th>Likely cause</Table.Th>
							<Table.Th>What to do</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td>CLS ≈ 0 in the lab, bad in the field</Table.Td>
							<Table.Td>
								Shifts after the load: an infinite feed, ads inserted on scroll,
								lazy images and iframes with no dimensions
							</Table.Td>
							<Table.Td>
								Reserve the space (min-height, aspect-ratio) and put new elements
								below what is being read
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>The article jumps down in the first seconds</Table.Td>
							<Table.Td>
								A cookie or newsletter banner inserted into the flow above the
								content
							</Table.Td>
							<Table.Td>
								Show the banner over the content (position: fixed) or reserve the
								space in advance
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>The text reflows during load</Table.Td>
							<Table.Td>A font swap to different metrics</Table.Td>
							<Table.Td>font-display: optional, or a tuned fallback font</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Shifts when going Back</Table.Td>
							<Table.Td>The page misses the bfcache and loads again</Table.Td>
							<Table.Td>
								Check DevTools → Application → Back/forward cache and remove the
								blockers
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<DoAvoid
					good={[
						"Give every image, video and embed width and height (or an aspect-ratio).",
						"Reserve space for ads, banners and embeds before they load.",
						"Put late-loading content below what is being read, or overlay it.",
						"Animate with transform, not top/left/height.",
						"Match the fallback font's size to the web font (size-adjust), or use font-display: optional.",
						"Let pages use the back/forward cache, so returning to them does not reflow them.",
					]}
					bad={[
						"Images without dimensions.",
						"Cookie banners, newsletter bars or ads that push the article down.",
						"Content inserted above the reader's position without them asking.",
						"Web fonts that swap in at a different size and reflow the text.",
					]}
				/>
				<Text size="sm">
					<b>In the tracker:</b> the CLS values from PageSpeed Insights produce “Poor CLS
					on mobile” (<Code>CWV_CLS_POOR</Code>), “CLS needs improvement on mobile” (
					<Code>CWV_CLS_NEEDS_IMPROVEMENT</Code>) and their desktop variants. The bfcache
					has a check of its own, “Cache-Control: no-store keeps the page out of the
					back/forward cache” (<Code>BFCACHE_BLOCKED_BY_NO_STORE</Code>). Image dimensions
					the tracker does not check.
				</Text>
			</GuideSection>

			<CwvDiagnosticsSection />

			<GuideSection
				section={S.speedHere}
				sources={[SRC.pageSpeedInsights, SRC.coreWebVitals]}
			>
				<Text>
					After each crawl, every page is measured with Google PageSpeed Insights twice,
					for <b>mobile</b> and for <b>desktop</b>, each at most once every 24 hours. The
					list's badges and the score read mobile. For each metric the tracker keeps the
					best evidence Google has, and says whose it is:
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						{CWV_SOURCES.map((source) => (
							<Table.Tr key={source}>
								<Table.Td fw={600} w={220}>
									{cwvSourceLabel(source)}
								</Table.Td>
								<Table.Td>{SOURCE_MEANING[source]}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Group gap="xs">
					{CWV_BANDS.map((band) => (
						<Badge key={band} color={cwvBandColor[band]} variant="light">
							{cwvBandLabel[band]}
						</Badge>
					))}
					<Badge color={cwvBandColor.noData} variant="light">
						no data
					</Badge>
				</Group>
				<List size="sm" spacing={4}>
					<List.Item>
						A metric outside the good band becomes an issue: <b>Improvement</b> while it
						needs improvement, <b>Important</b> once it is poor. These issues never
						change the SEO score.
					</List.Item>
					<List.Item>
						The <b>performance score</b> under the Speed block is Lighthouse's lab score
						(0–100) from the same run — a caption, not a Core Web Vital.
					</List.Item>
					<List.Item>
						A grey INP badge usually means Google has no real-visitor data: the page and
						the site have too little Chrome traffic.
					</List.Item>
					<List.Item>
						States you may see: <i>In queue</i> (waiting its turn), <i>Measuring…</i>{" "}
						(Google is testing it), <i>Couldn't measure</i> (Google could not load the
						page), <i>Not measured</i> (never queued), and an old measurement kept with
						a note when a refresh failed.
					</List.Item>
					{Object.values(pageSpeedAvailabilityCopy).map(
						(copy) =>
							copy && (
								<List.Item key={copy.short}>
									<b>{copy.short}</b> — {copy.notice}
								</List.Item>
							),
					)}
				</List>
				<Text size="sm" c="dimmed">
					Not measured here: First Contentful Paint as a separate number, and the
					site-wide Core Web Vitals report in Search Console. Desktop is measured beside
					mobile, and Time to First Byte is shown on the page's Speed block.
				</Text>
			</GuideSection>
		</GuidePart>
	);
}
