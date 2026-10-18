import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** Sources only these three sections cite; each was opened and read against its sentence. */
const SOURCES = {
	knowledgeGraphApi: {
		title: "Google Knowledge Graph Search API",
		url: "https://developers.google.com/knowledge-graph",
	},
	knowledgeGraphIntro: {
		title: "Google: Introducing the Knowledge Graph: things, not strings",
		url: "https://blog.google/products/search/introducing-knowledge-graph-things-not/",
	},
	linksReport: {
		title: "Search Console Help: Links report",
		url: "https://support.google.com/webmasters/answer/9049606",
	},
	evolvingNofollow: {
		title: "Google Search Central Blog: Evolving “nofollow” – new ways to identify the nature of links",
		url: "https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify",
	},
	crawlBudgetGooglebot: {
		title: "Google Search Central Blog: What Crawl Budget Means for Googlebot",
		url: "https://developers.google.com/search/blog/2017/01/what-crawl-budget-means-for-googlebot",
	},
	pageRankSculpting: {
		title: "Matt Cutts (Google): PageRank sculpting",
		url: "https://www.mattcutts.com/blog/pagerank-sculpting/",
	},
	removalsTool: {
		title: "Search Console Help: Removals and SafeSearch reports tool",
		url: "https://support.google.com/webmasters/answer/9689846",
	},
	nginxHeaders: {
		title: "nginx: Module ngx_http_headers_module",
		url: "https://nginx.org/en/docs/http/ngx_http_headers_module.html",
	},
	apacheHeaders: {
		title: "Apache HTTP Server: mod_headers",
		url: "https://httpd.apache.org/docs/current/mod/mod_headers.html",
	},
} satisfies Record<string, ISeoIssueSource>;

const INTERNAL_LEVERS = [
	{
		lever: "Links from the text",
		does: "The strongest and most precise lever: the author decides which page matters at this point, and the anchor says what it is about.",
	},
	{
		lever: "A topic hub",
		does: "A page on the broad topic links to every post in the cluster, and the posts link back to the hub and to each other where it fits. The topic becomes one connected group, and the hub gains links from all of its pages.",
	},
	{
		lever: "Breadcrumbs",
		does: "Links up the hierarchy — from a post to its category and the home page — on every page. BreadcrumbList markup helps Google place the page on the site, and can replace the URL in a result with the trail.",
	},
	{
		lever: "A “related posts” block",
		does: "Gives new and old posts links from their neighbours on the same topic. It works when the links are ordinary <a href> in the HTML and chosen by topic, not at random.",
	},
	{
		lever: "The home page, the menu, the categories",
		does: "Links present on every page shorten the route to the sections that matter. New posts are found sooner through a category feed, while they are still on its first pages.",
	},
] as const;

const ROBOTS_TOOLS = [
	{
		goal: "Take a page out of the results",
		tool: "noindex (a meta tag or X-Robots-Tag); the page has to stay crawlable. For good, add a 404/410 or a password.",
		not: "A Disallow in robots.txt: Google never sees the noindex, and the URL can stay in the index with no content.",
	},
	{
		goal: "Keep one of several duplicates in the results",
		tool: "A 301 redirect or a rel=canonical to the main version.",
		not: "noindex: Google explicitly advises against choosing a canonical with noindex — it removes the page from search entirely.",
	},
	{
		goal: "Stop spending crawling on endless URLs (filters, site search)",
		tool: "A Disallow in robots.txt.",
		not: "noindex: Google still has to fetch the page to see it.",
	},
	{
		goal: "Hide a page urgently while the cause is fixed",
		tool: "The Removals tool in Search Console — for about six months.",
		not: "Treating a temporary removal as permanent: after it expires the page can come back.",
	},
	{
		goal: "Remove a PDF, an image or another non-HTML file",
		tool: "X-Robots-Tag: noindex on the server (or delete the file).",
		not: "A meta tag: there is nowhere to put one.",
	},
] as const;

const ROBOTS_RULES = [
	{ rule: "all", means: "No restriction. The default — writing it changes nothing." },
	{ rule: "noindex", means: "Keep this page out of search results." },
	{
		rule: "nofollow",
		means: "Do not follow the links on this page. Without this rule Google may discover new pages through them.",
	},
	{ rule: "none", means: "Both noindex and nofollow." },
	{
		rule: "nosnippet",
		means: "Show no text snippet or video preview — and nothing from the page in AI Overviews.",
	},
	{
		rule: "max-snippet:[n]",
		means: "At most n characters of snippet; 0 means none, -1 lets Google choose.",
	},
	{
		rule: "max-image-preview:[none|standard|large]",
		means: "The largest image preview allowed. large is what Google Discover needs for big cards.",
	},
	{
		rule: "max-video-preview:[n]",
		means: "At most n seconds of video preview; 0 a still image, -1 no limit.",
	},
	{ rule: "noimageindex", means: "Do not index the images on this page." },
	{ rule: "notranslate", means: "Do not offer a translation of this result." },
	{
		rule: "indexifembedded",
		means: "With noindex, still allow the content to be indexed when embedded in another page's iframe.",
	},
	{
		rule: "unavailable_after:[date]",
		means: "Stop showing the page after this date. Any widely adopted format will do — RFC 822, RFC 850, ISO 8601 and others; an invalid date is ignored. By default there is no expiry.",
	},
] as const;

const REL_VALUES = [
	{
		rel: "(none)",
		use: "A normal link you stand behind — the default for links within your site and to sources you cite.",
	},
	{ rel: "sponsored", use: "Paid placements and advertising." },
	{ rel: "ugc", use: "Links in user-generated content: comments, forum posts." },
	{
		rel: "nofollow",
		use: "A link you do not want associated with your site, when neither of the above fits. Not for your own pages.",
	},
] as const;

/** The meaning behind the words: topics, keyword clusters, intent, and markup that says what each part is. */
export function SemanticsSection() {
	return (
		<GuideSection
			section={S.semantics}
			sources={[
				SRC.rankingSystems,
				SRC.howSearchWorks,
				SOURCES.knowledgeGraphApi,
				SOURCES.knowledgeGraphIntro,
				SRC.starterGuide,
				SRC.helpfulContent,
				SRC.keywordClustering,
				SRC.searchIntent,
				SRC.cannibalisation,
				SRC.performanceReport,
				SRC.canonical,
				SRC.redirects,
				SRC.spamPolicies,
				SRC.mdnSemantics,
			]}
		>
			<Text fw={600}>Search engines read meaning, not just words</Text>
			<Text>
				Google's language systems — BERT, RankBrain, neural matching and passage ranking —
				connect the concepts in a query with the concepts in a page and in each section of
				it. In Google's own descriptions, BERT understands how combinations of words express
				different meanings and intent; RankBrain relates words to concepts; neural matching
				matches the representations of concepts in a query and on a page; passage ranking
				judges individual passages of a page. So a page can rank for a search that never
				uses its exact words, and repeating a phrase does not make a page more relevant:
				keyword stuffing is a spam policy violation. What wins is a page that covers the
				meaning behind the query — the subject, its related ideas, and what the searcher
				wants to do.
			</Text>
			<Text>
				The second layer is <b>entities</b>. Google's Knowledge Graph holds millions of
				records about real people, places, organisations and things, and the relations
				between them; Google put it in 2012 as “things, not strings”. “Jaguar” can be an
				animal or a car — the neighbouring entities decide which: “savannah” and “prey”, or
				“engine” and “dealer”. Exactly how entities take part in ranking Google does not
				disclose, but the practical conclusion is safe: name things unambiguously, mention
				the entities the topic involves (brands, standards, tools, people, places), and
				leave neither the reader nor the machine guessing.
			</Text>

			<Text fw={600}>Covering a topic</Text>
			<Text>
				A page written by an expert naturally answers the questions that follow the main
				one: what it is, what for, how to do it, what it costs, what the mistakes are, how
				it differs from the alternative. Google's helpful-content guidance asks exactly
				that: does the page give a complete and comprehensive description of the topic, and
				does the reader leave feeling they learned enough. Subtopics that need a substantial
				answer of their own move to pages of their own, joined by links — and that is a
				cluster.
			</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Where to find the subtopics:</b> the “People also ask” blocks and the
					suggestions on the results page, the queries the page already appears for in
					Search Console, the sections of the pages in the top results, and the questions
					customers ask sales and support.
				</List.Item>
				<List.Item>
					<b>Coverage is not length.</b> A subtopic's answer may fit in one paragraph; a
					surplus 2000 words for “completeness” gets scrolled past and makes the page no
					better.
				</List.Item>
				<List.Item>
					<b>Structure helps passage ranking:</b> each subtopic under its own H2 or H3,
					with the answer in the section's first sentences.
				</List.Item>
			</List>

			<Text fw={600}>The semantic core: the map of what a site answers</Text>
			<Text>
				A site's semantic core is the full set of queries it wants to be found for,
				organised by meaning. Built well, it decides which pages exist and what each one is
				about:
			</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>Collect queries</b> — the words customers use, the queries the site already
					appears for in Search Console, and those from a keyword tool.
				</List.Item>
				<List.Item>
					<b>Group them into clusters by intent.</b> Queries belong together when Google
					already answers them with the same pages: if the top results overlap, one page
					can serve the whole cluster.
				</List.Item>
				<List.Item>
					<b>One cluster, one page.</b> Give each cluster exactly one page. Two pages for
					one cluster compete with each other (cannibalisation); one page for two intents
					serves neither well.
				</List.Item>
				<List.Item>
					<b>Group clusters into topics.</b> A hub page covers the broad topic and links
					to the posts that cover each subtopic, and they link back — so both readers and
					Google see how the site's pages fit together.
				</List.Item>
				<List.Item>
					<b>Cover the topic, not the phrase.</b> Answer the related questions, name the
					things the topic involves, use the words a knowledgeable person would.
				</List.Item>
			</List>
			<Text size="sm">
				Inside a cluster, links are part of the meaning: the post “How to choose a CRM for
				an agency” links to the hub “CRM for small businesses” and to its neighbour “CRM
				rollout in 30 days”, with anchors that name their subjects. Google then sees which
				page answers the broad query and which the narrow one, and does not confuse them.
				More in “Internal and external links”.
			</Text>

			<Text fw={600}>Cannibalisation: when pages share one intent</Text>
			<Text>
				Cannibalisation is an SEO-industry term, not Google's: several pages of a site lay
				claim to the same intent, and for one query Google shows now one, now another. Links
				and behavioural signals are split between them rather than added up, and neither
				settles into the top. It is worth telling apart from the normal case: two pages of a
				site standing next to each other in the results and answering different sides of a
				query are no problem.
			</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					In Search Console open Performance, add a query filter (exact match) and switch
					to the pages tab.
				</List.Item>
				<List.Item>
					If impressions and clicks for one query are spread across two or three URLs and
					the average-position chart saws up and down, that is a candidate. Compare
					periods: pages that replace each other week to week are the main sign.
				</List.Item>
				<List.Item>
					Open both pages and answer the question: do they solve one reader's problem, or
					two?
				</List.Item>
			</List>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>One intent, both pages substantial</b> → merge them into one strong page, 301
					the weaker one to it, and update the internal links to point straight at the
					surviving URL.
				</List.Item>
				<List.Item>
					<b>The intents really are different</b> → pull them apart: its own title, H1,
					opening paragraph and focus for each, plus links to each other with anchors that
					name the difference (“pricing compared” and “how to set it up”).
				</List.Item>
				<List.Item>
					<b>Near-identical variants of one piece</b> (a print version, parameters, a
					duplicate in two categories) → rel=canonical to the main version.
				</List.Item>
				<List.Item>
					<b>Do not pick the winner with noindex:</b> Google advises against managing the
					choice of canonical that way — it simply removes the page from search, with all
					its signals.
				</List.Item>
			</List>

			<Text fw={600}>How this relates to the tracker</Text>
			<Text size="sm">
				In this tracker, the <b>Keywords</b> column shows what each post signals it is
				about, read from its title, H1, URL and text. Compare it with the cluster the post
				was meant for: when they differ, the post is not saying what you think. Two posts
				leading with the same keyword are flagged by “Two pages lead with the same keyword”
				(<Code>KEYWORD_CANNIBALISATION</Code>, Important). That is a sign, not proof: real
				cannibalisation is only visible in search data, and the tracker's positions are
				simulated — confirm it in Search Console's Performance report. The tracker does no
				keyword research: it has no search volumes.
			</Text>

			<Text fw={600}>Semantic HTML: markup that says what each part is</Text>
			<Text>
				Semantic elements describe the role of content, not its look:{" "}
				<Code>&lt;h1&gt;</Code> is the main heading, <Code>&lt;main&gt;</Code> the page's
				own content, <Code>&lt;article&gt;</Code> a self-contained post,{" "}
				<Code>&lt;nav&gt;</Code> navigation, <Code>&lt;aside&gt;</Code> something beside the
				point, <Code>&lt;time&gt;</Code> a date. Screen readers navigate by them, developers
				find their way by them, and crawlers use them to tell the article from the furniture
				around it — this tracker reads the article that holds the H1 and leaves out nav,
				sidebars and related-post widgets when it extracts keywords.
			</Text>
			<Code block>
				{`<body>
  <header><nav>…site menu…</nav></header>
  <main>
    <article>
      <h1>Local SEO checklist</h1>
      <p>Updated <time datetime="2026-09-28">28 September 2026</time></p>
      <h2>Claim your Business Profile</h2>
      <figure><img src="/img/profile.png" alt="…"><figcaption>…</figcaption></figure>
    </article>
    <aside>Related posts…</aside>
  </main>
  <footer>…</footer>
</body>`}
			</Code>
			<DoAvoid
				good={[
					"Plan pages from clusters of queries with one intent each.",
					"Link each topic's hub and its supporting posts to each other.",
					"Write the way an expert explains the subject, covering its related questions and naming the entities involved.",
					"Confirm a suspected cannibalisation in Search Console before merging pages.",
					"Use <article>, <main>, real headings and <time> for what they mean.",
				]}
				bad={[
					"One page per keyword variant (“seo audit”, “audit seo”, “seo audit guide”).",
					"Repeating the keyword to “signal relevance” — it is a spam signal.",
					"Removing a competing page with noindex instead of a 301 or a canonical.",
					"Headings made of styled <div>s and <span>s.",
					"Mixing two intents — a guide and a sales page — on one URL.",
				]}
			/>
		</GuideSection>
	);
}

/** Links within the site and out of it: what they do, how to write them, what this tracker checks. */
export function LinkingSection() {
	return (
		<GuideSection
			section={S.linking}
			sources={[
				SRC.crawlableLinks,
				SRC.qualifyLinks,
				SOURCES.evolvingNofollow,
				SOURCES.crawlBudgetGooglebot,
				SOURCES.pageRankSculpting,
				SRC.rankingSystems,
				SRC.howSearchWorks,
				SOURCES.linksReport,
				SRC.breadcrumbMarkup,
				SRC.javascriptSeo,
				SRC.canonical,
				SRC.starterGuide,
				SRC.helpfulContent,
				SRC.ahrefsInternalLinks,
				SRC.wcagLinkPurpose,
			]}
		>
			<Text>
				Links are how Google discovers pages, how it learns what they are about, and —
				through link analysis and PageRank — how it judges which pages matter. Every link
				also tells a reader where to go next. You have little control over the external
				links to a site; over the internal ones you have all of it, which makes them the
				cheapest lever in technical SEO.
			</Text>

			<Text fw={600}>The mechanism: internal PageRank and click depth</Text>
			<Text>
				PageRank's original idea: a page passes part of its importance to the pages it links
				to, and the more links a page gets from important pages, the more important it is.
				Google does not publish the current formula, but the model is useful inside a site
				too. The home page usually attracts the most external links, and importance flows
				from it along the internal links. A page three clicks from the home page with dozens
				of inbound links gets more than one seven clicks deep with a single inbound link
				from an archive.
			</Text>
			<Text>
				<b>Click depth</b> is the smallest number of link hops from the home page to a page.
				It is not a Google metric but a practical measure: the deeper a page, the later it
				is found through links and the fewer internal signals reach it. The industry's rule
				of thumb is to keep important pages within about three clicks of the home page; that
				is experience, not a Google requirement. On a blog the usual cause of depth is a
				paginated feed: a post that has drifted to page 40 of the archive is 40 clicks from
				the home page. The cure is categories, hubs and links from the text — not “faster”
				pagination.
			</Text>
			<Text>
				<b>An orphan page</b> is one no internal link points at; it can be found only
				through the sitemap or an external link. Google may index it, but it receives
				neither internal signals nor anchors, and usually ranks poorly. Orphans appear after
				a redesign, a change of menu, the removal of a category, or when a post is published
				quietly with nothing linking to it.
			</Text>

			<Text fw={600}>The levers of internal linking</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={200}>Lever</Table.Th>
						<Table.Th>What it gives you</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{INTERNAL_LEVERS.map((row) => (
						<Table.Tr key={row.lever}>
							<Table.Td>{row.lever}</Table.Td>
							<Table.Td>{row.does}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>The rules for internal links</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>
						Every page you care about needs a link from at least one other page of the
						site
					</b>{" "}
					— that is Google's own wording. Give a new post links from its topic hub and
					from two or three neighbouring posts on the day it is published.
				</List.Item>
				<List.Item>
					<b>Link from the text, in context.</b> A link inside a paragraph explains why
					the other page is relevant; navigation and footers repeat the same links on
					every page.
				</List.Item>
				<List.Item>
					<b>
						Only <Code>&lt;a href="…"&gt;</Code> with a real URL.
					</b>{" "}
					Google can generally follow only an <Code>&lt;a&gt;</Code> element with an href
					attribute. A button or a span with an onclick, an{" "}
					<Code>href="javascript:…"</Code> and a route in a fragment (
					<Code>href="#/pricing"</Code>) are dead ends to a crawler. An onclick is fine on
					top of a real href, but not instead of one.
				</List.Item>
				<List.Item>
					<b>Link to the final, canonical address</b> — https, the right host, no tracking
					parameters, no redirect in between. Every detour costs a request and blurs which
					URL is the real one.
				</List.Item>
				<List.Item>
					<b>Never nofollow your own pages.</b> It only withholds what the link would tell
					Google. It saves no crawl budget either: by Google's explanation the URL is
					crawled anyway if any other link without nofollow points at it — from your site
					or anyone else's. And it does not “redistribute weight”: back in 2009 Google
					explained that the share of PageRank a nofollowed link would carry does not flow
					to the page's other links, it is lost. To keep a section out of crawling Google
					offers robots.txt; to take a page out of the results, noindex.
				</List.Item>
				<List.Item>
					Keep it useful: there is no ideal number of links on a page, but too many make
					it cluttered and each one worth less to the reader.
				</List.Item>
			</List>

			<Text fw={600}>Anchor text — the clickable words</Text>
			<Text size="sm">
				Google reads the anchor text as a description of the page it points to; for an image
				link it reads the alt text. By Google's account, good anchor text is descriptive,
				reasonably short and relevant to both pages. Do not pack it with every keyword of
				the destination, and do not chain links right up against each other. Within a site,
				variety appears by itself when the anchor is woven into a sentence: different posts
				will link to the local-SEO hub as “local SEO checklist”, “how to prepare a Business
				Profile”, “our look at the local results”. The same exact keyword in every link to a
				page, especially in site-wide blocks, is a sign of over-optimisation, not help.
			</Text>
			<Code block>
				{`Good:  Read our <a href="/blog/local-seo-checklist/">local SEO checklist</a> before you start.
Bad:   To learn more, <a href="/blog/local-seo-checklist/">click here</a>.
Bad:   <a href="/blog/local-seo-checklist/">best local seo checklist local seo tips 2026</a>
Bad:   <span onclick="location='/blog/local-seo-checklist/'">checklist</span>
Bad:   <a onclick="go('/blog/local-seo-checklist/')">checklist</a>          <!-- no href -->
Bad:   <a href="#/blog/local-seo-checklist">checklist</a>                  <!-- fragment route -->`}
			</Code>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>A site crawler</b> (Screaming Frog SEO Spider or Sitebulb, say): crawl from
					the home page and sort the pages by Crawl Depth and by the number of unique
					internal inlinks. Important pages with one or two inlinks, or at a great depth,
					are the first candidates for linking.
				</List.Item>
				<List.Item>
					<b>Orphans:</b> compare the list of URLs the crawl found through links with the
					list in the sitemap (most crawlers can add the sitemap to a crawl). URLs that
					appear only in the sitemap are orphans.
				</List.Item>
				<List.Item>
					<b>Search Console, the Links report:</b> the Internal links block lists the
					pages most linked to within the site (Top linked pages); clicking a URL shows
					which pages link to it. The report is a sample, pages are grouped by canonical
					URL and the table caps at 1000 rows, so a full audit needs a crawler.
				</List.Item>
				<List.Item>
					<b>URL Inspection:</b> the indexing details say how Google found the page —
					through a sitemap or through a Referring page. If a post has only the sitemap,
					the links to it are weak.
				</List.Item>
				<List.Item>
					<b>Links in the source HTML:</b> open the source (Ctrl+U) or run{" "}
					<Code>curl -s URL | grep -o '&lt;a [^&gt;]*href="[^"]*"' | head</Code>. If the
					related-posts block's links are not in the source, JavaScript is adding them —
					look at the rendered HTML in URL Inspection to confirm Google sees them.
				</List.Item>
			</List>

			<Text fw={600}>Common scenarios</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>New posts sit in “Discovered – currently not indexed” for a long time</b> →
					only the sitemap and the blog feed point at them → add links from the hub and
					from neighbouring posts, and put the post in the category menu.
				</List.Item>
				<List.Item>
					<b>Old articles dropped after a redesign</b> → the template lost its
					related-posts block or its category links, so pages got deeper or became orphans
					→ compare inbound links before and after with two crawls, and put the routes
					back.
				</List.Item>
				<List.Item>
					<b>The links are visible in a browser but the crawler finds none</b> →
					navigation on onclick or on fragment routes → real <Code>&lt;a href&gt;</Code>,
					and routes through the History API.
				</List.Item>
				<List.Item>
					<b>Every link to a post carries nofollow</b> → “budget saving” in the theme or a
					plugin → take the attribute off; sections that do not belong in a crawl belong
					in robots.txt.
				</List.Item>
			</List>

			<Text fw={600}>External links — to other sites</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Cite your sources.</b> Linking to the research, data or documentation behind
					a claim builds trust with readers, and Google's helpful-content guidance names
					clear sourcing explicitly. Google also says in so many words that there is no
					need to be afraid of linking out.
				</List.Item>
				<List.Item>
					<b>Qualify links, don't hide them.</b> Use nofollow only for sources you do not
					trust — not for every external link. Mark paid links sponsored (or nofollow) and
					user-contributed ones ugc (or nofollow); the values combine:{" "}
					<Code>rel="ugc sponsored"</Code>.
				</List.Item>
				<List.Item>
					<b>They are hints, not commands.</b> Since 2019 Google has treated nofollow,
					sponsored and ugc as hints about which links to count; for crawling and
					indexing, nofollow became a hint on 1 March 2020.
				</List.Item>
				<List.Item>
					<b>Keep them alive.</b> A link to a page that no longer exists sends readers to
					an error.
				</List.Item>
			</List>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={140}>rel</Table.Th>
						<Table.Th>Use it for</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{REL_VALUES.map((row) => (
						<Table.Tr key={row.rel}>
							<Table.Td>
								<Code>{row.rel}</Code>
							</Table.Td>
							<Table.Td>{row.use}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				Links <i>to</i> your site from others (backlinks) are covered under Beyond this
				tracker.
			</Text>

			<Text fw={600}>What this tracker checks</Text>
			<Text size="sm">
				The article's own text only — navigation, sidebars, related-post blocks and footers
				are not counted. The checks (all Improvement level): “The content links to no other
				page of the site” (<Code>NO_INTERNAL_LINKS</Code>), “Internal links with nofollow” (
				<Code>INTERNAL_LINKS_NOFOLLOW</Code>), “Internal links to non-canonical URLs” (
				<Code>INTERNAL_LINK_VARIANTS</Code>), “Links on the site go through a redirect” (
				<Code>LINKS_TO_REDIRECTS</Code>), “Broken links in the text” (
				<Code>BROKEN_LINKS</Code>), “Links with no text” (<Code>LINKS_WITHOUT_TEXT</Code>),
				“Links Google cannot follow” (<Code>UNCRAWLABLE_LINKS</Code>) and, for posts from
				300 words, “No links to external sources” (<Code>NO_EXTERNAL_SOURCES</Code>).
				Orphans and click depth it does not compute: it crawls the sitemap's posts, not the
				site's link graph — that needs a site crawler. More in the Links and Content quality
				chapters of the check reference.
			</Text>
			<DoAvoid
				good={[
					"A few contextual links from each post to related posts and its hub page.",
					"Anchors that name the destination's subject.",
					"Links to the canonical https URL.",
					"Sources cited for facts, data and quotes.",
				]}
				bad={[
					"Orphan posts reachable only from the sitemap.",
					"“Click here”, “read more” or keyword-stuffed anchors.",
					"Links through old URLs that redirect, or with ?utm_ parameters.",
					"nofollow on internal links, or on every external link.",
				]}
			/>
		</GuideSection>
	);
}

/** Meta robots and X-Robots-Tag: the per-page rules for indexing and showing a page. */
export function MetaRobotsSection() {
	return (
		<GuideSection
			section={S.metaRobots}
			sources={[
				SRC.robotsMeta,
				SRC.blockIndexing,
				SRC.snippets,
				SRC.discover,
				SRC.canonical,
				SRC.javascriptSeo,
				SRC.pageIndexing,
				SOURCES.removalsTool,
				SOURCES.nginxHeaders,
				SOURCES.apacheHeaders,
			]}
		>
			<Text>
				The robots meta tag tells search engines, page by page, whether the page may be
				indexed and how it may be shown. It sits in <Code>&lt;head&gt;</Code>; the same
				rules can be sent as an <Code>X-Robots-Tag</Code> HTTP header, which is the only way
				for PDFs, images and other non-HTML files, and lets a server apply a rule to many
				URLs at once. With no tag at all, everything is allowed: the page may be indexed and
				Google picks the snippet.
			</Text>
			<Text>
				The mechanism that matters: Google reads these rules only when it fetches the page.
				robots.txt decides whether a page may be <i>crawled</i>; the meta tag and
				X-Robots-Tag decide whether it may be <i>indexed</i> and how it may be <i>shown</i>.
				If a page is blocked in robots.txt, Google never fetches it, never sees the noindex
				and ignores every indexing rule on it — while the URL itself can still land in the
				index with no content, if something links to it.
			</Text>
			<Code block>
				{`<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="googlebot" content="notranslate">   <!-- Google only -->
<meta name="robots" content="unavailable_after: 2026-12-31">

HTTP/1.1 200 OK
X-Robots-Tag: noindex                              <!-- e.g. for a PDF -->
X-Robots-Tag: googlebot: nofollow                  <!-- for one crawler only -->`}
			</Code>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={260}>Rule</Table.Th>
						<Table.Th>Means</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_RULES.map((row) => (
						<Table.Tr key={row.rule}>
							<Table.Td>
								<Code>{row.rule}</Code>
							</Table.Td>
							<Table.Td>{row.means}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm" c="dimmed">
				Google ignores <Code>noarchive</Code>, <Code>nocache</Code> and{" "}
				<Code>nositelinkssearchbox</Code>: the features they controlled no longer exist.
				There is no <Code>index</Code> or <Code>follow</Code> to “turn on” — they are the
				default.
			</Text>
			<Text fw={600}>How the rules combine</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>The more restrictive rule wins.</b> max-snippet:50 and nosnippet together
					mean nosnippet.
				</List.Item>
				<List.Item>
					<b>Generic and Google-specific tags add up.</b> A robots nofollow plus a
					googlebot noindex means Googlebot treats the page as noindex, nofollow.
				</List.Item>
				<List.Item>
					<b>The page must be crawlable.</b> Google reads these rules only when it fetches
					the page; if robots.txt blocks it, a noindex is never seen.
				</List.Item>
				<List.Item>
					<b>JavaScript will not remove a noindex.</b> On meeting a noindex in the source
					HTML, Google may skip rendering and running the JavaScript, so a script that
					changes or deletes such a meta tag may never run. The indexing decision belongs
					in the HTML the server sends.
				</List.Item>
				<List.Item>
					<b>data-nosnippet</b> on a span, div or section keeps just that text out of
					snippets.
				</List.Item>
			</List>

			<Text fw={600}>X-Robots-Tag on the server</Text>
			<Text size="sm">
				nginx — a rule for every PDF. The <Code>always</Code> parameter adds the header to
				responses with any status; without it nginx adds it only to 200, 201, 204, 206, 301,
				302, 303, 304, 307 and 308. The nginx trap: <Code>add_header</Code> directives are
				inherited from the level above only while the current level has no{" "}
				<Code>add_header</Code> of its own — add one inside a location and you lose the
				headers set in server (HSTS, for instance) and have to repeat them.
			</Text>
			<Code block>
				{`location ~* \\.pdf$ {
    add_header X-Robots-Tag "noindex" always;
}`}
			</Code>
			<Text size="sm">
				Apache (mod_headers must be enabled) — in the host's configuration or in .htaccess.{" "}
				<Code>Header set</Code> applies to successful responses; for the header to appear on
				error responses too, use <Code>Header always set</Code>.
			</Text>
			<Code block>
				{`<FilesMatch "\\.pdf$">
    Header set X-Robots-Tag "noindex"
</FilesMatch>`}
			</Code>

			<Text fw={600}>noindex, canonical and robots.txt are different tools</Text>
			<Text size="sm">
				noindex takes a page out of the results entirely. rel=canonical is a strong signal
				about which of several similar URLs to show; the duplicates are consolidated with
				the main version rather than vanishing. robots.txt governs crawling alone. Do not
				put a noindex and a canonical to another URL on the same page: the first says “do
				not show this page”, the second “this is a copy of that one”, and the signals
				contradict each other.
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={190}>The goal</Table.Th>
						<Table.Th>What to use</Table.Th>
						<Table.Th>What not to use</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{ROBOTS_TOOLS.map((row) => (
						<Table.Tr key={row.goal}>
							<Table.Td>{row.goal}</Table.Td>
							<Table.Td>{row.tool}</Table.Td>
							<Table.Td>{row.not}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					<b>The header:</b> <Code>curl -sI URL | grep -i x-robots</Code>. The -I flag
					sends a HEAD request, and some servers answer it differently from a GET, so when
					in doubt use <Code>curl -s -D - -o /dev/null URL | grep -i x-robots</Code>,
					adding <Code>-L</Code> for a URL that redirects.
				</List.Item>
				<List.Item>
					<b>The meta tag in the source HTML:</b>{" "}
					<Code>
						curl -s URL | grep -io
						'&lt;meta[^&gt;]*name="\(robots\|googlebot\)"[^&gt;]*&gt;'
					</Code>{" "}
					or Ctrl+U in a browser. Compare it with the Elements tab in DevTools: a tag that
					only appears or changes there is one JavaScript is touching.
				</List.Item>
				<List.Item>
					<b>URL Inspection</b> in Search Console: “Indexing allowed?” says whether Google
					found a noindex and where — in the meta tag or in the header. Test live URL
					shows the current state rather than the last crawl.
				</List.Item>
				<List.Item>
					<b>Page indexing:</b> the status “Excluded by ‘noindex’ tag” lists every such
					URL; “Indexed, though blocked by robots.txt” lists the URLs where a noindex
					cannot work while the page is blocked in robots.txt.
				</List.Item>
			</List>

			<Text fw={600}>Common scenarios</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>Posts disappeared from the results after a release</b> → a noindex travelled
					from staging, or the CMS's global “discourage search engines” switch got turned
					on → remove the rule and request indexing of the key URLs in URL Inspection.
				</List.Item>
				<List.Item>
					<b>A page with a noindex stays in the index for months</b> → it is blocked in
					robots.txt and Google cannot see the tag → drop the Disallow, wait for the page
					to fall out, and only then block it again if you must.
				</List.Item>
				<List.Item>
					<b>PDFs and attachments rank instead of pages</b> → the files carry no
					X-Robots-Tag → add a rule to the server configuration, as in the examples above.
				</List.Item>
				<List.Item>
					<b>The campaign ended but its page is still in the results</b> → set
					unavailable_after with the end date in advance, or 301 the page afterwards to
					the current one.
				</List.Item>
			</List>

			<Text fw={600}>Typical uses</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					Blog posts: no restriction; optionally max-image-preview:large for Discover.
				</List.Item>
				<List.Item>Internal search results, thank-you and cart pages: noindex.</List.Item>
				<List.Item>PDFs you do not want in search: X-Robots-Tag: noindex.</List.Item>
				<List.Item>Staging sites: password protection, not just noindex.</List.Item>
			</List>
			<Text fw={600}>What this tracker checks</Text>
			<Text size="sm">
				It reads every robots and googlebot meta tag and X-Robots-Tag header of every
				crawled post; rules in the header addressed to another crawler (
				<Code>bingbot: noindex</Code>, say) are not counted.
				<b> “The page is set to noindex”</b> (<Code>NOINDEX</Code>: noindex, none, or a past
				date in unavailable_after) is Critical;{" "}
				<b>“The snippet in results is restricted”</b> (<Code>SNIPPET_RESTRICTED</Code>:
				nosnippet, max-snippet:0, or data-nosnippet around most of the article) and{" "}
				<b>“Large image previews are not allowed”</b> (<Code>IMAGE_PREVIEW_NOT_LARGE</Code>)
				are Improvements. A page-wide nofollow is not reported on its own.
			</Text>
			<DoAvoid
				good={[
					"Leave posts without restrictions unless there is a reason.",
					"Use noindex for pages with no search value, and keep them crawlable.",
					"Use X-Robots-Tag for files that cannot carry a meta tag, and verify it with curl.",
					"Use a 301 or a canonical for duplicates, and noindex to take a page out of the results.",
				]}
				bad={[
					"A noindex left on from staging or a plugin setting.",
					"noindex plus a robots.txt Disallow on the same URL — the noindex is never read.",
					"A noindex and a canonical to another URL on the same page.",
					"Adding or removing a noindex with JavaScript.",
					"nosnippet on posts that need clicks: no description, no AI Overview quotes.",
					"A page-wide nofollow that cuts off every link on the page.",
				]}
			/>
		</GuideSection>
	);
}
