import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { QualitySpamSection } from "./QualitySpam";
import { GuideSection } from "../GuideSection/GuideSection";
import { GuidePart } from "../GuidePart/GuidePart";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** Sources only this part cites; each was opened and read against its sentence on 2026-10-12. */
const SOURCES = {
	pageRankPaper: {
		title: "Sergey Brin, Lawrence Page: The Anatomy of a Large-Scale Hypertextual Web Search Engine (1998)",
		url: "http://infolab.stanford.edu/~backrub/google.html",
	},
	evolvingNofollow: {
		title: "Google Search Central Blog: Evolving “nofollow” – new ways to identify the nature of links",
		url: "https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify",
	},
	disavow: {
		title: "Search Console Help: Disavow links to your site",
		url: "https://support.google.com/webmasters/answer/2648487",
	},
	linksReport: {
		title: "Search Console Help: Links report",
		url: "https://support.google.com/webmasters/answer/9049606",
	},
	march2024: {
		title: "Google Search Central Blog: What web creators should know about our March 2024 core update and new spam policies",
		url: "https://developers.google.com/search/blog/2024/03/core-update-spam-policies",
	},
	spamUpdates: {
		title: "Google Search Central: Google Search spam updates and your site",
		url: "https://developers.google.com/search/updates/spam-updates",
	},
	statusDashboard: {
		title: "Google Search Status Dashboard",
		url: "https://status.search.google.com/",
	},
	googleCommonCrawlers: {
		title: "Google Crawling Infrastructure: Google's common crawlers (Google-Extended)",
		url: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
	},
	searchConsoleMetrics: {
		title: "Search Console Help: What are impressions, position, and clicks?",
		url: "https://support.google.com/webmasters/answer/7042828",
	},
} satisfies Record<string, ISeoIssueSource>;

const REL_VALUES = [
	{
		rel: 'rel="sponsored"',
		use: "Advertising, sponsorship, any payment — money, goods, a service, a free product for a review with a link.",
		google: "A hint. Google prefers sponsored, but nofollow is acceptable for paid links too and is read the same way.",
	},
	{
		rel: 'rel="ugc"',
		use: "Links in users' content: comments, forums, profiles.",
		google: "A hint. The attribute can be dropped from links by trusted, long-standing contributors.",
	},
	{
		rel: 'rel="nofollow"',
		use: "Where the other values do not fit and you do not want Google to associate your site with the page, or to crawl it through this link.",
		google: "A hint for ranking since September 2019, and for crawling and indexing since 1 March 2020. Not needed on your own pages: to stop crawling, use robots.txt.",
	},
] as const;

const LINK_SCENARIOS = [
	{
		symptom:
			"Hundreds of links from unfamiliar domains in another language; positions unchanged",
		cause: "Automated spam, or an attempt at “negative SEO”.",
		act: "Usually nothing: Google generally ignores known spam sites. There is no need to disavow without a manual action.",
	},
	{
		symptom: "A partner published a paid review with an unmarked link",
		cause: "A link passing credit for money — a link scheme.",
		act: 'Ask them to add rel="sponsored" (or nofollow).',
	},
	{
		symptom: "Positions fell with a link spam update, with no manual action",
		cause: "The systems neutralised the effect of the spam links.",
		act: "The lost benefit cannot be won back — not by removing the links, not by disavowing. What is left is earning natural links and strengthening the content.",
	},
	{
		symptom: "A manual action for “Unnatural links to your site”",
		cause: "Bought links or schemes — yours, or a previous contractor's.",
		act: "Export the links (Top linking sites and the latest links), get them removed or marked up with rel, disavow what remains, then request a review.",
	},
] as const;

const UPDATE_KINDS = [
	{
		kind: "Core update",
		who: "The algorithms",
		notice: "Announced on the Search Status Dashboard; the site is told nothing",
		recover:
			"Improve the site for people; the effect takes days to months, sometimes until the next update",
	},
	{
		kind: "Spam update (SpamBrain)",
		who: "The algorithms",
		notice: "Announced on the Search Status Dashboard; the site is told nothing",
		recover:
			"Remove the violations; the systems take months to “see” it. After a link spam update the links' benefit does not return",
	},
	{
		kind: "Manual action",
		who: "A Google reviewer",
		notice: "The Manual actions report and the Search Console message centre",
		recover: "Fix every affected page and file a reconsideration request",
	},
] as const;

const AI_CONTROLS = [
	{
		control: "noindex",
		effect: "The page is not in Search at all — so not in AI Overviews or AI Mode either.",
	},
	{
		control: "nosnippet",
		effect: "The page stays in the index, but its text is not shown in snippets and not used as a direct source for AI Overviews and AI Mode.",
	},
	{
		control: "max-snippet:[number]",
		effect: "Limits how many characters of text may be shown and used as a direct source for the AI features. It does not cover what you have allowed separately — the page's structured data, for instance.",
	},
	{
		control: "data-nosnippet",
		effect: "An attribute on a span, div or section: that fragment appears in no snippet and no AI answer, while the rest of the page may.",
	},
	{
		control: "Google-Extended (robots.txt)",
		effect: "Controls only Gemini training and grounding in the Gemini and Vertex AI apps. It does not affect Search, AI Overviews and AI Mode included, and is not a ranking signal.",
	},
] as const;

const INTENTS = [
	{
		intent: "Informational",
		wants: "To learn or get an answer",
		example: "how to write a meta description",
		page: "Guide, how-to, explainer",
	},
	{
		intent: "Commercial",
		wants: "To compare before buying",
		example: "best seo audit tools",
		page: "Comparison, review, list",
	},
	{
		intent: "Transactional",
		wants: "To act or buy now",
		example: "seo audit service price",
		page: "Product, pricing or sign-up page",
	},
	{
		intent: "Navigational",
		wants: "To reach a known site",
		example: "search console login",
		page: "That site's own page",
	},
] as const;

const SEARCH_CONSOLE = [
	{
		report: "Performance",
		tells: "The real queries a site appears for, with clicks, impressions, CTR (clicks ÷ impressions) and average position, by page, country and device.",
	},
	{
		report: "Page indexing",
		tells: "Which pages are indexed, which are not, and why — the place to confirm a noindex or canonical problem.",
	},
	{
		report: "URL Inspection",
		tells: "One URL's index status, the canonical Google chose, a live test, and a request to recrawl.",
	},
	{
		report: "Core Web Vitals",
		tells: "Field data grouped across the whole site, for mobile and desktop.",
	},
	{ report: "Sitemaps", tells: "Submit a sitemap and see how Google read it." },
	{ report: "Manual actions", tells: "Whether a reviewer has penalised the site, and where." },
] as const;

/** Part six: the SEO this tracker does not measure, so a reader knows where its view ends. */
export function BeyondTracker() {
	return (
		<GuidePart
			title="Beyond this tracker"
			lead="What also decides rankings but this tracker does not analyse — so you know where its picture ends and what to look at next."
		>
			<GuideSection
				section={S.keywordResearch}
				sources={[SRC.starterGuide, SRC.searchIntent, SRC.helpfulContent]}
			>
				<Text>
					The tracker infers what each post <i>is</i> about. Keyword research asks the
					question before writing: what do people search, how often, and what do they want
					when they do? It needs search data — query volumes from a keyword tool, and the
					queries you already appear for in Search Console.
				</Text>
				<Text fw={600}>Search intent</Text>
				<Text>
					Every query has a purpose, and the page that ranks is the one that serves it.
					Look at the current top results: the content type (post, product page, video),
					its format (how-to, list, comparison) and its angle (beginner, recent year) show
					what Google believes the searcher wants.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Intent</Table.Th>
							<Table.Th>The searcher wants</Table.Th>
							<Table.Th>Example query</Table.Th>
							<Table.Th>Page that fits</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{INTENTS.map((row) => (
							<Table.Tr key={row.intent}>
								<Table.Td fw={600}>{row.intent}</Table.Td>
								<Table.Td>{row.wants}</Table.Td>
								<Table.Td>
									<Code>{row.example}</Code>
								</Table.Td>
								<Table.Td>{row.page}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<DoAvoid
					good={[
						"Write in the words your readers use — Google's starter guide asks you to anticipate them.",
						"Match the format of what already ranks for the query.",
						"Target specific, longer phrases where a small site can answer best.",
						"One page per intent; link related pages to each other.",
					]}
					bad={[
						"Writing a blog post for a query whose results are all product pages.",
						"Chasing high-volume terms the site cannot credibly answer.",
						"Choosing topics only because they trend, not because they fit your readers.",
					]}
				/>
			</GuideSection>

			<GuideSection
				section={S.links}
				sources={[
					SRC.rankingSystems,
					SOURCES.pageRankPaper,
					SRC.qualifyLinks,
					SOURCES.evolvingNofollow,
					SRC.crawlableLinks,
					SRC.spamPolicies,
					SOURCES.linksReport,
					SOURCES.disavow,
					SOURCES.march2024,
					SOURCES.spamUpdates,
					SRC.manualActions,
				]}
			>
				<Text>
					Links from other sites (backlinks) are one of the signals Google's link analysis
					and PageRank use to judge what a page is about and how useful it is. The tracker
					reads only links on your own pages; it cannot see who links to you. Backlink
					tools and Search Console's Links report can.
				</Text>

				<Text fw={600}>The intuition behind PageRank</Text>
				<Text>
					PageRank describes a “random surfer”: they open a random page, follow random
					links, and occasionally, bored, start again. A page's PageRank is the
					probability of finding them on it. From which the main point follows: every page
					divides its weight among its outgoing links, so a link from a page that is much
					linked to and links out little passes more than a link from a forgotten
					directory page with a hundred links on it. What matters is not the number of
					links but the weight of those linking. Google says PageRank has changed a great
					deal since, but is still part of the core ranking systems; the exact formula and
					values are not published.
				</Text>
				<Code block>
					{`PR(A) = (1 − d) + d · ( PR(T1)/C(T1) + … + PR(Tn)/C(Tn) )

T1…Tn  pages that link to A
C(T)   number of links going out of page T
d      damping factor: the chance the surfer keeps clicking (0.85 in the 1998 paper)`}
				</Code>
				<Text>
					<b>Internal PageRank.</b> The same model works inside a site: external links
					usually land on the home page and a few popular pieces, and from there the
					weight flows along the internal links. A page deep in the archive, or an orphan,
					gets little — both as a signal and as a reason to crawl. So links from your
					most-cited pages (the Links report's Top linked pages) to the pages that matter
					are the quickest way to spread the weight you have earned. Click depth, and why
					a nofollow on your own links does not “redistribute” weight, are in “Internal
					and external links”.
				</Text>
				<Text>
					<b>Anchor text.</b> Google reads a link's text as a description of the page it
					points to, which is exactly why it does not ignore nofollowed links entirely.
					You do not choose other people's anchors, and a natural profile is varied: the
					brand name, the URL, descriptive phrases. Identical keyword anchors at scale in
					guest posts, press releases and forum signatures are what the spam policies call
					link spam. To see yours: Top linking text in the Links report.
				</Text>

				<Text fw={600}>The rel attributes: hints, not orders</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={150}>Attribute</Table.Th>
							<Table.Th>When to use it</Table.Th>
							<Table.Th>How Google reads it</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{REL_VALUES.map((row) => (
							<Table.Tr key={row.rel}>
								<Table.Td>
									<Code>{row.rel}</Code>
								</Table.Td>
								<Table.Td>{row.use}</Table.Td>
								<Table.Td>{row.google}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					The values combine: <Code>rel="ugc sponsored"</Code>,{" "}
					<Code>rel="nofollow ugc"</Code>. Buying and selling advertising links is not
					forbidden — what is forbidden is letting them pass credit: without sponsored or
					nofollow that is a link scheme.
				</Text>

				<Text fw={600}>What a good link looks like</Text>
				<Text size="sm">
					Google publishes no checklist; the signs below follow in practice from how
					PageRank works and what the spam policies list.
				</Text>
				<DoAvoid
					goodTitle="A link that means something"
					badTitle="A link that buys nothing, or costs you"
					good={[
						"Editorial: the author chose to link because your piece is useful to their readers.",
						"From a page on a related subject that has readers and inbound links of its own.",
						"In the body text, in context, with an anchor that describes your page.",
						"From a site that does not sell links and links out selectively.",
					]}
					bad={[
						"Bought without sponsored/nofollow, swapped “you scratch my back”, or from a network of sites.",
						"Site-wide — in the footer, a widget or the template of other people's sites.",
						"From low-quality directories and bookmarking services, or forum signatures.",
						"From pages built only to carry the link — with no readers and no point.",
					]}
				/>
				<Text>
					<b>The “authority” myth.</b> DR, DA, Trust Flow, “trust” and “toxicity” are
					third-party metrics (Ahrefs, Moz, Majestic and others) computed over their own
					link databases. Google states plainly that third-party services' “reputation”
					and “authority” scores correspond to none of its signals. They are convenient
					for comparing one prospective site with another, but a rising DR is neither a
					goal nor a forecast of positions.
				</Text>

				<Text fw={600}>Disavow: when to reject links</Text>
				<Text>
					In most cases Google decides for itself which links to trust, and generally just
					ignores spam links. The Disavow links tool is needed only when both are true: a
					considerable number of spammy, artificial or low-quality links point at the site{" "}
					<b>and</b> they have already caused, or are likely to cause, a manual action.
					Get the links removed first; disavow what is left. Used wrongly, it can hurt
					your positions.
				</Text>
				<Code block>
					{`# disavow.txt — UTF-8 or 7-bit ASCII, one entry per line
# Removal requested 2026-09-02 and 2026-09-16, no reply
http://spam.example.com/stuff/paid-links.html
domain:shadyseo.example`}
				</Code>
				<List size="sm" spacing={4}>
					<List.Item>
						At most 100,000 lines (blank lines and comments included) and 2 MB; a URL up
						to 2048 characters; a file with the .txt extension. A sub-path
						(example.com/en/) cannot be disavowed — only a URL or a <Code>domain:</Code>
						.
					</List.Item>
					<List.Item>
						One list per property; a new upload replaces the old one entirely. Domain
						properties are not supported — only URL-prefix properties, and http and
						https need separate lists.
					</List.Item>
					<List.Item>
						It takes a few weeks to apply, and disavowed links keep appearing in the
						Links report.
					</List.Item>
				</List>

				<Text fw={600}>How to check it yourself</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						Search Console → Links → external links: Top linked pages (which of your
						pages are cited), Top linking sites (who links most often), Top linking text
						(the anchors). The report is a sample, not a full list: the tables are
						capped at 1000 rows, the data is grouped by root domain, nofollow is not
						marked, and some links may already be gone.
					</List.Item>
					<List.Item>
						The Latest links export shows them over time — which reveals a spike, or the
						traces of a bought campaign.
					</List.Item>
					<List.Item>
						Open the linking page and check the rel attribute — in DevTools or with
						curl.
					</List.Item>
					<List.Item>
						Third-party backlink tools find more links than Search Console — use them
						for discovery, not for judging “authority”.
					</List.Item>
				</List>
				<Code block>
					{`curl -s https://partner.example/blog/review/ | grep -o '<a [^>]*example\\.com[^>]*>'
# <a href="https://example.com/" rel="sponsored noopener">   → marked as paid, passes no credit
# <a href="https://example.com/pricing/">                     → paid placement without rel: link scheme`}
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
						{LINK_SCENARIOS.map((row) => (
							<Table.Tr key={row.symptom}>
								<Table.Td>{row.symptom}</Table.Td>
								<Table.Td>{row.cause}</Table.Td>
								<Table.Td>{row.act}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<DoAvoid
					good={[
						"Publish things worth citing: original data, research, tools, clear guides.",
						"Earn mentions through PR, partnerships and genuine community participation.",
						'Mark every paid placement rel="sponsored" — and require the same of partners.',
					]}
					bad={[
						"Buying links or unmarked sponsored posts.",
						"Mass guest posting or link exchanges for the link's sake.",
						"Disavowing links “just in case” on a third-party tool's “toxicity” score.",
					]}
				/>
				<Text size="sm" c="dimmed">
					<b>How this relates to the tracker.</b> Backlinks are invisible to it. The
					inward side it does check: “Internal links with nofollow” (
					<Code>INTERNAL_LINKS_NOFOLLOW</Code>), “The content links to no other page of
					the site” (<Code>NO_INTERNAL_LINKS</Code>), “Links with no text” (
					<Code>LINKS_WITHOUT_TEXT</Code>).
				</Text>
			</GuideSection>

			<GuideSection section={S.eeat} sources={[SRC.helpfulContent, SRC.bylineDates]}>
				<Text>
					E-E-A-T — <b>experience, expertise, authoritativeness and trust</b> — is how
					Google describes what its systems try to recognise in content. Trust matters
					most. It is not a ranking factor in itself; it is what many signals add up to.
				</Text>
				<Text>Google suggests asking three questions of every page:</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>Who</b> created it? Is the author evident, with a byline leading to who
						they are?
					</List.Item>
					<List.Item>
						<b>How</b> was it made? Say how a test was run, where data came from,
						whether automation was used.
					</List.Item>
					<List.Item>
						<b>Why</b> does it exist? To help people — not mainly to attract search
						visits.
					</List.Item>
				</List>
				<Text size="sm">
					The tracker sees the visible traces — an author named, author markup, sources
					cited, dates that agree — but not the expertise itself.
				</Text>
				<DoAvoid
					badTitle="Signs of search-engine-first content"
					good={[
						"First-hand experience: you used the product, ran the test, visited the place.",
						"Named authors with a page about them, and sources for claims.",
						"Updating a post when the facts change — and saying so.",
					]}
					bad={[
						"Covering many topics in the hope some will rank.",
						"Summarising others' work without adding anything.",
						"Changing the date without changing the content.",
						"Leaving readers needing to search again.",
					]}
				/>
			</GuideSection>

			<QualitySpamSection />

			<GuideSection
				section={S.searchConsole}
				sources={[SRC.searchConsole, SRC.performanceReport]}
			>
				<Text>
					Google Search Console is Google's own free view of a site in search. It shows
					what this tracker cannot: real queries, real clicks and Google's verdict on each
					URL. Positions here are simulated; there they are measured.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						{SEARCH_CONSOLE.map((row) => (
							<Table.Tr key={row.report}>
								<Table.Td fw={600} w={160}>
									{row.report}
								</Table.Td>
								<Table.Td>{row.tells}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					A useful habit: when a check here flags a Critical issue, confirm it in URL
					Inspection, fix it, then ask Google to recrawl the URL.
				</Text>
			</GuideSection>

			<GuideSection section={S.local} sources={[SRC.localRanking]}>
				<Text>
					For businesses serving a place, the map and local results are ranked on three
					things: <b>relevance</b> (how well the Business Profile matches the search),{" "}
					<b>distance</b> (how far the business is from the searcher) and{" "}
					<b>prominence</b> (how well known it is — links, reviews, ratings). There is no
					way to pay for a better local ranking.
				</Text>
				<DoAvoid
					good={[
						"Claim and verify the Google Business Profile.",
						"Keep address, hours, category and attributes complete and current.",
						"Reply to reviews; add photos.",
					]}
					bad={["Leaving the profile unclaimed or out of date.", "Ignoring reviews."]}
				/>
			</GuideSection>

			<GuideSection section={S.migrations} sources={[SRC.siteMove, SRC.redirects]}>
				<Text>
					Changing domain, moving to HTTPS or restructuring URLs is where sites lose most
					traffic by accident. Google's procedure:
				</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>Map every old URL to its new one.</List.Item>
					<List.Item>
						Update canonicals, hreflang and internal links on the new site to the new
						URLs.
					</List.Item>
					<List.Item>
						Redirect each old URL with a permanent (301/308) server-side redirect,
						without chains.
					</List.Item>
					<List.Item>
						For a new domain, use Search Console's Change of Address tool.
					</List.Item>
					<List.Item>
						Submit the new sitemap; keep the redirects for at least a year.
					</List.Item>
					<List.Item>Watch both sites in Search Console.</List.Item>
				</List>
				<Text size="sm">
					Expect rankings to fluctuate for a few weeks on a medium site, longer on a large
					one. After a move, re-crawl the client here to catch broken canonicals and
					redirect chains.
				</Text>
			</GuideSection>

			<GuideSection
				section={S.updates}
				sources={[
					SRC.coreUpdates,
					SOURCES.spamUpdates,
					SOURCES.statusDashboard,
					SRC.manualActions,
					SRC.spamPolicies,
				]}
			>
				<Text>
					A drop in traffic after “an update” can have three different natures, and they
					are treated differently. Work out which one you are looking at first.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>What it is</Table.Th>
							<Table.Th>Who decides</Table.Th>
							<Table.Th>How you learn of it</Table.Th>
							<Table.Th>How to recover</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{UPDATE_KINDS.map((row) => (
							<Table.Tr key={row.kind}>
								<Table.Td fw={600}>{row.kind}</Table.Td>
								<Table.Td>{row.who}</Table.Td>
								<Table.Td>{row.notice}</Table.Td>
								<Table.Td>{row.recover}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>

				<Text fw={600}>Core updates</Text>
				<Text>
					Several times a year Google changes its ranking systems broadly. Such updates do
					not target a particular site: pages that fell are not necessarily “bad” — others
					simply turned out to be more useful. There is no quick fix for a drop.
				</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						On the Search Status Dashboard, confirm that the update has finished and
						note its start and end dates.
					</List.Item>
					<List.Item>
						Wait at least a full week after it finishes, then compare that week in
						Performance with the week before it began.
					</List.Item>
					<List.Item>
						Look at the main pages and queries. A small fall (position 2 to 4) calls for
						no dramatic action — Google advises not touching what already works. A large
						one (4 to 29) is worth a thorough review.
					</List.Item>
					<List.Item>
						Take the search types separately: web, images, video, news.
					</List.Item>
					<List.Item>
						Review the worst-hit pages, and the site as a whole, against Google's
						helpful-content questions (see “Quality, the rater guidelines and spam
						policies”) — ideally with someone from outside.
					</List.Item>
				</List>
				<Text size="sm">
					Avoid “quick fixes” such as removing a page element because “it is bad for SEO”.
					Deleting content is a last resort; if you feel like deleting whole sections,
					they were probably built for search engines. Improvements sometimes show within
					days, but more often the systems need months — occasionally until the next core
					update. Google also ships smaller core updates without announcing them, so there
					is no need to wait for a big one.
				</Text>

				<Text fw={600}>Spam updates</Text>
				<Text>
					SpamBrain is Google's AI-based system that looks for spam continuously; when it
					is improved noticeably, Google announces a spam update. If a site fell after
					one, check it against the spam policies and remove the violations: the systems
					need months to satisfy themselves that it now complies. After a link spam
					update, fixes may not help at all: the benefit of the links the systems
					neutralised is gone for good.
				</Text>

				<Text fw={600}>Manual actions</Text>
				<Text>
					A manual action is a penalty from a human reviewer for breaking the spam
					policies — unnatural links, thin content, cloaking or sneaky redirects, hidden
					text or keyword stuffing, structured data abuse, user-generated spam. The pages
					affected, or the whole site, rank lower or disappear. It is shown in Search
					Console's Manual actions report; fix every affected page, then request a review.
					The procedure and the usual mistakes are in “Quality, the rater guidelines and
					spam policies”.
				</Text>
			</GuideSection>

			<GuideSection
				section={S.aiSearch}
				sources={[
					SRC.aiFeatures,
					SRC.robotsMeta,
					SRC.snippets,
					SOURCES.googleCommonCrawlers,
					SOURCES.searchConsoleMetrics,
					SRC.openAiBots,
					SRC.perplexityBots,
					SRC.claudeBots,
					SRC.bingCrawlers,
					SRC.javascriptSeo,
				]}
			>
				<Text>
					Google's AI Overviews and AI Mode draw on the same index as Search. There are no
					extra requirements or special markup: a page must be indexed and allowed to show
					a snippet, and the usual SEO fundamentals apply. <Code>nosnippet</Code>,{" "}
					<Code>max-snippet</Code> and <Code>noindex</Code> limit what is shown there too.
				</Text>

				<Text fw={600}>How it works at Google</Text>
				<Text>
					To build an answer, AI Overviews and AI Mode may use a “query fan-out”
					technique: run several related searches across subtopics and sources and pull in
					more supporting pages than the classic results page shows. An AI Overview
					appears only where the systems judge that it adds something to the ordinary
					results — which is why it often does not appear at all. The two features may use
					different models, and their sets of links differ. Google requires no new
					machine-readable files, no “AI text” files and no special schema.org markup.
				</Text>

				<Text fw={600}>The controls</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={190}>Control</Table.Th>
							<Table.Th>What it does</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{AI_CONTROLS.map((row) => (
							<Table.Tr key={row.control}>
								<Table.Td>
									<Code>{row.control}</Code>
								</Table.Td>
								<Table.Td>{row.effect}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					The AI is built into Search, so crawl access for Google's AI features is
					governed by the same robots.txt rules as Googlebot: forbidding Googlebot takes
					the content out of Search entirely. Google offers no rule that would remove a
					page from the AI features alone while leaving the ordinary snippet.
				</Text>
				<Code block>
					{`<!-- Indexed, but no text from it in snippets, AI Overviews or AI Mode -->
<meta name="robots" content="nosnippet">

<!-- At most 160 characters of text shown or used as direct input -->
<meta name="robots" content="max-snippet:160">

<!-- Only this block is never quoted -->
<div data-nosnippet>Prices for subscribers only…</div>

# robots.txt — Gemini training and grounding off; Search and its AI features unaffected
User-agent: Google-Extended
Disallow: /`}
				</Code>

				<Text fw={600}>What helps a page end up in the answers</Text>
				<Text size="sm">
					Google asks for no special optimisation; the same fundamentals as for Search
					apply. In practice that means:
				</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						Crawling allowed in robots.txt, no CDN or host blocking Googlebot, and
						internal links to the page.
					</List.Item>
					<List.Item>
						What matters as text in the HTML. A clear answer directly under a heading
						that states the question is easier to lean on; that is a conclusion from
						practice, not a Google requirement.
					</List.Item>
					<List.Item>
						Verifiable facts, figures with sources, first-hand experience — what sets a
						page apart from a dozen retellings.
					</List.Item>
					<List.Item>
						Structured data that matches the visible text; current data in Merchant
						Center and the Business Profile; good images and video.
					</List.Item>
					<List.Item>
						A good page experience, and authority built exactly as it is for the
						ordinary results.
					</List.Item>
				</List>

				<Text fw={600}>How to measure it</Text>
				<Text>
					Impressions and clicks from AI Overviews and AI Mode are part of the ordinary
					Performance report in Search Console — under the Web search type, together with
					the ordinary results; there is no separate search type for them.
				</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						A click on an external link in an AI Overview or AI Mode counts as a click;
						impressions follow the usual rules.
					</List.Item>
					<List.Item>
						An AI Overview occupies one position on the results page, and every link in
						it gets that position. In AI Mode positions are counted as on an ordinary
						results page.
					</List.Item>
					<List.Item>
						A follow-up question in AI Mode is a new query: its impressions, clicks and
						positions go to that query.
					</List.Item>
					<List.Item>Search Labs experiments do not reach Search Console.</List.Item>
				</List>

				<Text fw={600}>Other assistants</Text>
				<Text>
					Other assistants — ChatGPT, Perplexity, Claude, Copilot through Bing — search
					with their own crawlers. To be cited by one, its crawler has to be allowed in
					robots.txt; and most of them do not run JavaScript, so the text must be in the
					HTML. Their search crawlers are separate from their training crawlers; blocking
					training does not remove a site from their answers.
				</Text>
				<Code block>
					{`# Search crawlers of AI assistants: allowed, so answers can cite the site
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Claude-SearchBot
Allow: /

# Training crawlers: a separate choice, closing them costs no visibility in answers
User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /`}
				</Code>
				<Text size="sm" c="dimmed">
					<b>How this relates to the tracker.</b> It checks “robots.txt blocks the AI
					search crawlers” (<Code>ROBOTS_BLOCKS_AI_SEARCH</Code> — OAI-SearchBot,
					PerplexityBot, Claude-SearchBot and Bingbot), “Posts need JavaScript to show
					their text” (<Code>CONTENT_NEEDS_JAVASCRIPT</Code>) and “The snippet in results
					is restricted” (<Code>SNIPPET_RESTRICTED</Code>) — nosnippet, max-snippet:0 or
					data-nosnippet around most of the article. It does not measure how often a site
					is cited in AI answers.
				</Text>
			</GuideSection>
		</GuidePart>
	);
}
