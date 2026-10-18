import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** Pages this chapter cites beyond the shared list; each was opened against its sentence on 2026-10-16. */
const SOURCES = {
	specialTags: {
		title: "Google Search Central: Meta tags and attributes that Google supports",
		url: "https://developers.google.com/search/docs/crawling-indexing/special-tags",
	},
	mdnRel: {
		title: "MDN: HTML attribute: rel",
		url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel",
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

type TReader = "Google" | "Social" | "Browser" | "Nobody";

interface IMetaRow {
	tag: string;
	does: string;
	reads: TReader[];
	when: string;
}

const META_TAGS: IMetaRow[] = [
	{
		tag: '<meta charset="utf-8">',
		does: "The document's character encoding. The browser looks for it in the first 1024 bytes; without it, non-Latin text can turn to mojibake.",
		reads: ["Google", "Browser"],
		when: 'Always, as the first line of <head>. The old form — http-equiv="Content-Type" — does the same; one of the two is enough.',
	},
	{
		tag: '<meta name="viewport" content="width=device-width, initial-scale=1">',
		does: "Tells a mobile browser to lay the page out at the screen's width rather than as a 980 px desktop. To Google the tag is a sign the page is built for mobile.",
		reads: ["Google", "Browser"],
		when: "Always. Do not forbid zooming (user-scalable=no, maximum-scale=1) — that is an accessibility fault.",
	},
	{
		tag: '<meta name="description" content="…">',
		does: "A candidate for the snippet under the result's headline. No effect on ranking.",
		reads: ["Google", "Social"],
		when: "On every indexable page, its own. In detail in “Meta descriptions and snippets”.",
	},
	{
		tag: '<meta name="robots" content="…">, name="googlebot", name="googlebot-news"',
		does: "Rules for indexing and display: noindex, nosnippet, max-image-preview and the rest. robots addresses every engine, googlebot only Google; where they conflict, the stricter one applies.",
		reads: ["Google"],
		when: "Only where a restriction is needed. The default allows everything. In detail in “Meta robots”.",
	},
	{
		tag: '<meta name="googlebot" content="notranslate">',
		does: "Google does not offer to translate this result.",
		reads: ["Google"],
		when: "Rarely: where translation does harm (poetry, legal text, a dictionary page).",
	},
	{
		tag: '<meta name="google" content="nopagereadaloud">',
		does: "Google's services do not read the page aloud with speech synthesis.",
		reads: ["Google"],
		when: "Almost never.",
	},
	{
		tag: '<meta name="google-site-verification" content="…">',
		does: "Verifies ownership of the site in Search Console. The value must match character for character, case included.",
		reads: ["Google"],
		when: "If you verify the site this way. Do not drop it in a redesign — verification goes with it. Verifying through DNS is safer: the record survives a change of template.",
	},
	{
		tag: '<meta http-equiv="refresh" content="0; url=…">',
		does: "A redirect from the page's side. Google reads an instant one as permanent, a delayed one as temporary.",
		reads: ["Google", "Browser"],
		when: "Only where a server-side 301 is impossible. Google explicitly recommends the server-side redirect.",
	},
	{
		tag: '<meta name="rating" content="adult">',
		does: "Marks the page as holding explicit adult content, so SafeSearch filters it.",
		reads: ["Google"],
		when: "For that content only; the rest of the site is then not filtered wholesale.",
	},
	{
		tag: '<meta property="og:title|og:description|og:image|og:url|og:type|og:site_name|og:locale">',
		does: "Open Graph: the title, description and preview image when the link is shared on Facebook, LinkedIn, Telegram, WhatsApp, Slack and others. Google looks at them too: og:title is one source for the title link, og:image one way to state a preferred preview image, og:site_name one source for the site name.",
		reads: ["Social", "Google"],
		when: "On every page that might be shared. og:image: an absolute URL, a wide image (1200×630 is usual), not a logo; og:url: the same address as the canonical.",
	},
	{
		tag: '<meta property="article:published_time|article:modified_time|article:author">',
		does: "The Open Graph extension for articles: dates and author in some platforms' previews.",
		reads: ["Social"],
		when: "Optional. Google takes dates from the visible text and the structured data — keep those accurate.",
	},
	{
		tag: '<meta name="twitter:card" content="summary_large_image">',
		does: "The card type on X (Twitter). X takes the title, description and image from its own twitter:* tags, falling back to og:* where they are absent.",
		reads: ["Social"],
		when: "One line, if you want the large card; the other twitter:* tags need not duplicate og:*.",
	},
	{
		tag: '<meta name="theme-color" content="#0b5fff">',
		does: "The colour of a mobile browser's chrome around the page.",
		reads: ["Browser"],
		when: "To taste; no effect on search.",
	},
	{
		tag: '<meta name="referrer" content="strict-origin-when-cross-origin">',
		does: "How much of the page's address the browser sends in Referer when a link is followed. It affects the analytics of the sites you link to, not search.",
		reads: ["Browser"],
		when: "Modern browsers already default to this; set it only if you need a different policy.",
	},
	{
		tag: '<meta name="keywords" content="…">',
		does: "Google says it plainly: unused, and with no effect on indexing or ranking whatsoever.",
		reads: ["Nobody"],
		when: "Not needed. All it does is show competitors which queries you are optimising the page for.",
	},
	{
		tag: 'name="author", "generator", "revisit-after", "distribution", "copyright", "geo.position", http-equiv="content-language"',
		does: "Leftovers from the 2000s. Google supports none of them: it learns the author from the visible byline and Person markup, the language from the text, the country from the site's structure and hreflang.",
		reads: ["Nobody"],
		when: "Not needed. generator also reveals the CMS and its version — a gift to anyone scanning for vulnerable sites.",
	},
];

interface IRelRow {
	rel: string;
	does: string;
	seo: string;
}

const HEAD_RELS: IRelRow[] = [
	{
		rel: "canonical",
		does: "Which URL is the main one for this content.",
		seo: "A strong canonicalisation signal. One per page, an absolute URL, in <head> only. See “Canonicals: choosing the URL”.",
	},
	{
		rel: 'alternate + hreflang="…"',
		does: "The same page in another language or for another country.",
		seo: "Google shows the user the right version. The set is reciprocal and includes the page itself. See “Hreflang and international sites”.",
	},
	{
		rel: 'alternate + media="only screen and (max-width: 640px)"',
		does: "The mobile version on a separate URL (m.example.com).",
		seo: "Needed only for a separate mobile site; the mobile version then canonicals to the desktop one. Responsive design on one URL is simpler and is what Google recommends.",
	},
	{
		rel: 'alternate + type="application/rss+xml"',
		does: "The address of the site's RSS or Atom feed.",
		seo: "Helps readers and aggregators find the feed. The feed can be submitted in Search Console as a sitemap of recent URLs.",
	},
	{
		rel: "icon, apple-touch-icon",
		does: "The site's icon in a tab, in bookmarks, on a home screen — and in Google's results beside every entry.",
		seo: "Google takes the icon from the host's home page: a square of at least 8×8 px (it recommends more than 48×48), in BMP, GIF, ICO, PNG, JPEG, PPM or TIFF — only SVG will not do — on a stable URL, with the file open to Googlebot-Image. One icon per host: a subdomain can have its own, a subdirectory cannot.",
	},
	{
		rel: "preload, preconnect, dns-prefetch, modulepreload, prefetch",
		does: "Hints to the browser: fetch a resource early, open a connection to another domain early.",
		seo: "Nothing directly; indirectly through speed — preloading the LCP image or a font improves LCP. A preloaded font needs crossorigin, or it is fetched twice. See “LCP — loading”.",
	},
	{
		rel: "manifest",
		does: "The web app manifest: name, icons and colours for installing on a device.",
		seo: "No effect on search.",
	},
	{
		rel: "next, prev",
		does: "The next and previous pages of a series (pagination).",
		seo: "Google no longer uses them and they do not affect indexing. No harm in them, but Google understands pagination from ordinary <a href> links between the pages.",
	},
	{
		rel: "amphtml",
		does: "A link to the page's AMP version.",
		seo: "AMP is no longer needed for Top Stories and earns no badge in results. If you drop AMP, remove the tag and 301 the AMP addresses to the ordinary pages.",
	},
	{
		rel: "author, publisher, me",
		does: "A link to the author or publisher; me confirms a profile is yours (on Mastodon, say).",
		seo: "Google does not use them. Authorship is carried by the visible byline, the author page and Person markup.",
	},
];

const ANCHOR_RELS: IRelRow[] = [
	{
		rel: "(no rel)",
		does: "An ordinary link you vouch for.",
		seo: "Passes signals. The default for internal links and for sources you cite.",
	},
	{
		rel: "sponsored",
		does: "A paid or advertising link, an affiliate programme.",
		seo: "Required for paid links: an unmarked paid link breaks the link spam policy.",
	},
	{
		rel: "ugc",
		does: "A link in user-generated content: comments, a forum, reviews.",
		seo: "A hint to Google that you do not vouch for the link. Links from trusted contributors can be left unmarked.",
	},
	{
		rel: "nofollow",
		does: "Do not associate your site with this page.",
		seo: "A hint, not a prohibition. For where sponsored and ugc do not fit. Never on your own pages.",
	},
	{
		rel: "noopener",
		does: 'A tab opened through target="_blank" gets no access to your page through window.opener.',
		seo: 'Security only. Modern browsers already behave this way for target="_blank"; it has no effect on how an engine counts the link.',
	},
	{
		rel: "noreferrer",
		does: "The browser sends no Referer — the destination sees the visit as direct. It implies noopener's behaviour.",
		seo: "No effect on search, but it breaks partners' analytics: they cannot see the traffic came from you.",
	},
	{
		rel: "external, bookmark, tag, help, license",
		does: "Semantic HTML labels: an external link, a permalink, a tag, help, a licence.",
		seo: "Search engines do not use them.",
	},
];

/** Every meta tag and rel value a page is likely to carry: who reads it, what it changes, when to set it. */
export function MetaRelSection() {
	return (
		<GuideSection
			section={S.metaRel}
			sources={[
				SOURCES.specialTags,
				SRC.robotsMeta,
				SRC.mdnMeta,
				SRC.mdnViewport,
				SRC.htmlCharset,
				SRC.openGraph,
				SRC.images,
				SRC.siteNames,
				SRC.favicon,
				SRC.canonical,
				SRC.hreflang,
				SRC.qualifyLinks,
				SOURCES.mdnRel,
				SRC.mdnPreload,
				SRC.mobileFirst,
			]}
		>
			<Text>
				An ordinary page's <Code>&lt;head&gt;</Code> has dozens of lines, and each has its
				own reader. Google reads some (canonical, robots, description), social networks and
				messengers read others when the link is shared (Open Graph), the browser alone reads
				a third group (viewport, theme-color, preload), and nobody reads what is left
				(keywords, author, revisit-after). Google states that it ignores meta tags it does
				not support — they do no harm, and no good either. Here is what is what, who reads
				it, and when to set it.
			</Text>
			<Text>
				<b>A meta tag</b> (<Code>&lt;meta name|property|http-equiv&gt;</Code>) states a fact
				about the page itself. <b>The rel attribute</b> describes a relationship: on a{" "}
				<Code>&lt;link&gt;</Code> in <Code>&lt;head&gt;</Code> it is the page's relation to
				another resource (“my main address is that one”, “my translation is here”); on an{" "}
				<Code>&lt;a&gt;</Code> in the text it is the nature of the link (“this link is paid
				for”). Google is generally case-insensitive about meta tags — except for the value
				of google-site-verification; it reads HTML and XHTML syntax (
				<Code>&lt;meta … /&gt;</Code>) alike.
			</Text>

			<Text fw={600}>Meta tags</Text>
			<Table.ScrollContainer minWidth={760}>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={230}>Tag</Table.Th>
							<Table.Th>What it does</Table.Th>
							<Table.Th w={110}>Who reads it</Table.Th>
							<Table.Th>When to set it</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{META_TAGS.map((row) => (
							<Table.Tr key={row.tag}>
								<Table.Td>
									<Code>{row.tag}</Code>
								</Table.Td>
								<Table.Td>{row.does}</Table.Td>
								<Table.Td>{row.reads.join(", ")}</Table.Td>
								<Table.Td>{row.when}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>

			<Text fw={600}>The rel attribute on &lt;link&gt; in &lt;head&gt;</Text>
			<Table.ScrollContainer minWidth={640}>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={210}>rel</Table.Th>
							<Table.Th>What it states</Table.Th>
							<Table.Th>What it means for SEO</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{HEAD_RELS.map((row) => (
							<Table.Tr key={row.rel}>
								<Table.Td>
									<Code>{row.rel}</Code>
								</Table.Td>
								<Table.Td>{row.does}</Table.Td>
								<Table.Td>{row.seo}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
			<Text size="sm">
				Google does not use a <Code>rel="canonical"</Code> that carries the{" "}
				<Code>hreflang</Code>, <Code>lang</Code>, <Code>media</Code> or <Code>type</Code>{" "}
				attributes for canonicalisation: language and mobile versions are declared with{" "}
				<Code>rel="alternate"</Code>, and the canonical goes without extra attributes.
			</Text>

			<Text fw={600}>The rel attribute on &lt;a&gt; links</Text>
			<Table.ScrollContainer minWidth={640}>
				<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
					<Table.Thead>
						<Table.Tr>
							<Table.Th w={210}>rel</Table.Th>
							<Table.Th>What it states</Table.Th>
							<Table.Th>What it means for SEO</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{ANCHOR_RELS.map((row) => (
							<Table.Tr key={row.rel}>
								<Table.Td>
									<Code>{row.rel}</Code>
								</Table.Td>
								<Table.Td>{row.does}</Table.Td>
								<Table.Td>{row.seo}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
			<Text size="sm">
				Values combine, separated by spaces: <Code>rel="sponsored noopener"</Code>,{" "}
				<Code>rel="ugc nofollow"</Code>. More on when to use nofollow, sponsored and ugc is
				in “Internal and external links”.
			</Text>

			<Text fw={600}>A minimal &lt;head&gt; for a blog post</Text>
			<Code block>
				{`<head>
  <meta charset="utf-8">                                         <!-- first, within 1024 bytes -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Local SEO checklist: 12 steps to the map pack | Example</title>
  <meta name="description" content="Twelve steps to rank in Google's local map pack, with a printable checklist.">
  <link rel="canonical" href="https://example.com/blog/local-seo/">

  <!-- only if the post has translations; the same set on every version -->
  <link rel="alternate" hreflang="en" href="https://example.com/blog/local-seo/">
  <link rel="alternate" hreflang="de" href="https://example.com/de/blog/lokales-seo/">
  <link rel="alternate" hreflang="x-default" href="https://example.com/blog/local-seo/">

  <!-- previews when the link is shared -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="Local SEO checklist: 12 steps to the map pack">
  <meta property="og:description" content="Twelve steps to rank in Google's local map pack.">
  <meta property="og:image" content="https://example.com/img/local-seo-1200x630.jpg">
  <meta property="og:url" content="https://example.com/blog/local-seo/">
  <meta property="og:site_name" content="Example Agency">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png">
  <link rel="preload" as="image" href="/img/local-seo-hero.avif" fetchpriority="high">
  <link rel="alternate" type="application/rss+xml" title="Example blog" href="/feed.xml">

  <script type="application/ld+json">{ "@context": "https://schema.org", "@type": "BlogPosting" }</script>
  <!-- no robots meta: the default is index, follow -->
</head>`}
			</Code>

			<Text fw={600}>Order in &lt;head&gt;, and the “broken head” trap</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>charset within the first 1024 bytes.</b> Otherwise the browser starts parsing
					on a guess about the encoding and may have to start again.
				</List.Item>
				<List.Item>
					<b>canonical, robots and hreflang have to end up inside the head.</b> By the
					rules of HTML, an element that does not belong in <Code>&lt;head&gt;</Code> (
					<Code>&lt;img&gt;</Code>, <Code>&lt;div&gt;</Code>, <Code>&lt;iframe&gt;</Code>,
					text) closes it implicitly, and everything below lands in{" "}
					<Code>&lt;body&gt;</Code>. Google accepts a canonical and hreflang only from the
					head — so put the tags that matter as high as possible, above the analytics
					scripts and widgets that insert such elements.
				</List.Item>
				<List.Item>
					<b>Nothing important from JavaScript alone.</b> Google recommends that the
					canonical and robots rules be in the server's HTML and that no script change
					them; social networks and messengers do not run JavaScript at all, so Open Graph
					inserted by a script is invisible to them.
				</List.Item>
				<List.Item>
					<b>Each tag once.</b> Two descriptions, two canonicals or two og:image tags are
					usually the result of both the theme and an SEO plugin emitting them.
				</List.Item>
			</List>

			<Text fw={600}>How to check it yourself</Text>
			<Code block>
				{`# every <meta> and <link> in the server's HTML
curl -s https://example.com/blog/local-seo/ | grep -ioE '<(meta|link)[^>]*>'

# duplicates: the same name/property/rel twice
curl -s https://example.com/blog/local-seo/ \\
  | grep -ioE '(name|property|rel)="[^"]*"' | sort | uniq -d`}
			</Code>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					DevTools → Elements shows the head after JavaScript; compare it with the source
					(Ctrl+U): a tag that exists only in Elements was inserted by a script.
				</List.Item>
				<List.Item>
					URL Inspection in Search Console — the canonical Google chose, and whether
					indexing is allowed.
				</List.Item>
				<List.Item>
					For social previews, the platforms' own debuggers (Facebook Sharing Debugger,
					LinkedIn Post Inspector): they show what the platform read, and refresh its
					preview cache after a fix.
				</List.Item>
			</List>

			<DoAvoid
				good={[
					"charset, viewport, title, description and canonical on every indexable page.",
					"Open Graph with a wide image on everything that might be shared.",
					"A favicon of 48×48 px or more, in PNG or ICO, declared on the home page.",
					"sponsored on paid links, ugc in comments.",
					"The tags that matter in the server's HTML, at the top of <head>.",
				]}
				bad={[
					"meta keywords, revisit-after or author in the hope of positions.",
					'A robots "index, follow" — that is the default.',
					"rel=next/prev instead of ordinary links between pagination pages.",
					"Open Graph or a canonical that only JavaScript adds.",
					"Two plugins, each with its own set of meta tags.",
				]}
			/>
			<CheckedHere checks="No mobile viewport (VIEWPORT_MISSING), The character encoding is declared late or not at all (CHARSET_MISSING_OR_LATE), A meta refresh redirect (META_REFRESH), No Open Graph tags (OG_TAGS_MISSING), og:url does not match the canonical (OG_URL_MISMATCH), The preview image is the site logo (PREVIEW_IMAGE_IS_LOGO), The preview image is under 1200 px wide (PREVIEW_IMAGE_TOO_SMALL), A font preloaded without crossorigin (FONT_PRELOAD_WITHOUT_CROSSORIGIN), Language not declared (LANG_MISSING); at site level — A favicon Google cannot show (FAVICON_INVALID), The site name differs between the home page's sources (SITE_NAME_INCONSISTENT). The robots meta tag, canonical, hreflang and link rel values have chapters of their own." />
		</GuideSection>
	);
}
