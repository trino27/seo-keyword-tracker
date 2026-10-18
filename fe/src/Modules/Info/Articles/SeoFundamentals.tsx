import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GuidePart } from "../GuidePart/GuidePart";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";
import {
	CrawlIndexInDepth,
	OnPageInDepth,
	RobotsTxtInDepth,
	SignalsInDepth,
} from "./FundamentalsInDepth";
import { LinkingSection, MetaRobotsSection, SemanticsSection } from "./LinksMetaSemantics";
import {
	CrawlDiscoverySection,
	IndexDebuggingSection,
	MobileFirstSection,
	ServerLogsSection,
} from "./CrawlingDeepDive";
import { HttpHeadersSection, SitemapsSection, StatusRedirectsSection } from "./TechnicalDeepDive";
import { DuplicatesSection, HreflangSection } from "./DuplicatesInternational";
import { MetaRelSection } from "./MetaRelReference";

/** Pages these chapters cite beyond the shared list; each was opened against its sentence on 2026-10-12. */
const SOURCES = {
	searchStatus: {
		title: "Google Search Status Dashboard",
		url: "https://status.search.google.com/",
	},
} satisfies Record<string, ISeoIssueSource>;

/** The systems of Google's ranking systems guide, in its order, with what each means for a blog. */
const RANKING_SYSTEMS = [
	{
		name: "BERT",
		does: "An AI model that understands how a combination of words carries meaning and intent — prepositions and word order included.",
		blog: "Write in natural language: the small words in a query matter.",
	},
	{
		name: "Crisis information",
		does: "On queries about a personal crisis it surfaces hotlines and material from trusted organisations; in natural disasters, SOS alerts.",
		blog: "Barely touches a blog.",
	},
	{
		name: "Deduplication",
		does: "Shows only the most relevant of near-identical results; a page already shown in a featured snippet is not repeated below.",
		blog: "Near-identical posts on a site compete with each other, and one of them is what gets shown.",
	},
	{
		name: "Exact match domain",
		does: "Keeps domains assembled around a query (best-seo-tips.com) from getting undue weight.",
		blog: "A keyword in the domain will not help.",
	},
	{
		name: "Freshness",
		does: "“Query deserves freshness” (QDF) systems show more recent content where recency is expected.",
		blog: "It depends on the query, not on the post's date: news, releases, “what changed in 2026” — yes; “what a canonical is” — no. Changing the date without changing the text does nothing.",
	},
	{
		name: "Link analysis and PageRank",
		does: "Uses how pages link to each other to understand what they are about and how useful they are. PageRank has changed since launch and remains part of the core systems.",
		blog: "Internal links with clear anchors, and links from relevant sites.",
	},
	{
		name: "Local news",
		does: "Finds and surfaces local news sources in the Top stories and Local news blocks.",
		blog: "Concerns news sites.",
	},
	{
		name: "MUM",
		does: "An AI model that understands and generates language. It is not used for general ranking — only for particular tasks, such as COVID-19 vaccine searches and featured-snippet callouts.",
		blog: "No direct effect.",
	},
	{
		name: "Neural matching",
		does: "Connects the representations of concepts in queries and on pages.",
		blog: "Cover the topic rather than repeating the phrase.",
	},
	{
		name: "Original content",
		does: "Places the original, original reporting included, above pages that merely quote it; it takes canonical markup into account.",
		blog: "Your own data, experience and research; a copy at a partner is better left noindexed.",
	},
	{
		name: "Removal-based demotion",
		does: "Demotes sites with a high volume of valid removal requests — copyright, defamation, counterfeit, court orders — and sites with exploitative practices where there are many personal-information removals.",
		blog: "Do not use other people's text and images without the rights.",
	},
	{
		name: "Passage ranking",
		does: "Judges individual sections of a page to work out its relevance.",
		blog: "A section that answers a narrow question exactly can carry a long post for that query.",
	},
	{
		name: "RankBrain",
		does: "Connects words to concepts, so a page can rank without the query's exact words.",
		blog: "Do not bend the text towards an exact match.",
	},
	{
		name: "Reliable information",
		does: "Raises authoritative pages, demotes low-quality ones and promotes quality journalism; where reliable results are scarce it shows a content advisory.",
		blog: "Sources, an author with demonstrated expertise, accurate facts.",
	},
	{
		name: "Reviews system",
		does: "Rewards quality reviews: deep analysis and original research from people who know the subject.",
		blog: "A review of a tool means your own tests, screenshots, comparisons, pros and cons.",
	},
	{
		name: "Site diversity",
		does: "Usually shows no more than two pages from one site in the top results; subdomains are generally treated as part of the main domain.",
		blog: "A third page of yours for the same query will not normally make the top.",
	},
	{
		name: "Spam detection",
		does: "A continually updated set of systems, SpamBrain among them, against content and behaviour that break the spam policies.",
		blog: "Keyword stuffing, cloaking, bought links, low-value content at scale.",
	},
] as const;

const STAGES = [
	{
		stage: "Crawling",
		what: "Googlebot downloads pages. There is no central list of the web: it finds URLs by following links from pages it knows and by reading sitemaps. It does not crawl every URL it finds, limits its speed to spare the server, and runs the page's JavaScript in a recent Chrome.",
		wrong: "robots.txt forbids the URL, the server errors or refuses, the page is only reachable through links Google cannot follow, or the content needs JavaScript that fails.",
		checks: "Indexing and robots rules, Links, Site: robots.txt, Site: host and server",
	},
	{
		stage: "Indexing",
		what: "Google reads the text, the key tags (title, headings, canonical, robots), images and video. It groups duplicate pages and picks one canonical per group — only that one can be shown. It also records the language, the country targeted and usability.",
		wrong: "A noindex rule, a canonical pointing elsewhere, near-duplicate pages, thin or low-quality content, or markup that contradicts itself.",
		checks: "Indexing and robots rules, Canonical URLs, Content quality, Structured data",
	},
	{
		stage: "Serving and ranking",
		what: "For each search Google finds matching pages in the index and orders them by expected relevance and quality, using hundreds of signals including the searcher's location, language and device.",
		wrong: "The page does not answer the query, other pages answer it better, or a spam policy demotes it.",
		checks: "Titles, Meta descriptions, Headings, Keywords — and everything this tracker cannot see (see Beyond this tracker).",
	},
] as const;

const ON_PAGE = [
	{
		element: "Title (<title>)",
		does: "The headline of the search result; read to understand the page.",
		good: "Unique, specific, names the subject first, roughly 30–60 characters, brand at the end.",
		bad: "Missing, duplicated across pages, vague (“Home”, “Blog”), stuffed with keywords.",
	},
	{
		element: "Meta description",
		does: "May be shown as the snippet under the headline. Not a ranking factor.",
		good: "A unique, accurate summary of this page that makes the click worthwhile.",
		bad: "Missing, the same on every page, a copy of the title, a list of keywords.",
	},
	{
		element: "Headings (H1–H6)",
		does: "The page's outline for readers, screen readers and Google.",
		good: "One H1 naming the topic; H2s for sections that say what each covers.",
		bad: "The title styled as a <div>; headings used for font size; one wall of text.",
	},
	{
		element: "Content",
		does: "What ranks. Google's systems reward helpful, reliable, people-first content.",
		good: "Answers the searcher's question completely, from real experience, with sources.",
		bad: "Thin stubs, copies of other pages, text written for a keyword rather than a reader.",
	},
	{
		element: "Internal links",
		does: "How Google discovers pages and learns what they are about (the anchor text).",
		good: "Descriptive links from the text to related posts, to their canonical URLs.",
		bad: "“Click here”, links only in menus, onclick-only links, nofollow on your own pages.",
	},
	{
		element: "Canonical URL",
		does: "Tells Google which of several copies of a page is the one to show.",
		good: 'An absolute <link rel="canonical"> to the page itself, in <head>, once.',
		bad: "Missing, pointing to another page by mistake, two different canonicals, http://.",
	},
	{
		element: "Structured data",
		does: "States facts (headline, author, dates, image, breadcrumbs) in JSON-LD; enables rich results.",
		good: "Valid JSON-LD that matches what is visible on the page.",
		bad: "Broken JSON, fields that contradict the page, markup for content that is not there.",
	},
	{
		element: "Images",
		does: "Found in image search; make text readable; need text for those who cannot see them.",
		good: "Descriptive alt text and file names, a real src, near the related text.",
		bad: "No alt attribute, IMG_1234.jpg, images only in srcset or CSS backgrounds.",
	},
	{
		element: "URL",
		does: "Shown in results (with breadcrumbs on desktop; on mobile, since 2025, the domain alone); a light clue to the page's subject.",
		good: "Short, readable words separated by hyphens: /blog/local-seo-checklist.",
		bad: "Session IDs, long parameter strings, several URLs for one page.",
	},
] as const;

const STATUS_CODES = [
	{ code: "200 OK", google: "The content is processed. It does not guarantee indexing." },
	{
		code: "301 / 308",
		google: "Permanent redirect: a strong signal the target is the page to show. Google shows the new URL.",
	},
	{
		code: "302 / 307",
		google: "Temporary redirect: Google follows it, but does not take it as a signal that the target should be the canonical — the original URL usually stays in results. Use it only for short-term moves: a temporary redirect left in place for long enough may eventually be treated as permanent.",
	},
	{
		code: "404 / 410",
		google: "The page does not exist. Google drops it from the index over time and crawls it less. Harmless for a page that really is gone.",
	},
	{
		code: "429",
		google: "Treated as an overloaded server, like a 5xx: Google slows down. Do not use 401/403 to limit crawling.",
	},
	{
		code: "5xx",
		google: "Server error: Google slows crawling; pages that keep failing are eventually dropped from the index.",
	},
	{
		code: "Soft 404",
		google: "A 200 for a page that looks like an error or is empty. Google reports it as a soft 404 — answer a real 404 instead.",
	},
] as const;

/** Part three: the SEO a reader needs to understand every check — how search works and what ranks. */
export function SeoFundamentals() {
	return (
		<GuidePart
			title="SEO fundamentals"
			lead="How search engines find, understand and rank pages — the background every check rests on."
		>
			<GuideSection
				section={S.howSearchWorks}
				sources={[SRC.howSearchWorks, SRC.googlebot, SRC.javascriptSeo, SRC.sitemaps]}
			>
				<Text>
					Google Search works in three stages, and a page can drop out at each. Most
					technical SEO is making sure nothing stops a page at the first two.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={8} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={120}>Stage</Table.Th>
							<Table.Th>What happens</Table.Th>
							<Table.Th>What goes wrong</Table.Th>
							<Table.Th w={190}>Checked here by</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{STAGES.map((row) => (
							<Table.Tr key={row.stage}>
								<Table.Td fw={600}>{row.stage}</Table.Td>
								<Table.Td>{row.what}</Table.Td>
								<Table.Td>{row.wrong}</Table.Td>
								<Table.Td c="dimmed">{row.checks}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<List size="sm" spacing={4}>
					<List.Item>
						Google does not accept payment to crawl a site more often or to rank it
						higher.
					</List.Item>
					<List.Item>
						Nothing guarantees that a page is crawled, indexed or shown — even a page
						that follows every guideline.
					</List.Item>
					<List.Item>
						A page can be indexed and still not appear: it may not be relevant to
						anything people search, or be of low quality.
					</List.Item>
				</List>
			</GuideSection>

			<CrawlDiscoverySection />

			<CrawlIndexInDepth />

			<IndexDebuggingSection />

			<MobileFirstSection />

			<ServerLogsSection />

			<GuideSection
				section={S.ranking}
				sources={[
					SRC.rankingSystems,
					SRC.helpfulContent,
					SRC.starterGuide,
					SRC.pageExperience,
					SRC.spamPolicies,
					SRC.coreUpdates,
					SRC.performanceReport,
					SRC.manualActions,
					SOURCES.searchStatus,
				]}
			>
				<Text>
					Google ranks with many automated systems, not one formula, and publishes no
					weights. For every query they judge what the person means, which pages answer it
					best, and how far those pages can be trusted. For a blog post it comes down to
					six things:
				</Text>
				<List type="ordered" size="sm" spacing={6}>
					<List.Item>
						<b>Relevance to the search.</b> Language systems (BERT, RankBrain, neural
						matching, passage ranking) match the meaning of the query to the meaning of
						the page — and of individual sections of it — not just its words. A page
						that does not answer what the searcher wants does not rank, however good its
						markup.
					</List.Item>
					<List.Item>
						<b>Helpful, reliable content.</b> Systems that reward original, people-first
						content written with real expertise, and promote authoritative sources.
						Google's self-assessment questions ask: who wrote it, how, and why.
					</List.Item>
					<List.Item>
						<b>Links.</b> Link analysis and PageRank use how pages link to each other to
						understand what they are about and how useful they are. Links from other
						sites are one of many signals.
					</List.Item>
					<List.Item>
						<b>Freshness</b> — only for searches where recent information is expected
						(news, new releases, current events). It is a property of the query, not of
						the post: on an evergreen subject a new date buys nothing.
					</List.Item>
					<List.Item>
						<b>Page experience</b> — Core Web Vitals, HTTPS, mobile-friendliness, no
						intrusive pop-ups. There is no separate “page experience system” in Google's
						guide: the core ranking systems reward a good experience, but Google shows
						the most relevant page even when its experience is worse.
					</List.Item>
					<List.Item>
						<b>Spam detection.</b> Pages that break the spam policies (keyword stuffing,
						cloaking, link schemes, scaled low-value content) are demoted or removed.
					</List.Item>
				</List>
				<Text>
					Results are also de-duplicated (near-identical pages are hidden) and usually
					show at most two pages from one site.
				</Text>

				<Text fw={600}>The ranking systems, from Google's guide</Text>
				<Text size="sm">
					Google keeps a public list of the systems that run continuously — in its order:
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={190}>System</Table.Th>
							<Table.Th>What it does</Table.Th>
							<Table.Th>What it means for a blog</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{RANKING_SYSTEMS.map((row) => (
							<Table.Tr key={row.name}>
								<Table.Td fw={600}>{row.name}</Table.Td>
								<Table.Td>{row.does}</Table.Td>
								<Table.Td>{row.blog}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Text size="sm">
					The list of retired systems: the <b>helpful content system</b> (2022) became
					part of the core ranking systems in March 2024 — there are no separate “helpful
					content updates” any more, those signals are assessed continuously and move with
					the core updates. Panda (2011, in the core since 2015) and Penguin (2012, since
					2016) were absorbed the same way; Hummingbird (2013) was a milestone after which
					the systems kept changing.
				</Text>

				<DoAvoid
					goodTitle="What Google says matters"
					badTitle="What Google says not to focus on"
					good={[
						"Content that fully answers the searcher's need, better than the alternatives.",
						"Clear expertise: who wrote it, from what experience, with what sources.",
						"Being linked to by relevant sites because the content is worth citing.",
						"A page Google can crawl, index and render without obstacles.",
					]}
					bad={[
						"The meta keywords tag — Google does not use it.",
						"A target word count — there is no minimum or maximum.",
						"Keywords in the domain or URL — they have hardly any effect.",
						"The number or order of headings — it does not matter to ranking.",
						'A "duplicate content penalty" — duplicates are inefficient, not penalised (copying others is different).',
						"E-E-A-T as a ranking factor — it is not one; it describes what the systems look for.",
						"Bumping the date without updating the text, for “freshness”.",
					]}
				/>

				<Text fw={600}>How to work out why a position changed</Text>
				<List type="ordered" size="sm" spacing={4}>
					<List.Item>
						Search Console → Performance: filter to the page and compare periods on the
						queries tab. Did every query fall, or a few? Did impressions fall (the page
						is losing visibility) or only clicks (the results page changed — an answer
						block appeared, say)?
					</List.Item>
					<List.Item>
						Line the date up with the Google Search Status Dashboard: a match with a
						core update or a spam update points to a re-assessment of quality, not to a
						technical fault.
					</List.Item>
					<List.Item>
						Open Manual actions: an entry there means the cause is a manual penalty, not
						the algorithms.
					</List.Item>
					<List.Item>
						Look at the results for the main query: which intent the top pages serve,
						how fresh and how thorough they are, and whether a second page of your own
						is in there (deduplication, site diversity).
					</List.Item>
					<List.Item>
						Rule out the technical causes: URL Inspection — the page is in the index,
						the canonical is the right one, the content is visible after rendering.
					</List.Item>
				</List>
				<Text size="sm" c="dimmed">
					Changes take time: some show in hours, others take months. Wait a few weeks
					before judging whether a change worked. Positions in this version of the tracker
					are generated (see “Positions”), so look for the causes of a change in Search
					Console data.
				</Text>
			</GuideSection>

			<SemanticsSection />

			<GuideSection
				section={S.onPage}
				sources={[
					SRC.titleLinks,
					SRC.snippets,
					SRC.mdnHeadings,
					SRC.crawlableLinks,
					SRC.canonical,
					SRC.structuredDataIntro,
					SRC.images,
					SRC.urlStructure,
				]}
			>
				<Text>
					On-page SEO is everything on the page itself that tells searchers and Google
					what it is about. The check reference below has a chapter for each row.
				</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={8} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={140}>Element</Table.Th>
							<Table.Th>What it does</Table.Th>
							<Table.Th>Good</Table.Th>
							<Table.Th>Bad</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{ON_PAGE.map((row) => (
							<Table.Tr key={row.element}>
								<Table.Td fw={600}>{row.element}</Table.Td>
								<Table.Td>{row.does}</Table.Td>
								<Table.Td c="teal.8">{row.good}</Table.Td>
								<Table.Td c="red.8">{row.bad}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</GuideSection>

			<OnPageInDepth />

			<LinkingSection />

			<SignalsInDepth />

			<DuplicatesSection />

			<GuideSection
				section={S.technical}
				sources={[
					SRC.robotsIntro,
					SRC.blockIndexing,
					SRC.sitemaps,
					SRC.redirects,
					SRC.httpStatusCodes,
					SRC.mobileFirst,
					SRC.javascriptSeo,
					SRC.httpsSignal,
				]}
			>
				<Text fw={600}>robots.txt is not noindex</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th />
							<Table.Th>robots.txt Disallow</Table.Th>
							<Table.Th>noindex (meta tag or X-Robots-Tag)</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td fw={600}>Controls</Table.Td>
							<Table.Td>Crawling: whether a bot may fetch the URL.</Table.Td>
							<Table.Td>Indexing: whether the page may appear in results.</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>The URL can still appear?</Table.Td>
							<Table.Td>
								Yes — without a description, known from links to it.
							</Table.Td>
							<Table.Td>No, once Google has recrawled the page.</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td fw={600}>Use it for</Table.Td>
							<Table.Td>
								Keeping bots out of areas that waste crawling (search results,
								carts).
							</Table.Td>
							<Table.Td>Keeping a page out of search.</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Text size="sm">
					Never combine them on one page: if robots.txt blocks the URL, Google never sees
					the noindex. And Google ignores <Code>noindex:</Code> lines inside robots.txt.
				</Text>

				<Text fw={600}>Sitemaps</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						List only the canonical, indexable URLs you want in search — absolute URLs.
					</List.Item>
					<List.Item>
						At most 50,000 URLs or 50 MB uncompressed per file; split larger ones with
						an index.
					</List.Item>
					<List.Item>
						<Code>lastmod</Code> is used only if it is accurate — the date of the last
						significant change. Google ignores <Code>priority</Code> and{" "}
						<Code>changefreq</Code>.
					</List.Item>
					<List.Item>
						Reference it in robots.txt and submit it in Search Console.
					</List.Item>
				</List>

				<Text fw={600}>Redirects</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>Permanent (301, 308)</b> when a page has moved for good — Google shows
						the new URL. <b>Temporary (302, 307)</b> only for short-term moves — Google
						usually keeps the old one. Do not leave a temporary redirect in place for
						months instead of a permanent one: Google may in time come to treat it as
						permanent, but that is not something to rely on — if the move is for good,
						use a 301.
					</List.Item>
					<List.Item>
						Prefer server-side redirects. An instant meta refresh is read as permanent,
						a delayed one as temporary; JavaScript redirects only when nothing else is
						possible, since rendering can fail.
					</List.Item>
					<List.Item>
						Send every old address straight to the final one: each hop is another
						request, and Googlebot follows only up to 10.
					</List.Item>
				</List>

				<Text fw={600}>Status codes</Text>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Tbody>
						{STATUS_CODES.map((row) => (
							<Table.Tr key={row.code}>
								<Table.Td w={110} fw={600}>
									{row.code}
								</Table.Td>
								<Table.Td>{row.google}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>

				<Text fw={600}>Also part of technical SEO</Text>
				<List size="sm" spacing={4}>
					<List.Item>
						<b>HTTPS</b> everywhere, with plain HTTP redirected permanently — a very
						lightweight ranking signal, but a strong trust signal for readers and
						browsers.
					</List.Item>
					<List.Item>
						<b>Mobile-first indexing</b>: Google indexes the page its smartphone crawler
						sees, so the mobile version must have the same content, links and markup.
					</List.Item>
					<List.Item>
						<b>JavaScript</b>: Google renders it, later and not always successfully;
						most AI assistants' crawlers do not run it at all. Text that matters belongs
						in the HTML (see “Rendering and JavaScript”).
					</List.Item>
					<List.Item>
						<b>One address per page</b>: one host (www or not), one scheme (https),
						redirects from the rest, and a canonical.
					</List.Item>
				</List>
				<Text size="sm" c="dimmed">
					In more depth in “Status codes and redirects in detail”, “Sitemaps in detail”,
					“HTTP headers for SEO”, “robots.txt in detail”, “Meta robots” and “Meta tags and
					rel values: a reference”.
				</Text>
			</GuideSection>

			<StatusRedirectsSection />

			<SitemapsSection />

			<HttpHeadersSection />

			<RobotsTxtInDepth />

			<MetaRobotsSection />

			<MetaRelSection />

			<HreflangSection />
		</GuidePart>
	);
}
