# fe/src/Modules/PageDetail Specification

## Purpose

One page of a client: what it is, how it ranks over time, what was checked on it, how its score
follows from those checks, and what to fix. Requirements here are about what the SCREEN must
say; the values it says them about are specified in `be/src/modules/pages`.

## Requirements

### Requirement [PAGEDETAIL-009]: the detail lists every check with its outcome and the reason it was skipped

The page detail MUST show a checks section with two columns: "Our checks" and "Lighthouse".

**Rows.** There is one row per counterpart group and one per code that is in no group:
- a row's cell for an owner shows that owner's codes in the group, each with its label and
  status;
- an owner with no code in the row leaves its cell empty.

**Order.** Every row MUST sit under a chapter heading, the chapters and their order being the
ones the Info tab teaches (`CHECK_TOPICS`, one chapter per code by `CHECK_TOPIC_OF`). A
counterpart group sits under the chapter of its crawl code; a Lighthouse-only row under its
own Lighthouse chapter. Within a chapter, rows with a failure come first, and the order the
backend sent is kept otherwise. Each heading MUST say how many of its rows failed. The Lighthouse
chapters MUST continue the list under their own headings, with no block heading of their own:
they are the checks no check of ours shares, not a separate report. Lighthouse's accessibility
audits MUST NOT be listed (ANALYSIS-028); its accessibility score in the speed block stands for
them.

AMENDED after implementation (D24): a "Lighthouse audits" heading opened Lighthouse's chapters,
and its accessibility audits had chapters of their own. The user asked for both to go.

AMENDED during implementation: this said our rows came first as one unheaded list, and only
Lighthouse's were split, into "Lighthouse · SEO" and "Lighthouse · Accessibility". The user asked
for every check to be grouped. The chapters are the Info tab's, so a check reads under the same
heading on both screens.

**Statuses and reasons.** The screen MUST NOT derive a status itself:
- a check that could not be judged MUST be shown with the reason its catalogue entry declares;
- a crawl check added after the last crawl MUST be shown as such;
- a Lighthouse code its last measurement did not record MUST say so.

**Disagreement.** A row in which one owner's codes include a failure and the other owner's codes
include a pass MUST carry a marker. Its tooltip says the two sources can disagree because
Lighthouse runs the page's scripts and measured it at a different time.

**Column headers.** Each column's header MUST carry the date its owner last judged the page in
the user's zone.

**An owner without a record.** Its column MUST show one line in place of its cells, and no
statuses:
- the crawl's line reads "Re-crawl this page to see each check.";
- Lighthouse's line names why there is no record: not yet measured, PageSpeed not configured, or
  the key rejected.

**Summary.** The section MUST summarise how many checks each owner judged and how many it could
not, and MUST point at the SEO issues section for the details of the failures rather than
repeating them.

**Narrow screens.** On a narrow screen a row's two cells MUST stack, each labelled with its
column's name.

Modified by `lighthouse-checks`: Lighthouse is a second owner of checks. A reader comparing our
verdict with the one their client quotes from Lighthouse needs both on the same line, and a cell
showing a status Lighthouse never reported would be a false statement.

#### Scenario: a page with two skipped checks and two failures

- **WHEN** the detail of a page Lighthouse has not measured is opened, its crawl having judged 16
  and skipped 2
- **THEN** the section reads "Our checks: 16 judged · 2 not applicable", shows a row per crawl
  check, shows "The page has no images." under the skipped image check, shows Lighthouse's
  not-measured line once in its column, and closes with "Details for the 2 failed checks are in
  SEO issues below."

#### Scenario: chapters

- **WHEN** the crawl failed `TITLE_LENGTH` and nothing else
- **THEN** "Titles" is the first chapter, its heading says 1 failed, and the title-length row leads it

#### Scenario: the canonical group

- **WHEN** the crawl passed all five canonical checks and Lighthouse failed `canonical`
- **THEN** one row shows the five crawl codes with passes on the left, the Lighthouse code with a
  failure on the right, and the disagreement marker

#### Scenario: a Lighthouse-only failure

- **WHEN** Lighthouse failed `link-text`
- **THEN** it appears first under its Lighthouse chapter with an empty "Our checks" cell, and no
  "Lighthouse audits" heading is shown

#### Scenario: an accessibility audit

- **WHEN** the detail is opened for any page
- **THEN** no Lighthouse accessibility audit has a row, and no chapter is an accessibility one

#### Scenario: a page with nothing failing

- **WHEN** every judged check of both owners passed
- **THEN** no closing line pointing at SEO issues is shown

#### Scenario: a page whose crawl predates the recording

- **WHEN** the detail carries no crawl list
- **THEN** the "Our checks" column shows "Re-crawl this page to see each check." and no crawl
  statuses

#### Scenario: the SEO issues section

- **WHEN** the checks section is shown above it
- **THEN** the issues remain grouped by severity, worst first, with their sentences, hints and
  shared-finding counts unchanged, and include Lighthouse's findings

### Requirement [PAGEDETAIL-010]: the score is explained on the page's own numbers and bounded in what it claims

The page detail MUST show how its health score was computed, using this page's own passed and
applicable counts, the points those checks were worth and the points the failures cost, and the
rounding that produced the displayed value. It MUST state what each severity weighs and why, with
the weights taken from the contract rather than written into the copy, that the denominator is
the checks that could be judged on this page, and which bands the score falls in. It MUST state that the score claims only the absence of
obvious technical defects, and MUST NOT present it as a traffic forecast, a comparison with a
competitor, or a judgement of the writing. The arithmetic shown MUST agree with the score shown.

#### Scenario: eighteen applicable checks of which two failed

- **WHEN** the detail is opened for a page whose 18 applicable checks were worth 120 points and
  whose 2 failures cost 13
- **THEN** it reads that 16 of the 18 checks that applied passed, that they were worth 120 points
  and the 2 that failed cost 13, shows 100 × 107 ÷ 120 ≈ 89.17 rounded half-up to 89, names each
  severity's weight and the poor/average/good bands

#### Scenario: a quotient that would round the other way at one decimal

- **WHEN** 1 of 16 points was kept, so the quotient is 6.25 and the score is 6
- **THEN** the quotient is shown with enough precision that the rounding stated beside it is
  correct

#### Scenario: a page that passed everything that applied

- **WHEN** the quotient is a whole number
- **THEN** no rounding clause is shown

### Requirement [PAGEDETAIL-007]: the detail shows the score with the denominator it came from

The page detail MUST show the health score as a KPI card with its band colour and the count of
applicable checks it was computed from, and MUST NOT describe it as a prediction of traffic, a
comparison with other sites, or a judgement of content quality.

#### Scenario: a page with two failures out of sixteen applicable checks

- **WHEN** the detail of that page is opened
- **THEN** the score card reads 88 with the note "14 of 16 checks passed"

### Requirement [PAGEDETAIL-006]: the crawl's response time is shown as a measurement, never as a verdict

The page detail MUST show the time to first byte of the last fetch among the page's crawl facts,
and MUST NOT present it as an issue, a warning or a score input; the screen MUST say, where the
value is shown, that it is one fetch from this crawler and not a measurement of real visitors.

#### Scenario: a slow fetch

- **WHEN** the last crawl of a page took 1728 ms to the first byte
- **THEN** the facts line reads "1728 ms to first byte" and the issues section contains no timing issue

#### Scenario: what the value claims

- **WHEN** the user hovers the response time
- **THEN** the explanation says it is one fetch from our crawler, not a field measurement of their visitors

### Requirement [PAGEDETAIL-008]: a shared finding says how many of the client's pages it affects

An issue affecting more than one of the client's current pages MUST say so on its own line, with
the number of pages affected and the client's current page count; an issue affecting only this
page MUST say nothing extra, so the clause stays a signal rather than decoration.

#### Scenario: a template problem

- **WHEN** an issue is present on five of the client's fifteen current pages
- **THEN** its line carries "on 5 of 15 pages" after the issue's sentence

#### Scenario: a problem of this page only

- **WHEN** an issue is present on this page alone
- **THEN** its line carries no page count

### Requirement [PAGEDETAIL-001]: the detail opens with the page's summary

The detail MUST show a breadcrumb Pages / client / page whose Pages link restores the list's
search parameters, a header with the title, an external link to the URL, the client badge and the
last crawl time, and KPI cards for best position (with keyword), keywords tracked, issues by
severity and last crawl status.

#### Scenario: returning to a filtered list
- **WHEN** the user opened the detail from `/pages?clientId=2&page=2` and clicks Pages
- **THEN** the list opens at `/pages?clientId=2&page=2`

### Requirement [PAGEDETAIL-002]: the history range is chosen in the user's zone and kept in the URL

The history MUST offer presets 7d, 30d (default), 90d, 12m and a custom range, computed as calendar
days ending today in the user's zone from the session; the range and the Chart/Table view MUST live
in the URL; changing the range twice quickly MUST show the second range's data.

#### Scenario: a fast double change
- **WHEN** the user selects 90d and then 7d before the first answer arrives
- **THEN** the chart shows 7 days

### Requirement [PAGEDETAIL-003]: the chart puts position 1 on top

The chart MUST plot one line per visible keyword with an inverted Y axis from 1 to 100 and dates on
the X axis in the user's zone; keyword chips MUST toggle lines and act as the legend; an empty range
MUST say there are no positions in it. The history's title MUST name where the positions come from
in brackets — "Position history (simulated)" while every position is simulated (plan D35).

#### Scenario: hiding a keyword
- **WHEN** the user toggles off a keyword chip
- **THEN** its line disappears and the chip shows it is hidden

### Requirement [PAGEDETAIL-004]: the table summarises each keyword over the range

The table view MUST list per keyword its term, relevance, latest position in the range, change
over the range with a direction arrow (a lower number is an improvement), and best and worst
positions in the range.

#### Scenario: a keyword that moved from 12 to 7
- **WHEN** the first point in range is 12 and the last is 7
- **THEN** the change shows an improvement of 5

### Requirement [PAGEDETAIL-005]: issues are grouped by severity in plain words, and an unreachable page is not found

SEO issues MUST be grouped Critical / Important / Improvement, each as the catalogue's sentence with
its details; where the code has a bound, the sentence MUST be rendered from the measurement STORED on
the finding, never from the catalogue's current bounds. A page id that is foreign or missing MUST
show a not-found view with a link to Pages.

AMENDED during implementation (`seo-check-catalogue-correction`, task 5.2): the requirement said
"with its details" and left open where the numbers in a sentence come from. Reading them from the
catalogue at render time would make an old verdict explain itself against bounds it was never
judged against — "the title is 72 characters; aim for 30–65" over a crawl that failed it at 60.
The finding carries its own bounds, and the sentence reads those.

Modified by `client-issue-report`: the group names follow the product's one severity vocabulary
(SHELL-004), so the page and the issue report name a level the same way.

#### Scenario: another user's page id
- **WHEN** user B opens `/pages/<A's page id>`
- **THEN** the not-found view is shown and no data of the page appears

#### Scenario: a threshold moved after the crawl
- **WHEN** a finding stored `{ value: 72, min: 30, max: 60 }` and the catalogue now says 30–65
- **THEN** the sentence still reads "The title is 72 characters; aim for 30–60."

#### Scenario: the group names
- **WHEN** a page carries an error, a warning and a notice
- **THEN** its groups read Critical, Important and Improvement, in that order

### Requirement [PAGEDETAIL-011]: the page shows its Core Web Vitals with their source and age

The detail MUST show a "Speed (Core Web Vitals)" block with a Mobile | Desktop switch that opens on
Mobile. For the chosen device it MUST show one card per metric — the value with its unit, the band
in words and colour, the source in plain words and the date measured — and the Lighthouse lab
performance score as a caption that says it is a lab figure. A lab-sourced value MUST say it may
vary between runs; a missing INP MUST say why there is none. For the chosen device the block MUST
state "In queue for measurement", "Measuring…", "Couldn't refresh: <reason>, showing the
measurement from <date>", "Couldn't measure: <reason>", "Not measured" and "PageSpeed not
configured" in words, never as empty cards, each from that device's own row; when PageSpeed's
state is `keyRejected` it MUST open with "Google rejected the PageSpeed key — speed measurements
are paused. See the README." above whatever is stored, on either device. On Desktop the block
MUST show no Lighthouse SEO or accessibility caption, because those verdicts are taken from
mobile alone. Switching devices MUST NOT request anything and MUST NOT change any other section
of the page.

Modified by `desktop-core-web-vitals`: the page is now measured on two devices (plan D9), and the
block shows one at a time, behind a switch, so the cards keep the layout a reader already knows.
The checks section and the score explanation keep reading the mobile measurement (plan D49).

#### Scenario: an origin-sourced INP
- **WHEN** the page's mobile INP is 240 ms from the whole site's real visitors
- **THEN** the INP card on Mobile reads "240 ms", "Needs improvement", "Real visitors to the whole
  site" and the date

#### Scenario: the last attempt failed
- **WHEN** the mobile summary is `failed` with `PSI_UNAVAILABLE` and holds a measurement from Oct 8
- **THEN** the block on Mobile shows the Oct 8 cards under "Couldn't refresh: Google's PageSpeed
  service did not answer after several tries. Showing the measurement from Oct 8."

#### Scenario: Google rejected the key
- **WHEN** the detail says `state: 'keyRejected'` and the page has a measurement from Oct 8
- **THEN** the block opens with the key-rejected notice and still shows the Oct 8 cards

#### Scenario: a page never measured on desktop
- **WHEN** the reader switches to Desktop on a page whose desktop summary is null
- **THEN** the block says "Not measured on desktop yet: this page was crawled before desktop
  measurement existed. The next crawl or seed run queues it." and makes no request

#### Scenario: one device measuring, the other waiting
- **WHEN** the mobile row is `running` and the desktop row is `queued`
- **THEN** Mobile reads "Measuring…" and Desktop reads "In queue for measurement"

#### Scenario: the Lighthouse captions
- **WHEN** both devices are measured and the mobile measurement holds an SEO score of 92
- **THEN** Mobile shows the SEO and accessibility captions, and Desktop shows the performance
  caption alone

### Requirement [PAGEDETAIL-012]: the score's explanation says speed is scored separately, and whose checks the number holds

The score explanation MUST state that Core Web Vitals are shown in the Speed block and listed as
issues but do not change the score, and why. It MUST state whether Lighthouse's verdicts are in
the number:
- when they are, it MUST say how many of the applicable checks are ours and how many are
  Lighthouse's, and when Lighthouse measured the page, in the user's zone;
- when they are not, it MUST say why — not measured yet, PageSpeed not configured, or the key
  rejected — and that the score will move when they arrive.

The arithmetic it shows MUST be the weighted one the score was computed from — the points the
applicable checks were worth, the points the failures cost, and the quotient — and MUST agree
with the score shown.

Modified by `lighthouse-checks`: Lighthouse joined the score. Without this sentence, a page's
score changing hours after its crawl, with no change to the page, would be unexplained.

#### Scenario: a page with a poor LCP
- **WHEN** the detail of a page carrying `CWV_LCP_POOR` is opened
- **THEN** the explanation's arithmetic uses the same applicable and failed counts as before the
  finding, and a paragraph says speed is scored separately

#### Scenario: a page with Lighthouse verdicts
- **WHEN** the page's crawl judged 16 applicable checks worth 60 points of which 13 were lost,
  and Lighthouse judged 20 worth 100 points of which 7 were lost, measured on Oct 11
- **THEN** the explanation shows 100 × 140 ÷ 160 = 87.5 rounded half-up to 88, and says 16 of the
  36 checks are ours and 20 are Lighthouse's from its run on Oct 11

#### Scenario: a page Lighthouse has not measured
- **WHEN** the page's score comes from the crawl alone because it has not been measured yet
- **THEN** the explanation says Lighthouse's checks are not in the number yet and that the score
  will move when they are measured

#### Scenario: a client without a PageSpeed key
- **WHEN** the detail is opened while PageSpeed is not configured
- **THEN** the explanation says so, and says the verdicts join the score after the page's next
  measurement

### Requirement [PAGEDETAIL-013]: the Speed block says what real visitors wait for first, how visits split, and where LCP's time went

The Speed block MUST show:
- the field time to first byte with its value, band, source in plain words and the date. It MUST
  be shown as a line of its own and not as a fourth Core Web Vitals card, and it MUST be absent
  with a reason when Google has no field data;
- under each metric that comes from real visitors, a bar of the share of visits in the good,
  needs-improvement and poor bands, with each share in words in its tooltip;
- the LCP breakdown: the element named as Lighthouse names it, and one segment per phase sized
  by its share of the phases' total, each share in words in its tooltip. It MUST be labelled a
  lab figure from an unthrottled trace that does not add up to any LCP shown above it, and MUST
  NOT present the phases' milliseconds as the page's LCP;
- Lighthouse's SEO and accessibility scores as lab captions beside the performance score, never
  as badges or findings.

Any of these absent from the measurement MUST be omitted without an empty frame.

AMENDED during implementation (task 1.2): this requirement showed each phase "with its time". The
live answer's phases come from Lighthouse's unthrottled trace. On yoast.com they sum to 2.3 s,
next to a simulated lab LCP of 8.9 s, so milliseconds beside the card would contradict it. The
phases' shares are what is true of both.

#### Scenario: field data for the page
- **WHEN** the measurement holds TTFB 620 ms from `url` and LCP shares 0.68 good and 0.11 poor
- **THEN** the block reads "Time to first byte (real visitors to this page): 620 ms · Good", and
  the LCP card carries a bar whose tooltip reads "68% of visits good, 21% need improvement, 11%
  poor"

#### Scenario: a lab-only measurement
- **WHEN** LCP and CLS come from `lab` and Google has no field TTFB
- **THEN** no share bar is shown, the TTFB line says Google has no real-visitor data for this
  page or site, and the LCP breakdown is shown with its lab label

#### Scenario: an image LCP
- **WHEN** the breakdown holds time to first byte 6 ms, resource load delay 736 ms, load duration
  43 ms and render delay 1529 ms
- **THEN** the bar's segments are 0%, 32%, 2% and 66%, and no phase's milliseconds are shown as
  the LCP

#### Scenario: the category scores
- **WHEN** the measurement holds an SEO score of 92 and an accessibility score of 78
- **THEN** the captions read "Lighthouse SEO score (lab): 92/100" and "Lighthouse accessibility
  score (lab): 78/100" beside the performance caption
