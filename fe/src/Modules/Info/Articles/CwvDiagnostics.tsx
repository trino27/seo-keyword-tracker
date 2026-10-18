import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

const SOURCES = {
	labField: {
		title: "web.dev: Why lab and field data can be different (and what to do about it)",
		url: "https://web.dev/articles/lab-and-field-data-differences",
	},
	crux: {
		title: "Chrome for Developers: Overview of CrUX",
		url: "https://developer.chrome.com/docs/crux",
	},
	cruxMethodology: {
		title: "Chrome for Developers: CrUX methodology",
		url: "https://developer.chrome.com/docs/crux/methodology",
	},
	cruxApi: {
		title: "Chrome for Developers: CrUX API",
		url: "https://developer.chrome.com/docs/crux/api",
	},
	cruxHistoryApi: {
		title: "Chrome for Developers: CrUX History API",
		url: "https://developer.chrome.com/docs/crux/history-api",
	},
	cwvReport: {
		title: "Search Console Help: Core Web Vitals report",
		url: "https://support.google.com/webmasters/answer/9205520",
	},
	slowInteractions: {
		title: "web.dev: Find slow interactions in the field",
		url: "https://web.dev/articles/find-slow-interactions-in-the-field",
	},
	loaf: {
		title: "Chrome for Developers: Long Animation Frames API",
		url: "https://developer.chrome.com/docs/web-platform/long-animation-frames",
	},
	webVitalsLibrary: {
		title: "GitHub: GoogleChrome/web-vitals",
		url: "https://github.com/GoogleChrome/web-vitals",
	},
	devtoolsPerformance: {
		title: "Chrome DevTools: Performance panel: Analyze your website's performance",
		url: "https://developer.chrome.com/docs/devtools/performance/overview",
	},
	spa: {
		title: "web.dev: How SPA architectures affect Core Web Vitals",
		url: "https://web.dev/articles/vitals-spa-faq",
	},
	softNavigations: {
		title: "Chrome for Developers: Measuring soft navigations",
		url: "https://developer.chrome.com/docs/web-platform/soft-navigations-experiment",
	},
} satisfies Record<string, ISeoIssueSource>;

/** Field versus lab, where CrUX comes from, and how to find the cause of a bad metric. */
export function CwvDiagnosticsSection() {
	return (
		<GuideSection
			section={S.cwvDiagnostics}
			sources={[
				SOURCES.labField,
				SOURCES.crux,
				SOURCES.cruxMethodology,
				SOURCES.cruxApi,
				SOURCES.cruxHistoryApi,
				SOURCES.cwvReport,
				SOURCES.slowInteractions,
				SOURCES.loaf,
				SOURCES.webVitalsLibrary,
				SOURCES.devtoolsPerformance,
				SOURCES.spa,
				SOURCES.softNavigations,
				SRC.pageSpeedInsights,
			]}
		>
			<Text>
				Every metric comes in two kinds of data. <b>Field data</b> (RUM) is collected from
				real visitors: thousands of devices, networks and situations, gathered into a
				distribution. <b>Lab data</b> is one Lighthouse run, or one DevTools recording, on
				one device, one network, from one place. In Search and in the Search Console report,
				Google goes by the field data of the Chrome UX Report (CrUX) alone. The lab is there
				to reproduce and explain a problem, but the field is what grades you: a green
				Lighthouse does not undo a poor INP for real readers.
			</Text>

			<Text fw={600}>Why the field and the lab disagree</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Factor</Table.Th>
						<Table.Th>Field (CrUX, RUM)</Table.Th>
						<Table.Th>Lab (Lighthouse)</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					<Table.Tr>
						<Table.Td fw={600}>Devices and networks</Table.Td>
						<Table.Td>
							The whole range: flagships down to cheap Android phones on slow mobile
							data; the result is the 75th percentile over 28 days.
						</Table.Td>
						<Table.Td>
							One emulated device, one configured network, one run; the result wanders
							from run to run.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Cache</Table.Td>
						<Table.Td>
							Returning visitors arrive with a warm cache; restores from the
							back/forward cache (bfcache) are near-instant and count too.
						</Table.Td>
						<Table.Td>
							Normally a cold cache; bfcache is not counted. That is why a lab LCP is
							often worse than the field one.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Interactions</Table.Td>
						<Table.Td>
							INP comes from real clicks and taps; CLS covers the page's whole life,
							scrolling included; LCP stops updating after the first tap, scroll or
							key press.
						</Table.Td>
						<Table.Td>
							Nobody clicks or scrolls: there is no INP, and CLS covers only the
							shifts during load, above the fold.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Content</Table.Td>
						<Table.Td>
							Signed-in state, personalisation, A/B tests, targeted ads, consent
							banners — different people get a different LCP element and different
							shifts.
						</Table.Td>
						<Table.Td>
							An anonymous, “clean” user with no personalisation; some ads and banners
							may never appear at all.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Geography</Table.Td>
						<Table.Td>
							Readers in distant regions get a large TTFB where the HTML is not served
							from a CDN near them.
						</Table.Td>
						<Table.Td>A test from a single data centre.</Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>
			<Text>
				<b>TBT is the lab's stand-in for INP.</b> Total Blocking Time adds up how long long
				tasks blocked the main thread during load. It helps find heavy JavaScript, but
				predicts INP poorly: TBT does not know when readers actually click (if everyone
				waits for the load to finish, INP can be good with a bad TBT), and it does not see
				slow handlers that fire later. Closer to the field is Lighthouse's <b>timespan</b>{" "}
				mode (and user flows): you record a stretch of time with clicks in it, and the
				report shows the shifts and the JavaScript that ran. But the actions in it are
				yours, not your readers'.
			</Text>

			<Text fw={600}>CrUX: where Google's field data comes from</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					<Table.Tr>
						<Table.Td fw={600} w={200}>
							Who is in the sample
						</Table.Td>
						<Table.Td>
							Chrome users on Windows, macOS, ChromeOS, Linux and Android who have
							opted in to usage statistics and sync their history without a sync
							passphrase. Not included: Chrome on iOS, in-app WebViews, other Chromium
							browsers, and Safari and Firefox.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Window and statistic</Table.Td>
						<Table.Td>
							A rolling 28-day window; the headline value is the 75th percentile
							(p75): 75% of page loads got that value or better. Plus a histogram over
							the three bands.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>The inclusion threshold</Table.Td>
						<Table.Td>
							A page or origin has to be publicly reachable and popular enough; Google
							does not publish the exact threshold. Origin-level data often exists
							where URL-level data does not.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Devices</Table.Td>
						<Table.Td>
							<Code>PHONE</Code>, <Code>DESKTOP</Code> and <Code>TABLET</Code>{" "}
							separately, or all together.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>CrUX API</Table.Td>
						<Table.Td>
							The current 28-day window by URL or origin. Updated daily (around 04:00
							UTC, about two days behind), free, 150 queries a minute per Google Cloud
							project. It carries the image LCP phase breakdown (p75 only).
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>CrUX History API</Table.Td>
						<Table.Td>
							Weekly points (updated on Mondays): 25 by default, 40 at most. Each
							point is the same 28 days, so neighbouring points overlap and the curve
							is smoothed.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>BigQuery</Table.Td>
						<Table.Td>
							Monthly tables, published on the second Tuesday of the following month;
							origin level only, but with country breakdowns.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>CrUX Vis</Table.Td>
						<Table.Td>
							A dashboard over the History API: up to 40 weeks of trend by origin or
							URL, by device type. The quickest way to see when a metric went bad.
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td fw={600}>Search Console</Table.Td>
						<Table.Td>
							The Core Web Vitals report groups similar URLs; a group's status comes
							from its worst metric, separately for mobile and desktop, at p75. Where
							a group has little data, the origin's is used. After a fix, the report's
							validation watches the CrUX data for 28 days.
						</Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>
			<Text fw={600}>Example: a CrUX API request</Text>
			<Code block>
				{`curl -s "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/blog/local-seo/",
    "formFactor": "PHONE",
    "metrics": ["largest_contentful_paint", "interaction_to_next_paint", "cumulative_layout_shift"]
  }'

# fragment of the response
"interaction_to_next_paint": {
  "histogram": [
    { "start": 0, "end": 200, "density": 0.78 },
    { "start": 200, "end": 500, "density": 0.15 },
    { "start": 500, "density": 0.07 }
  ],
  "percentiles": { "p75": 236 }
}`}
			</Code>
			<Text size="sm">
				Here p75 INP is 236 ms — “needs improvement” — although 78% of interactions are
				good: the tail decides. CLS values arrive as strings (<Code>"0.05"</Code>). If there
				is no data for the URL, the API answers with an error — swap <Code>"url"</Code> for{" "}
				<Code>"origin"</Code>. For a trend, send the same request to{" "}
				<Code>records:queryHistoryRecord</Code>.
			</Text>

			<Text fw={600}>RUM with attribution: not only “how much” but “why”</Text>
			<Text>
				CrUX says whether there is a problem, not what causes it. Your own field data
				answers that: Google's <Code>web-vitals</Code> library, in its{" "}
				<Code>web-vitals/attribution</Code> build, attaches a breakdown to every value —
				which element, which phase, which script. INP and CLS are sent when the page goes
				into the background (by then they are final), and after a bfcache restore the
				metrics are measured afresh, as for a new view.
			</Text>
			<Code block>
				{`import { onCLS, onINP, onLCP } from "web-vitals/attribution";

const send = (data) =>
  navigator.sendBeacon("/rum", JSON.stringify({ page: location.pathname, ...data }));

onLCP(({ value, rating, attribution: a }) =>
  send({
    metric: "LCP", value, rating,
    element: a.target,                 // CSS selector of the LCP element
    ttfb: a.timeToFirstByte,
    loadDelay: a.resourceLoadDelay,
    loadDuration: a.resourceLoadDuration,
    renderDelay: a.elementRenderDelay,
  }),
);

onINP(({ value, rating, attribution: a }) => {
  // the longest script in the frames that overlapped the interaction
  const scripts = a.longAnimationFrameEntries.flatMap((frame) => frame.scripts);
  const top = scripts.toSorted((x, y) => y.duration - x.duration)[0];
  send({
    metric: "INP", value, rating,
    target: a.interactionTarget,       // e.g. "button.menu-toggle"
    type: a.interactionType,           // "pointer" or "keyboard"
    inputDelay: a.inputDelay,
    processing: a.processingDuration,
    presentation: a.presentationDelay,
    script: top && { url: top.sourceURL, fn: top.sourceFunctionName, invoker: top.invoker },
  });
});

onCLS(({ value, rating, attribution: a }) =>
  send({ metric: "CLS", value, rating, shifted: a.largestShiftTarget, at: a.largestShiftTime }),
);`}
			</Code>
			<Text size="sm">
				Store only the summary (the selector, the phases, the script's address), not the
				whole entries — they are large. Script-level attribution comes from Chromium
				browsers only: Firefox and Safari have no Long Animation Frames API.
			</Text>

			<Text fw={600}>DevTools and Long Animation Frames</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>The Performance panel</b> shows live local LCP and CLS straight away, and INP
					once you have clicked. It can be tied to the CrUX field data so you can compare
					your numbers with what users get; DevTools will suggest the conditions to set.
				</List.Item>
				<List.Item>
					<b>Throttling</b> the CPU (a several-fold slowdown) and the network (Fast 4G,
					say) brings a fast laptop closer to an average phone. Without it, slow handlers
					are invisible on a powerful machine.
				</List.Item>
				<List.Item>
					The <b>Interactions</b> and <b>Layout shifts</b> tabs under the metric cards
					list the interactions with their phases and the shifts with their elements. A
					recorded trace has a Layout shifts track, and Insights has “Layout shift
					culprits” with the likely causes.
				</List.Item>
				<List.Item>
					<b>The Long Animation Frames API</b> (Chrome 123+) reports frames whose paint
					was held up for more than 50 ms and lists the scripts in them:{" "}
					<Code>sourceURL</Code>, <Code>sourceFunctionName</Code>, <Code>invoker</Code> (
					<Code>BUTTON#update.onclick</Code>, for instance), <Code>duration</Code>,{" "}
					<Code>forcedStyleAndLayoutDuration</Code>. It is the main tool for finding the
					causes of a bad INP in the field: web.dev advises collecting frames with a{" "}
					<Code>blockingDuration</Code> of 100 ms or more that overlap an interaction in
					time.
				</List.Item>
			</List>
			<Code block>
				{`new PerformanceObserver((list) => {
  for (const frame of list.getEntries()) {
    if (frame.blockingDuration < 100) continue;
    for (const s of frame.scripts) {
      console.log(Math.round(s.duration), s.invoker, s.sourceURL, s.sourceFunctionName);
    }
  }
}).observe({ type: "long-animation-frame", buffered: true });`}
			</Code>

			<Text fw={600}>Single-page applications</Text>
			<Text>
				CrUX measures the metrics on a <b>hard navigation</b> — a full document load — and
				attributes them to the URL the load started from. Transitions inside an SPA through
				the History API are not separate loads: only the first page has an LCP, while INP
				and CLS accumulate across the whole visit and land on the landing URL. Chrome has
				learned to measure soft navigations: from Chrome 151 the new APIs are on by default,
				and <Code>web-vitals</Code> can report metrics per route (
				<Code>reportSoftNavs: true</Code>). But Firefox and Safari do not support them, and
				Google has not yet said how soft navigations will reach CrUX. For now it is a tool
				for your own RUM, not something Search sees.
			</Text>

			<Text fw={600}>A scenario: INP is bad in the field, green in the lab</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>Confirm it in the field.</b> PageSpeed Insights or the CrUX API (
					<Code>PHONE</Code>) — p75 INP above 200 ms; CrUX Vis — the week the rise began
					(often a release or a new third-party tag). Search Console — which URL groups
					are affected.
				</List.Item>
				<List.Item>
					<b>Understand why the lab is silent.</b> Lighthouse clicks nothing, TBT measures
					only the load, and your computer is faster than your readers' phones. This is
					not bad data, it is a blind spot of the method.
				</List.Item>
				<List.Item>
					<b>Turn on RUM with attribution</b> (the code above) and collect a few days of
					data. Group the bad INP values by <Code>interactionTarget</Code>: usually one to
					three elements account for most of it — the menu button, the search box, “Accept
					cookies”.
				</List.Item>
				<List.Item>
					<b>See which phase dominates.</b> A large input delay means the main thread was
					busy with something else at that moment (often loading scripts; the{" "}
					<Code>loadState</Code> field will say). A long processing time means a heavy
					handler. A large presentation delay means an enormous DOM or an expensive layout
					recalculation.
				</List.Item>
				<List.Item>
					<b>Find the script through LoAF.</b> The longest script in the frame gives the
					file and the function: a click handler in an A/B testing tag or a chat widget,
					say, rather than in the site's own code.
				</List.Item>
				<List.Item>
					<b>Reproduce it in DevTools.</b> Throttle the CPU, click the same element,
					record a trace and find the long task under the interaction.
				</List.Item>
				<List.Item>
					<b>Fix it and check.</b> Yield to the main thread, defer the third-party widget
					or replace it with a façade, shrink the DOM (the recipes are in “INP —
					responsiveness”). RUM shows the effect in a day or two; CrUX and Search Console
					only once the 28-day window has filled with new data, so about four weeks.
				</List.Item>
			</List>

			<Text fw={600}>How this relates to the tracker</Text>
			<Text>
				The tracker takes its data from PageSpeed Insights, and for every metric it names
				the source: this page, the whole site, or the lab test (in detail in “How speed is
				measured here”). The findings “Poor INP on mobile” (<Code>CWV_INP_POOR</Code>) and
				its relatives are built on those values. Where the source is the lab test there is
				no INP: that is expected, not a failure. Attribution and RUM the tracker does not
				collect — if a metric is bad, the next step is the scenario above.
			</Text>
		</GuideSection>
	);
}
