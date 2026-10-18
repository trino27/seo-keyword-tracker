/**
 * The guide's chapters, in reading order: the side navigation lists them and each section
 * takes its id from here, so a link and its target cannot drift apart. The check
 * reference is not listed here — its chapters come from the catalogue — and sits between
 * Core Web Vitals and Beyond this tracker.
 */
export const GUIDE_SECTIONS = {
	howItWorks: { id: "how-it-works", label: "How the tracker works" },
	screens: { id: "screens", label: "Reading the screens" },
	outcomes: { id: "check-outcomes", label: "Check outcomes" },
	severity: { id: "severity", label: "Severity levels" },
	score: { id: "score", label: "The SEO score" },
	keywords: { id: "keywords", label: "Keywords" },
	positions: { id: "positions", label: "Positions" },
	howSearchWorks: { id: "how-search-works", label: "Crawling and indexing" },
	crawlDiscovery: { id: "crawl-discovery", label: "URL discovery and crawl scheduling" },
	rendering: { id: "rendering", label: "Rendering and JavaScript" },
	crawlBudget: { id: "crawl-budget", label: "Crawl budget" },
	indexDebugging: { id: "index-debugging", label: "Debugging: the page is not indexed" },
	mobileFirst: { id: "mobile-first", label: "Mobile-first indexing" },
	serverLogs: { id: "server-logs", label: "Googlebot in the server logs" },
	indexStatus: { id: "index-status", label: "Getting indexed: statuses" },
	ranking: { id: "ranking", label: "What makes a page rank" },
	semantics: { id: "semantics", label: "Semantics and topics" },
	onPage: { id: "on-page", label: "On-page basics" },
	titles: { id: "titles-guide", label: "Titles and title links" },
	descriptions: { id: "descriptions-guide", label: "Meta descriptions and snippets" },
	headingsGuide: { id: "headings-guide", label: "Headings: the page outline" },
	linking: { id: "linking", label: "Internal and external links" },
	canonicals: { id: "canonicals-guide", label: "Canonicals: choosing the URL" },
	structuredData: { id: "structured-data-guide", label: "Structured data and rich results" },
	duplicates: { id: "duplicates-facets", label: "Duplicates, parameters, pagination and facets" },
	technical: { id: "technical", label: "Technical SEO" },
	statusRedirects: { id: "status-redirects", label: "Status codes and redirects in detail" },
	sitemaps: { id: "sitemaps-guide", label: "Sitemaps in detail" },
	httpHeaders: { id: "http-headers", label: "HTTP headers for SEO" },
	robotsTxt: { id: "robots-txt", label: "robots.txt in detail" },
	metaRobots: { id: "meta-robots", label: "Meta robots" },
	metaRel: { id: "meta-rel", label: "Meta tags and rel values: a reference" },
	hreflangGuide: { id: "hreflang-guide", label: "Hreflang and international sites" },
	cwv: { id: "cwv", label: "What Core Web Vitals are" },
	lcp: { id: "lcp", label: "LCP — loading" },
	inp: { id: "inp", label: "INP — responsiveness" },
	cls: { id: "cls", label: "CLS — visual stability" },
	cwvDiagnostics: {
		id: "cwv-diagnostics",
		label: "Diagnosing the vitals: field, lab, attribution",
	},
	speedHere: { id: "speed-measurement", label: "How speed is measured here" },
	spaHowSeen: { id: "spa-how-seen", label: "How search engines see an SPA" },
	spaRouting: { id: "spa-routing", label: "SPA: routes, URLs and status codes" },
	spaMetadata: { id: "spa-metadata", label: "SPA: metadata, markup and content" },
	spaPerformance: { id: "spa-performance", label: "Core Web Vitals in an SPA" },
	spaTesting: { id: "spa-testing", label: "SPA: testing and framework recipes" },
	lighthouseOverview: { id: "lighthouse-overview", label: "Lighthouse and our crawl" },
	accessibilitySeo: { id: "accessibility-seo", label: "Does accessibility affect SEO?" },
	keywordResearch: { id: "keyword-research", label: "Keyword research and intent" },
	links: { id: "backlinks", label: "Backlinks and authority" },
	eeat: { id: "eeat", label: "E-E-A-T and trust" },
	qualitySpam: { id: "quality-spam", label: "Quality, the rater guidelines and spam policies" },
	searchConsole: { id: "search-console", label: "Real data: Search Console" },
	local: { id: "local-seo", label: "Local SEO" },
	migrations: { id: "migrations", label: "Site moves" },
	updates: { id: "updates-penalties", label: "Core updates and penalties" },
	aiSearch: { id: "ai-search", label: "AI search" },
} as const satisfies Record<string, { id: string; label: string }>;

type TSection = (typeof GUIDE_SECTIONS)[keyof typeof GUIDE_SECTIONS];

const S = GUIDE_SECTIONS;

/** The part for single-page applications; the rendering chapter names it to send readers there. */
export const SPA_PART_TITLE = "SEO for SPAs and JavaScript sites";

export const GUIDE_PARTS_BEFORE_CHECKS: { title: string; sections: TSection[] }[] = [
	{ title: "Using this tracker", sections: [S.howItWorks, S.screens] },
	{
		title: "How pages are judged",
		sections: [S.outcomes, S.severity, S.score, S.keywords, S.positions],
	},
	{
		title: "SEO fundamentals",
		sections: [
			S.howSearchWorks,
			S.crawlDiscovery,
			S.rendering,
			S.crawlBudget,
			S.indexStatus,
			S.indexDebugging,
			S.mobileFirst,
			S.serverLogs,
			S.ranking,
			S.semantics,
			S.onPage,
			S.titles,
			S.descriptions,
			S.headingsGuide,
			S.linking,
			S.canonicals,
			S.structuredData,
			S.duplicates,
			S.technical,
			S.statusRedirects,
			S.sitemaps,
			S.httpHeaders,
			S.robotsTxt,
			S.metaRobots,
			S.metaRel,
			S.hreflangGuide,
		],
	},
	{
		title: "Core Web Vitals",
		sections: [S.cwv, S.lcp, S.inp, S.cls, S.cwvDiagnostics, S.speedHere],
	},
	{
		title: SPA_PART_TITLE,
		sections: [S.spaHowSeen, S.spaRouting, S.spaMetadata, S.spaPerformance, S.spaTesting],
	},
];

export const GUIDE_PARTS_AFTER_CHECKS: { title: string; sections: TSection[] }[] = [
	{
		title: "Beyond this tracker",
		sections: [
			S.keywordResearch,
			S.links,
			S.eeat,
			S.qualitySpam,
			S.searchConsole,
			S.local,
			S.migrations,
			S.updates,
			S.aiSearch,
		],
	},
];

export const CHECK_REFERENCE_TITLE = "Check reference";
export const LIGHTHOUSE_TITLE = "Lighthouse audits";

/** Where a chapter of the check reference, and one check in it, can be linked to. */
export const topicAnchor = (topicId: string) => `checks-${topicId}`;
export const checkAnchor = (code: string) => `check-${code}`;

/** Marks the headings the side navigation follows while the reader scrolls. */
export const ANCHOR_ATTRIBUTE = "data-guide-anchor";
