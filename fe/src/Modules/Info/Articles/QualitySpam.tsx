import { Code, List, Table, Text } from "@mantine/core";
import type { ISeoIssueSource } from "@app/contracts";
import { DoAvoid } from "../DoAvoid/DoAvoid";
import { GuideSection } from "../GuideSection/GuideSection";
import { GUIDE_SECTIONS as S } from "../guideOutline";
import { GUIDE_SOURCES as SRC } from "../guideSources";

/** Sources only this section cites; each was opened and read against its sentence on 2026-10-12. */
const SOURCES = {
	raterGuidelines: {
		title: "Google: Search Quality Rater Guidelines (General Guidelines, PDF)",
		url: "https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf",
	},
	genAiContent: {
		title: "Google Search Central: Google Search's guidance on using generative AI content on your website",
		url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
	},
	march2024: {
		title: "Google Search Central Blog: What web creators should know about our March 2024 core update and new spam policies",
		url: "https://developers.google.com/search/blog/2024/03/core-update-spam-policies",
	},
	siteReputation2024: {
		title: "Google Search Central Blog: Updating our site reputation abuse policy",
		url: "https://developers.google.com/search/blog/2024/11/site-reputation-abuse",
	},
	siteReputation2026: {
		title: "Google Search Central Blog: Update to the Site Reputation Policy",
		url: "https://developers.google.com/search/blog/2026/08/update-site-reputation-policy",
	},
	spamUpdates: {
		title: "Google Search Central: Google Search spam updates and your site",
		url: "https://developers.google.com/search/updates/spam-updates",
	},
} satisfies Record<string, ISeoIssueSource>;

const RATER_SCALES = [
	{
		scale: "Page Quality (PQ)",
		levels: "Lowest → Low → Medium → High → Highest",
		judges: "How well the page achieves its purpose: the quality of the main content (effort, originality, talent or skill, accuracy), the reputation of the site and the author, E-E-A-T. A page with a harmful or deceptive purpose is Lowest outright.",
	},
	{
		scale: "Needs Met (NM)",
		levels: "Fails to Meet → Slightly → Moderately → Highly → Fully Meets",
		judges: "How well the result answers one particular query for one particular person — taking in their intent, language and location. A superb page on the wrong subject gets Fails to Meet.",
	},
] as const;

const SPAM_POLICIES = [
	{
		policy: "Cloaking",
		what: "Users and the search engine are shown different content, to manipulate rankings.",
		note: "A paywall is not cloaking as long as Google sees the gated content in full. Hacked sites often cloak: only Googlebot sees the spam.",
	},
	{
		policy: "Doorway abuse",
		what: "Pages or sites built for near-identical queries that funnel users to less useful intermediate pages.",
		note: "The classic is a “page per city” with one word swapped, all leading to the same page.",
	},
	{
		policy: "Expired domain abuse",
		what: "An expired domain is bought and used for its former reputation, carrying low-value content.",
		note: "A new, original site for people on an old domain is fine. Policy added in March 2024.",
	},
	{
		policy: "Hidden text and link abuse",
		what: "Text or links placed for search engines only: white on white, behind an image, off the edge of the screen, at zero font size.",
		note: "Accordions, tabs, sliders, tooltips and screen-reader-only text are not violations.",
	},
	{
		policy: "Keyword stuffing",
		what: "A page crammed with keywords or numbers out of context.",
		note: "Lists of cities “we serve”, repetitions of a phrase that read unnaturally.",
	},
	{
		policy: "Link spam",
		what: "Links to or from a site created primarily for rankings.",
		note: "Bought links without sponsored/nofollow, exchange at scale, automated links, links in widgets and other sites' footers, keyword anchors in guest posts.",
	},
	{
		policy: "Scaled content abuse",
		what: "Many pages produced primarily for rankings rather than for people — whether by humans or by AI.",
		note: "Generating pages with nothing added, spinning or machine-translating other people's text, stitching sources together, a network of sites hiding the scale. Policy added in March 2024.",
	},
	{
		policy: "Site reputation policy (formerly site reputation abuse)",
		what: "Third-party content hosted on a site mainly for the ranking signals that site has already earned.",
		note: "“Best casinos” from an outside advertiser on a medical site is the example. News syndication, UGC forums and editorial columns are not violations.",
	},
	{
		policy: "Sneaky redirects",
		what: "The user ends up somewhere other than the place the result showed the search engine.",
		note: "Mobile-only redirects included.",
	},
	{
		policy: "Thin affiliation",
		what: "Affiliate pages whose descriptions and reviews are copied from the merchant with nothing added.",
		note: "Affiliate links are not a violation in themselves: a good affiliate site adds comparisons, tests and data of its own.",
	},
	{
		policy: "User-generated spam",
		what: "Spam visitors leave in comments, on a forum, in profiles.",
		note: 'The site owner is responsible: moderation, rel="ugc", bot protection.',
	},
] as const;

const SCENARIOS = [
	{
		symptom:
			"A sharp sitewide drop, Manual actions empty, coinciding with the date of a core or spam update",
		cause: "An algorithmic re-assessment: the ranking systems or SpamBrain. There is no notification, and no reconsideration request.",
		act: "Line the dates up with the Search Status Dashboard, work the worst-hit pages through the self-assessment questions below, fix what is wrong on the merits. The effect takes months.",
	},
	{
		symptom: "Hundreds of near-identical “service + city” pages stopped appearing",
		cause: "Doorways or scaled content: the pages differ by one word.",
		act: "Keep pages only where there is a real difference (an address, a team, prices, reviews); merge the rest and 301 them to a shared page.",
	},
	{
		symptom:
			"Results for the site show other people's text about casinos or loans; unfamiliar URLs appear in Search Console",
		cause: "A hack with cloaking: the spam is served to Googlebot only.",
		act: "Compare the URL Inspection response with what a browser sees, remove the injected code and pages, close the hole; if Google has flagged the site under Security issues or Manual actions, request a review there.",
	},
	{
		symptom:
			"A coupons or reviews section from a contractor got a manual action for site reputation",
		cause: "Third-party content placed for the main domain's signals.",
		act: "Take it out of the index (noindex) or move it to a separate domain — with no redirects from the old URLs, and nofollow on links to it; then request a review.",
	},
	{
		symptom: "A manual action for “Unnatural links to your site”",
		cause: "Bought links or link schemes — yours, or left behind by a previous contractor.",
		act: "Export the links from the Links report, get them removed or marked up with rel, disavow what remains (see “Backlinks and authority”), and describe the work in the reconsideration request.",
	},
] as const;

/** Quality as Google's raters and spam policies define it: what is demoted, by whom, and how to recover. */
export function QualitySpamSection() {
	return (
		<GuideSection
			section={S.qualitySpam}
			sources={[
				SRC.spamPolicies,
				SRC.helpfulContent,
				SOURCES.genAiContent,
				SOURCES.raterGuidelines,
				SRC.rankingSystems,
				SOURCES.march2024,
				SOURCES.siteReputation2024,
				SOURCES.siteReputation2026,
				SOURCES.spamUpdates,
				SRC.manualActions,
			]}
		>
			<Text>
				Two different forces judge quality at Google. <b>Automated systems</b> — the core
				ranking systems and SpamBrain, its AI-based anti-spam system — promote useful
				content and demote spam with no notification at all. <b>People</b> come in in two
				roles: Google staff apply manual actions for breaches of the spam policies, and
				search quality raters score the results against their guidelines. Raters do not move
				positions: their scores are not used directly in the algorithms — Google likens them
				to the feedback cards in a restaurant, used to check whether changes to the systems
				work.
			</Text>
			<Text>
				The helpful content system (the “Helpful Content Update” of 2022) became part of
				core ranking in March 2024: there is no separate “HCU filter” to escape any more —
				helpfulness is judged by many signals of the core systems. Ranking works mostly at
				the page level, but there are site-wide signals too, so a large body of weak pages
				can drag the good ones down.
			</Text>

			<Text fw={600}>The Quality Rater Guidelines (QRG)</Text>
			<Text>
				The Search Quality Rater Guidelines are the public handbook for raters (the current
				edition is dated 11 September 2025). It is not a manual for reaching the top but the
				most detailed description there is of what Google considers quality. Raters give two
				scores:
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={190}>Score</Table.Th>
						<Table.Th w={190}>Scale</Table.Th>
						<Table.Th>What it judges</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{RATER_SCALES.map((row) => (
						<Table.Tr key={row.scale}>
							<Table.Td fw={600}>{row.scale}</Table.Td>
							<Table.Td>{row.levels}</Table.Td>
							<Table.Td>{row.judges}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<List size="sm" spacing={4}>
				<List.Item>
					<b>E-E-A-T</b> — experience, expertise, authoritativeness and trust. At the
					centre is <b>trust</b>: an inaccurate page has low E-E-A-T however experienced
					or authoritative the author seems. The other three feed into trust, and not all
					have to be on show at once: a review needs first-hand experience, a reference
					page needs expertise.
				</List.Item>
				<List.Item>
					<b>YMYL</b> (Your Money or Your Life) — topics that could significantly affect
					people's health, financial stability or safety, or the welfare of society. The
					bar is highest here: the content must be very accurate and in line with
					well-established expert consensus, and Google's systems weight such signals even
					more heavily.
				</List.Item>
				<List.Item>
					<b>The main content</b> is judged on four things: effort (how much human work
					went in), originality, talent or skill, and accuracy. Citing sources is no
					substitute for effort of your own.
				</List.Item>
				<List.Item>
					Sections 4.6.5 (scaled content) and 4.6.6 (content created with little effort,
					originality or added value) are the ones Google itself recommends to anyone
					using AI.
				</List.Item>
			</List>

			<Text fw={600}>Google's spam policies</Text>
			<Text>
				The spam policies are part of Google Search Essentials. Google detects breaches
				automatically and, where needed, by hand; pages or whole sites rank lower or
				disappear from results. On 5 March 2024 three new policies arrived: expired domains,
				scaled content, and site reputation abuse (the last in force from 5 May 2024).
			</Text>
			<Table withTableBorder withColumnBorders verticalSpacing={6} fz="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th w={190}>Policy</Table.Th>
						<Table.Th>What it is</Table.Th>
						<Table.Th>Example and boundary</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{SPAM_POLICIES.map((row) => (
						<Table.Tr key={row.policy}>
							<Table.Td fw={600}>{row.policy}</Table.Td>
							<Table.Td>{row.what}</Table.Td>
							<Table.Td>{row.note}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Text size="sm">
				The policies also cover hacked content, malicious behaviour, misleading
				functionality, scraping, automated queries to Google, circumventing the policies
				(moving violating content to a new subdomain, say), scams and legal removals.
			</Text>
			<Text>
				<b>Site reputation: how the policy changed.</b> In November 2024 Google clarified
				that using third-party content for a site's signals is a violation regardless of
				whether the site's owner was involved in producing it or controlled it (white-label
				arrangements, licences and part-ownership change nothing). In its current edition
				the policy is called the site reputation policy: the violation is third-party
				content placed mainly because of the signals the site has already earned. From 30
				August 2026 a manual action under this policy does not apply to results for users in
				the European Economic Area: there the section may in time rank separately from the
				rest of the site. The Search Console notification and the reconsideration request
				remain.
			</Text>

			<Text fw={600}>AI-generated content</Text>
			<Text>
				Google does not forbid content made with AI: what counts is the purpose and the use,
				not the method of production. The violation is using automation, AI included,
				primarily to manipulate rankings; generating many pages with no value to users falls
				under scaled content. What Google asks for:
			</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					Check the facts by hand: models predict plausible words, they do not retrieve
					facts. That goes for metadata too — titles, meta descriptions, structured data,
					alt text.
				</List.Item>
				<List.Item>
					Explain the “how” wherever a reader might ask how this was made: what was
					automated, and why.
				</List.Item>
				<List.Item>
					Do not invent authors: generated photographs, made-up names and false
					credentials are, in Google's own words, deception and a sign of low quality.
				</List.Item>
			</List>

			<Text fw={600}>Manual actions and reconsideration</Text>
			<Text>
				Manual actions appear in the Manual actions report in Search Console; a notification
				also arrives in the message centre. The report names the type of action and the
				patterns of the URLs affected — a section (
				<Code>https://example.com/real-estate/*</Code>) or “Affects all pages” for the whole
				site. The types: unnatural links to or from your site, thin content with little or
				no added value, cloaking and sneaky redirects, hidden text and keyword stuffing,
				user-generated spam, structured data abuse, site reputation, major spam problems and
				others.
			</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Fix the problem on <b>every</b> page affected: a partial fix buys no partial
					recovery.
				</List.Item>
				<List.Item>
					Make sure Googlebot can fetch the pages: no login, no paywall, no robots.txt
					block, no noindex. Check them in URL Inspection.
				</List.Item>
				<List.Item>
					Press Request Review in the report. A good request names the exact problem,
					describes what was done, and documents the result (a list of removed links and
					the correspondence with webmasters, for instance).
				</List.Item>
				<List.Item>
					Wait: usually days or weeks, longer for links. Do not resubmit before a decision
					arrives. If you bought the site with the violations on it, say so in the
					request.
				</List.Item>
			</List>
			<Text size="sm">
				After an algorithmic demotion there is no review to request: the systems have to
				“see”, over months, that the site now meets the policies. After a link spam update
				the benefit of the neutralised links does not come back at all.
			</Text>

			<Text fw={600}>How to check it yourself</Text>
			<List type="ordered" size="sm" spacing={4}>
				<List.Item>
					Search Console → Manual actions and Security issues: a green tick means no
					manual action.
				</List.Item>
				<List.Item>
					Performance: compare the week after an update finished with the week before it
					began (the dates are on the Search Status Dashboard), by page and by query.
				</List.Item>
				<List.Item>
					Cloaking: in URL Inspection run the live test and look at the HTML Googlebot
					received — then compare it with what a browser sees. curl with Googlebot's user
					agent is a rough check: attackers often identify Googlebot by IP.
				</List.Item>
				<List.Item>
					Hidden text: in DevTools, look through the main content for elements with{" "}
					<Code>font-size: 0</Code>, <Code>opacity: 0</Code>, positioning off-screen, or
					text the same colour as the background.
				</List.Item>
			</List>
			<Code block>
				{`# What a browser gets vs what a request claiming to be Googlebot gets
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36" \\
  https://example.com/blog/post/ -o as-user.html
curl -s -A "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \\
  https://example.com/blog/post/ -o as-googlebot.html

# Links present for one and not the other are the first thing to read
diff <(grep -o '<a [^>]*href="[^"]*"' as-user.html | sort -u) \\
     <(grep -o '<a [^>]*href="[^"]*"' as-googlebot.html | sort -u)`}
			</Code>

			<Text fw={600}>A self-assessment checklist, from Google's questions</Text>
			<List size="sm" spacing={4}>
				<List.Item>
					Does the content carry original information, research or analysis — more than
					the obvious?
				</List.Item>
				<List.Item>
					Where it draws on other sources, does it add substantial value rather than
					simply retelling them?
				</List.Item>
				<List.Item>
					Does the headline describe the content accurately and usefully, without
					exaggeration or shock?
				</List.Item>
				<List.Item>
					Would you bookmark the page or recommend it to a friend? Is it worth more than
					the other pages in the results?
				</List.Item>
				<List.Item>
					Is it clear who wrote it, are there sources, and are there no easily checked
					factual errors?
				</List.Item>
				<List.Item>
					Does it show first-hand experience: the product used, the place visited, the
					test run?
				</List.Item>
				<List.Item>
					Will the reader leave having learned enough for their purpose — or will they
					have to search again?
				</List.Item>
				<List.Item>
					Warning signs: writing to a word count (Google has none), topics chosen only
					because they are trending, entering a niche without expertise for the traffic,
					automation at scale, changing dates without changing anything, adding or
					removing pages in bulk for “freshness”.
				</List.Item>
			</List>

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
					{SCENARIOS.map((row) => (
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
					"Use AI for research and structure, and add and verify the facts, conclusions and experience yourself.",
					"Build pages per region or product only where each has content of its own.",
					'Moderate comments and forums, and put rel="ugc" on users\' links.',
					"Before buying an old domain or site, look at its history and check the manual actions report once you have verified ownership.",
				]}
				bad={[
					"Hundreds of generated “service + city” pages with one word swapped.",
					"Renting out a section of the site for someone else's reviews or coupons, for the domain's signals.",
					"Requesting a review having fixed only some of the pages.",
					"Invented authors with credentials and generated photographs.",
				]}
			/>

			<Text size="sm" c="dimmed">
				<b>How this relates to the tracker.</b> Manual actions, cloaking, hidden text and
				links are invisible to the tracker — those are checked in Search Console. It does
				flag the signs Google's own guidance ties to content made for search engines:
				“Almost the same text as another page” (<Code>NEAR_DUPLICATE_CONTENT</Code>) —
				templated pages with one word swapped are what the policies call doorways; “The date
				changed, the content did not” (<Code>DATE_BUMPED_WITHOUT_CHANGES</Code>); “Thin
				content” (<Code>THIN_CONTENT</Code>); “No author named” (<Code>AUTHOR_MISSING</Code>
				) and “No links to external sources” (<Code>NO_EXTERNAL_SOURCES</Code>) — for the
				“who” and “from where” questions.
			</Text>
		</GuideSection>
	);
}
