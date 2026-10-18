import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** The pages these two chapters rest on that the shared list does not carry. */
const SOURCES = {
	canonicalization: {
		title: "Google Search Central: What is URL canonicalization",
		url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
	},
	canonicalTroubleshooting: {
		title: "Google Search Central: Fix canonicalization issues",
		url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting",
	},
	facetedNavigation: {
		title: "Google: Managing crawling of faceted navigation URLs",
		url: "https://developers.google.com/crawling/docs/faceted-navigation",
	},
	pagination: {
		title: "Google Search Central: Pagination, incremental page loading, and their impact on Google Search",
		url: "https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading",
	},
	lazyLoading: {
		title: "Google Search Central: Fix lazy-loaded content",
		url: "https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading",
	},
	urlParametersTool: {
		title: "Google Search Central Blog: Spring cleaning: the URL Parameters tool (2022)",
		url: "https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated",
	},
	localeAdaptive: {
		title: "Google Search Central: How Google crawls locale-adaptive pages",
		url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
	},
	internationalTargeting: {
		title: "Search Console Help: The International Targeting report is deprecated",
		url: "https://support.google.com/webmasters/answer/12474899",
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

const DUPLICATE_KINDS = [
	{
		kind: "Scheme and host",
		example: "http://example.com/post/ and https://www.example.com/post/",
		fix: "One server-side 301 from every variant straight to the working address; only that one in the canonical, the sitemap and the links.",
	},
	{
		kind: "Trailing slash",
		example: "/blog/post and /blog/post/",
		fix: "To Google these are different URLs (except at the site root). Pick one form and 301 the other.",
	},
	{
		kind: "Case",
		example: "/Blog/Post/ and /blog/post/",
		fix: "Google treats URL paths as case-sensitive. 301 to lower case, and link in lower case only.",
	},
	{
		kind: "Index file",
		example: "/blog/ and /blog/index.html",
		fix: "301 to the directory address; never link to index.html or index.php.",
	},
	{
		kind: "Tracking parameters",
		example: "?utm_source=…, ?gclid=…, ?fbclid=…",
		fix: "A canonical to the clean URL; no tags in internal links — tags are for external campaigns only.",
	},
	{
		kind: "Sessions",
		example: "?sid=8f3a…, ;jsessionid=…",
		fix: "Keep the session in a cookie, not in the URL. For the ones already out there, a canonical or a 301 to the clean address.",
	},
	{
		kind: "Sorting, view, items per page",
		example: "?sort=price, ?view=grid, ?per_page=48",
		fix: "If there are many such URLs, Disallow them in robots.txt; if few, a canonical to the main listing. Do not multiply them with links.",
	},
	{
		kind: "Print versions",
		example: "/post/print/, ?print=1",
		fix: "Better to print with CSS @media print and no separate URL; otherwise a canonical to the main page.",
	},
	{
		kind: "A staging copy of the site",
		example: "staging.example.com, open to crawling",
		fix: "Protect it with a password (HTTP auth) — a noindex or robots.txt on staging travels to production all too easily.",
	},
	{
		kind: "Near-identical articles",
		example: "two posts on one topic, city pages from one template",
		fix: "Merge them into one with a 301 from the second, or make them genuinely different. A canonical here is a crutch.",
	},
	{
		kind: "Syndication on other sites",
		example: "your article reprinted by a partner",
		fix: "The partner puts a noindex on the copy; a link back to the original is welcome.",
	},
	{
		kind: "Regional versions in one language",
		example: "/en-us/pricing/ and /en-gb/pricing/",
		fix: "Hreflang plus real differences (currency, prices, shipping, contacts) — see “Hreflang and international sites”.",
	},
] as const;

const FACETS = [
	{
		goal: "The facets do not belong in search (colour, size, “in stock”)",
		how: [
			"Block the filter parameters in robots.txt, leaving the product pages and one unfiltered listing reachable.",
			"Or keep the filter state in the fragment (#color=red): Google normally does not crawl fragments, so such filters cost no crawling at all.",
			"Google calls a canonical and nofollow less effective in the long run — the URLs are still crawled.",
		],
	},
	{
		goal: "The facets belong in search (“Nike trainers” as a landing page, say)",
		how: [
			"Use the standard & as the parameter separator (commas, semicolons and brackets are harder for crawlers to recognise).",
			"Keep a stable filter order and no repeats (?brand=nike&brand=nike).",
			"Answer 404 for a combination with no results — not a redirect to a general “nothing found” page. 404 as well for meaningless or repeated filters, and for pagination pages that do not exist.",
			"Index only the intersections you chose (category + brand) and block the rest — otherwise the number of URLs grows combinatorially.",
		],
	},
] as const;

/** Duplicates at the scale of a site: where they come from, and parameters, facets, pagination, syndication. */
export function DuplicatesSection() {
	return (
		<GuideSection
			section={S.duplicates}
			sources={[
				SOURCES.canonicalization,
				SRC.canonical,
				SOURCES.canonicalTroubleshooting,
				SRC.urlStructure,
				SOURCES.urlParametersTool,
				SOURCES.facetedNavigation,
				SOURCES.pagination,
				SOURCES.lazyLoading,
				SRC.robotsSpec,
				SRC.spamPolicies,
			]}
		>
			<Text>
				“Canonicals: choosing the URL” explains the tag itself. This chapter is the site
				level: where thousands of surplus URLs come from, and how to stop them appearing.
				Google groups pages with identical or near-identical content into a <b>cluster</b>{" "}
				and picks a canonical URL in it — in its own words, the one that is objectively most
				complete and useful to users. The cluster's other URLs do not usually appear in
				results, and the signals (links, for instance) go to the canonical.
			</Text>
			<Text>
				Duplicates are not a penalty in themselves: Google simply shows one URL. The harm is
				elsewhere — it may pick the wrong address (the one with the utm tag, the http
				version, the print page), it spends crawling on copies instead of new pages, and
				reports split one page's traffic across several URLs. Abuse begins where copies are
				made to cover more queries: near-identical pages from one template are what Google's
				spam policies call doorways.
			</Text>

			<Text fw={600}>Where duplicates come from, and what to do</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={170}>Kind of duplicate</Table.Th>
						<Table.Th>Example</Table.Th>
						<Table.Th>What to do</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{DUPLICATE_KINDS.map((row) => (
						<Table.Tr key={row.kind}>
							<Table.Td fw={600}>{row.kind}</Table.Td>
							<Table.Td>
								<Code>{row.example}</Code>
							</Table.Td>
							<Table.Td>{row.fix}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				What guides Google's choice: a <b>redirect</b> and <b>rel="canonical"</b> are strong
				signals, <b>being in a sitemap</b> a weak one; beyond that it prefers the HTTPS
				version to the HTTP one and URLs that belong to an hreflang cluster, and it notes
				which address the internal links point at. Your choice is a hint, not a rule: where
				the signals disagree (a canonical to one URL, links and the sitemap to another),
				Google decides for itself. Fixing duplicates is therefore a matter of making every
				signal agree, not of one tag.
			</Text>

			<Text fw={600}>URL parameters</Text>
			<Text>
				The URL Parameters tool in Search Console is gone: Google announced its retirement
				on 28 March 2022 and removed it a month later, saying only about 1% of the settings
				configured in it were useful for crawling. Parameters are now managed on the site
				alone:
			</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>One URL per state.</b> Build URLs with one function: a fixed parameter order,{" "}
					<Code>=</Code> and <Code>&amp;</Code> as separators, no empty values. Then{" "}
					<Code>?brand=nike&amp;color=red</Code> and{" "}
					<Code>?color=red&amp;brand=nike</Code> never both exist.
				</List.Item>
				<List.Item>
					<b>A canonical</b> from the parameterised URL to the clean one — for parameters
					that do not change the content (tags, sessions) and that are few.
				</List.Item>
				<List.Item>
					<b>robots.txt</b> — for parameters that spawn thousands of URLs (sorting, view,
					calendars). Mind two traps: on a blocked URL Google cannot see the canonical, so
					no signals are passed; and a blocked URL with many links to it can be indexed
					with no content. So for one kind of parameter, pick one method — either a
					canonical or a Disallow.
				</List.Item>
				<List.Item>
					<b>Do not link</b> to junk combinations with <Code>&lt;a href&gt;</Code>: every
					link is an invitation to crawl. A sort control can be a form or a button that
					changes the fragment.
				</List.Item>
			</List>
			<Code block>
				{`User-agent: *
# sort and view variants are never needed in search
Disallow: /*?sort=
Disallow: /*&sort=
Disallow: /*?view=
Disallow: /*&view=
# "/*?*sort=" is shorter but also blocks ?presort= and ?sort_by=
# session ids belong in a cookie; block the leftovers
Disallow: /*?*sessionid=`}
			</Code>

			<Text fw={600}>Faceted navigation</Text>
			<Text>
				Catalogue filters (brand × colour × size × price) are the prime source of endless
				URLs. Google's document on managing the crawling of faceted navigation (published in
				December 2024 and updated since) splits the problem in two:
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{FACETS.map((row) => (
						<Table.Tr key={row.goal}>
							<Table.Td w={220} fw={600}>
								{row.goal}
							</Table.Td>
							<Table.Td>
								<List size="sm" spacing={2}>
									{row.how.map((item) => (
										<List.Item key={item}>{item}</List.Item>
									))}
								</List>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Code block>
				{`# Google's pattern: block the filters, keep one unfiltered listing
User-agent: Googlebot
Disallow: /*?*products=
Disallow: /*?*color=
Disallow: /*?*size=
Allow: /*?products=all$`}
			</Code>
			<Text size="sm">
				In a single-page application returning a 404 for an empty combination may be
				impossible — then the SPA rules from “Rendering and JavaScript” apply (redirect to a
				URL that answers 404, or a noindex on the “nothing found” view).
			</Text>

			<Text fw={600}>Pagination</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					Google does not use <Code>rel="next"</Code> and <Code>rel="prev"</Code> (other
					engines may) — it finds the pages of a series through ordinary links.
				</List.Item>
				<List.Item>
					<b>Each page's canonical points at itself.</b> Not at the first page: page 2 is
					not a duplicate of page 1, it holds different posts, and a canonical to the
					first page can cut Google's route to them.
				</List.Item>
				<List.Item>
					Join the pages with <Code>&lt;a href&gt;</Code> links — each to the next; to the
					first as well, if you like. Google accepts identical titles and descriptions
					across a series.
				</List.Item>
				<List.Item>
					<b>Infinite scroll and “Load more”.</b> Googlebot presses no buttons. Give each
					chunk a permanent unique URL (<Code>?page=3</Code>), join them with sequential
					links, and update the address bar through the History API as they load — then a
					chunk can be opened, reloaded and bookmarked.
				</List.Item>
				<List.Item>
					Do not noindex pagination pages without reason: Google advises giving them a
					canonical of their own rather than hiding them. A noindex suits the sort and
					filter variants of that series.
				</List.Item>
				<List.Item>
					<Code>/blog/?page=1</Code> is a duplicate of <Code>/blog/</Code>: 301 it there,
					and make the “1” link point at <Code>/blog/</Code>. A page that does not exist (
					<Code>?page=999</Code>) answers 404.
				</List.Item>
			</List>
			<Code block>
				{`<!-- https://example.com/blog/?page=2 -->
<head>
  <title>Blog — page 2 | Example</title>
  <link rel="canonical" href="https://example.com/blog/?page=2">
</head>
<body>
  <!-- posts 11–20 -->
  <nav aria-label="Pagination">
    <a href="https://example.com/blog/">1</a>
    <a href="https://example.com/blog/?page=2" aria-current="page">2</a>
    <a href="https://example.com/blog/?page=3">3</a>
    <a href="https://example.com/blog/?page=3" id="load-more">Load more</a>
  </nav>
</body>

<script>
  // "Load more" is a real link; JavaScript only makes it nicer
  document.getElementById("load-more").addEventListener("click", async (event) => {
    event.preventDefault();
    const next = new URL(event.currentTarget.href);
    const html = await (await fetch(next)).text();
    appendPosts(html);                       // insert posts 21–30
    history.pushState({}, "", next);         // the address bar now says ?page=3
    updateLoadMoreLink(next);                // point the link at ?page=4
  });
</script>`}
			</Code>

			<Text fw={600}>Syndication</Text>
			<Text size="sm">
				If another site reprints your article, Google's documentation has advised since May
				2023 against solving it with a canonical from the copy to the original: syndicated
				pages often differ a great deal (their own template, their own blocks), and the hint
				may not take. The most effective thing, by Google's account, is for the partner to
				keep the copy out of the index (<Code>noindex</Code>). Put that in the contract; a
				link from the copy to the original is useful in any case. Cross-domain canonicals
				are still supported — between the sites of one company, for instance.
			</Text>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Search Console → URL Inspection on a page that matters: compare the
					User-declared canonical with the Google-selected canonical. Where they differ,
					look for the signal pulling Google the other way.
				</List.Item>
				<List.Item>
					Page indexing: the statuses “Duplicate without user-selected canonical” and
					“Duplicate, Google chose different canonical than user”. Open the example URLs —
					they show which template is spawning duplicates (a parameter, case, a slash).
				</List.Item>
				<List.Item>
					Request every variant of one page's address — each should reach the one working
					URL in a single 301, and that one should answer 200:
				</List.Item>
			</List>
			<Code block>
				{`for u in http://example.com/blog/post/ https://www.example.com/blog/post/ \\
         https://example.com/blog/post https://example.com/Blog/Post/ \\
         https://example.com/blog/post/index.html; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}  $u\\n" "$u"
done
# expected: 301 https://example.com/blog/post/ for every line`}
			</Code>
			<List type="ordered" size="sm" spacing={4} start={4}>
				<List.Item>
					In the server logs, count the share of Googlebot requests to URLs with a{" "}
					<Code>?</Code> (see “Googlebot in the server logs”). If it is large and those
					URLs do not belong in search, the crawl budget is going on parameters.
				</List.Item>
				<List.Item>
					Crawl the site and group URLs by identical title or text checksum: the groups
					are the duplicate clusters.
				</List.Item>
			</List>

			<DoAvoid
				goodTitle="Symptom → what to do"
				badTitle="The mistakes that cause it"
				good={[
					"A URL with utm or ?ref= in results → a canonical to the clean address, and tags out of the internal links.",
					"Google picked the http or www version → a server-side 301 and one host in the canonical, the sitemap and the links.",
					"Catalogue pages 2+ are not indexed and their posts cannot be found → a self-canonical and <a href> links between the pages.",
					"Thousands of “Discovered – currently not indexed” with parameters → Disallow the filters, 404 the empty combinations.",
				]}
				bad={[
					"A canonical from every pagination page to the first.",
					"robots.txt and a canonical on the same URLs — Google cannot see a canonical behind a Disallow.",
					"A noindex on duplicates instead of a canonical — the signals are not consolidated, the page simply disappears.",
					"Links to sorts and filters in every template — an endless URL space.",
				]}
			/>

			<CheckedHere checks="the tracker crawls the pages in the sitemap and checks whether they create duplicates themselves: No canonical (CANONICAL_MISSING), The canonical points at another page (CANONICAL_MISMATCH), Internal links to non-canonical URLs (INTERNAL_LINK_VARIANTS), Links on the site go through a redirect (LINKS_TO_REDIRECTS), Almost the same text as another page (NEAR_DUPLICATE_CONTENT), The same title as another page (TITLE_DUPLICATE), The same meta description as another page (META_DESCRIPTION_DUPLICATE); at site level — The site is also served from another host or scheme (HOST_VARIANT_SERVES_CONTENT), Host redirects chain or are temporary (HOST_REDIRECT_CHAIN), The sitemap lists URLs on another scheme or host variant (SITEMAP_LISTS_OTHER_HOST_VARIANTS). Pagination, facets and parameter rules it does not check — look at those in Search Console and the logs." />
		</GuideSection>
	);
}

const HREFLANG_METHODS = [
	{
		method: "A <link> tag in <head>",
		fits: "Ordinary HTML pages, with a small number of versions.",
		limits: "Every version lists all the others — with 20 languages that is 20+ tags on every page; it is only read inside <head>.",
	},
	{
		method: "The Link HTTP header",
		fits: "Files with no <head>: PDFs, documents.",
		limits: "Set on the server or the CDN, so it is invisible in the page source — check it with curl -I.",
	},
	{
		method: "A sitemap with xhtml:link",
		fits: "Large sites and many languages: the markup does not weigh the HTML down and is generated from one source.",
		limits: "Every <url> lists all versions, itself included; the child xhtml:link elements do not count towards the sitemap's URL limit.",
	},
] as const;

const HREFLANG_RULES = [
	[
		"A link to itself",
		"Every version lists itself and all the others. The set is identical on all of them.",
	],
	[
		"Reciprocity",
		"If A points at B, B must point at A, or Google ignores that pair's annotations.",
	],
	[
		"x-default",
		"The fallback URL for users whose language and region match no version: usually a language-picker page, or a home page that redirects by language.",
	],
	[
		"Language code",
		"ISO 639-1, two letters: en, de, uk (Ukrainian), kk (Kazakh), ja (Japanese). A region without a language is not allowed.",
	],
	[
		"Region code (optional)",
		"ISO 3166-1 Alpha 2 after the language: en-GB, de-AT, pt-BR. The codes EU, UN and UK do not work; Google does not support es-419.",
	],
	[
		"Script (optional)",
		"ISO 15924 after the language: zh-Hans (simplified), zh-Hant (traditional), sr-Latn.",
	],
	[
		"Addresses",
		"Full ones only: https://example.com/de/, not /de/. The versions may live on different domains.",
	],
	[
		"Which URLs to list",
		"Canonical ones that answer 200: not redirects, not pages with a noindex, and not pages whose canonical points elsewhere.",
	],
] as const;

const HREFLANG_STRUCTURES = [
	{
		option: "Country domain (ccTLD): example.de",
		pros: "A strong, unambiguous country signal; the server's location does not matter; the sites are easy to separate.",
		cons: "Expensive and not always available (some zones have strict requirements for the owner); more infrastructure; it targets one country only.",
	},
	{
		option: "Subdomain: de.example.com",
		pros: "Easy to set up; the versions can sit on different servers; the sites are easy to separate.",
		cons: "The URL does not always make it clear whether “de” is a language or a country.",
	},
	{
		option: "Subdirectory: example.com/de/",
		pros: "Easy to set up and maintain — everything on one host.",
		cons: "The URL does not always make the targeting clear; one server; the sites are harder to separate.",
	},
	{
		option: "Parameter: example.com/?lang=de",
		pros: "—",
		cons: "Google advises against it: segmenting by URL is hard and the user cannot see the targeting.",
	},
] as const;

/** hreflang: the three ways to declare it, the rules a set must keep, and how a multi-country site is laid out. */
export function HreflangSection() {
	return (
		<GuideSection
			section={S.hreflangGuide}
			sources={[
				SRC.hreflang,
				SRC.multiRegional,
				SRC.canonical,
				SOURCES.canonicalization,
				SOURCES.internationalTargeting,
				SOURCES.localeAdaptive,
				SRC.wcagLanguage,
			]}
		>
			<Text>
				Hreflang tells Google that several URLs are localised variants of the same content,
				and helps show each user the version in their language or for their country:{" "}
				<Code>/de/</Code> to a German reader, <Code>/en-gb/</Code> to a British one. What
				hreflang does not do: it does not set the page's language (Google works that out
				from the visible text and uses neither hreflang nor the <Code>lang</Code> attribute
				for it), and it does not lift a page in results — it only swaps one URL of the set
				for another.
			</Text>
			<Text>
				Hreflang is <b>a signal, not a directive</b>: Google may ignore annotations that
				break the rules, and then it chooses a version itself. One important boundary:
				translations into different languages are not duplicates — but only if the main
				content is translated. If only the menu and the footer are translated and the text
				is the same, they are duplicates. Same-language versions for different countries
				(en-US and en-GB) may also be seen as duplicates — hreflang helps show each country
				its own URL, and real differences (currency, prices, shipping, phone numbers) make
				the versions genuinely different.
			</Text>

			<Text fw={600}>Three equivalent ways to declare hreflang</Text>
			<Text size="sm">
				To Google the methods are equivalent. Pick one: the same set declared in two places
				starts to drift apart.
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={170}>Method</Table.Th>
						<Table.Th>When it fits</Table.Th>
						<Table.Th>Limits</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{HREFLANG_METHODS.map((row) => (
						<Table.Tr key={row.method}>
							<Table.Td fw={600}>{row.method}</Table.Td>
							<Table.Td>{row.fits}</Table.Td>
							<Table.Td>{row.limits}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Code block>
				{`<!-- 1. HTML, on https://example.com/de/preise/ — the same set on every version -->
<head>
  <link rel="canonical" href="https://example.com/de/preise/">
  <link rel="alternate" hreflang="de" href="https://example.com/de/preise/">
  <link rel="alternate" hreflang="en" href="https://example.com/en/pricing/">
  <link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/pricing/">
  <link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/">
</head>`}
			</Code>
			<Code block>
				{`# 2. HTTP header, for https://example.com/en/guide.pdf (one line in the real response)
HTTP/1.1 200 OK
Content-Type: application/pdf
Link: <https://example.com/en/guide.pdf>; rel="alternate"; hreflang="en", <https://example.com/de/leitfaden.pdf>; rel="alternate"; hreflang="de"`}
			</Code>
			<Code block>
				{`<!-- 3. Sitemap: every <url> lists all versions, itself included -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en/pricing/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/preise/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/"/>
  </url>
  <url>
    <loc>https://example.com/de/preise/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/preise/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/"/>
  </url>
</urlset>`}
			</Code>

			<Text fw={600}>The rules a set must keep</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Tbody>
					{HREFLANG_RULES.map(([rule, means]) => (
						<Table.Tr key={rule}>
							<Table.Td w={190} fw={600}>
								{rule}
							</Table.Td>
							<Table.Td>{means}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Text fw={600}>Hreflang and the canonical</Text>
			<Text size="sm">
				Each language version's canonical points at itself — the German page at the German
				one, never at the English. A canonical to another language tells Google “this page
				is a copy of that one”, and the German version can fall out of the index, and with
				it out of its own hreflang set. Google asks explicitly for a canonical URL in the
				same language (or the closest one, where there is no same-language version). The
				same rule has two corollaries: only canonical URLs belong in an hreflang set, and
				when clustering, Google prefers URLs that are part of an hreflang set.
			</Text>

			<Text fw={600}>Do not redirect by IP or browser language</Text>
			<Text size="sm">
				Googlebot crawls mostly from IP addresses in the United States and sends requests
				with no <Code>Accept-Language</Code> header. If the site redirects by IP or browser
				language, Google sees one version and may never find the others. A user travelling
				abroad cannot open the version they need either. The right way: every version has
				its own permanent URL that opens without a redirect; every page links to the other
				languages; and instead of a forced redirect, an unobtrusive offer to switch.
				Redirecting by language is acceptable only from a dedicated picker page, the home
				page <Code>/</Code>, say — and that one is worth declaring as <Code>x-default</Code>
				. The same goes for a language kept in a cookie or chosen from{" "}
				<Code>Accept-Language</Code> on a single URL: Google calls such pages
				locale-adaptive and recommends separate addresses with hreflang instead. The cases —
				translation, region, partial translation, one URL — and what to put in the canonical
				and hreflang for each, are in “Canonicals: choosing the URL”.
			</Text>

			<Text fw={600}>Country domain, subdomain or subdirectory</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={190}>Structure</Table.Th>
						<Table.Th>For</Table.Th>
						<Table.Th>Against</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{HREFLANG_STRUCTURES.map((row) => (
						<Table.Tr key={row.option}>
							<Table.Td fw={600}>{row.option}</Table.Td>
							<Table.Td>{row.pros}</Table.Td>
							<Table.Td>{row.cons}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				Google works out the target country from the ccTLD, from hreflang (in tags, headers
				or the sitemap), from the server's location, and from indirect signs: local
				addresses and phone numbers, language and currency, links from local sites, the
				company's Google profile. Meta tags such as <Code>geo.position</Code> it ignores,
				and some “country domains” like <Code>.tv</Code> and <Code>.me</Code> it treats as
				generic (gTLDs). Google removed the country-targeting setting and the International
				Targeting report from Search Console in September 2022 — the country is now stated
				by the site's structure and hreflang alone. For most companies subdirectories are
				the cheapest to maintain; a ccTLD earns its keep when each country has its own team,
				legal entity or range.
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
					<Table.Tr>
						<Table.Td>British readers are shown the American version</Table.Td>
						<Table.Td>
							<Code>hreflang="en-uk"</Code> — UK is not an ISO 3166-1 country code
						</Table.Td>
						<Table.Td>
							<Code>en-GB</Code>. Likewise <Code>ua</Code> → <Code>uk</Code>,{" "}
							<Code>jp</Code> → <Code>ja</Code>
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>The set does not work although the tags are there</Table.Td>
						<Table.Td>
							No return link: the translation does not name the original
						</Table.Td>
						<Table.Td>
							Generate the set for every version from one mapping table
						</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>A language version is not in the index</Table.Td>
						<Table.Td>Its canonical points at the main language</Table.Td>
						<Table.Td>A canonical to itself</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>The set contains URLs that redirect</Table.Td>
						<Table.Td>
							Hreflang to non-canonical addresses: no trailing slash, http, old URLs
							after a move
						</Table.Td>
						<Table.Td>List the final URLs, the ones that answer 200</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Different versions list different numbers of languages</Table.Td>
						<Table.Td>
							A translation was added and the older versions never rebuilt (a cache,
							static generation)
						</Table.Td>
						<Table.Td>Rebuild every version after adding a language</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Google does not see the tags</Table.Td>
						<Table.Td>
							Hreflang in <Code>&lt;body&gt;</Code>, or after a tag that ends the head
						</Table.Td>
						<Table.Td>
							Move them to the start of <Code>&lt;head&gt;</Code>
						</Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Open each version's source (Ctrl+U) and write out the set: it must be the same
					on every version, the page itself included. It is safer when the tags are
					already in the server's HTML rather than added by JavaScript.
				</List.Item>
				<List.Item>
					For files and server configuration check the header; for a sitemap, that every{" "}
					<Code>&lt;url&gt;</Code> lists all the versions:
				</List.Item>
			</List>
			<Code block>
				{`curl -s https://example.com/de/preise/ | grep -io '<link[^>]*hreflang[^>]*>'
curl -sI https://example.com/en/guide.pdf | grep -i '^link:'
# every URL in the set should answer 200 without a redirect
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" https://example.com/en-gb/pricing/`}
			</Code>
			<List type="ordered" size="sm" spacing={4} start={3}>
				<List.Item>
					There is no separate hreflang report in Search Console any more. In URL
					Inspection, check each version's Google-selected canonical: if the German page's
					is the English one, the text is probably untranslated, or the canonical points
					the wrong way.
				</List.Item>
				<List.Item>
					In the Performance report, filter by country and page: impressions for{" "}
					<Code>/en/</Code> in the United Kingdom while <Code>/en-gb/</Code> exists mean
					the set is not working.
				</List.Item>
				<List.Item>
					For hundreds of pages, use a crawler with hreflang validation: reciprocity
					cannot be checked by hand.
				</List.Item>
			</List>

			<CheckedHere checks="Hreflang has errors (HREFLANG_INVALID) — non-ISO codes, relative addresses, tags outside <head>, a canonical to another URL; Hreflang does not include this page (HREFLANG_NO_SELF_REFERENCE); Hreflang without a return link (HREFLANG_NOT_RECIPROCAL) — over the versions that answered 200 straight away during the crawl, with no return link required from x-default; Language not declared (LANG_MISSING) — no effect on position, this is accessibility; Lighthouse: hreflang has an invalid language code or URL (LH_HREFLANG). The tracker reads hreflang only from the page's HTML: annotations in a Link header or a sitemap it cannot see, and those checks do not apply to such a page. It does not treat a trailing slash as a difference, while Google treats those as different URLs — list the exact address in the set." />
		</GuideSection>
	);
}
