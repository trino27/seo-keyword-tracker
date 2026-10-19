# be/src/modules/pages Specification

## Purpose
What the user reads back — the page list, one page's detail, and the rank history
behind it, each scoped to that user's own clients.

## Requirements

### Requirement [PAGES-001]: a rank snapshot is a page-keyword pair's position at an instant

A rank snapshot MUST be keyed by page, keyword and the instant it was captured, stored as
`timestamptz` in UTC; it MUST belong to an existing page-keyword pair (composite foreign key, cascading
with the pair), and its position MUST be between 1 and 100.

#### Scenario: a snapshot for a pair the page does not have
- **WHEN** a snapshot is inserted for a keyword not paired with the page
- **THEN** the insert fails on `rank_snapshots_page_keyword_fk`

#### Scenario: an out-of-range position
- **WHEN** a snapshot with position 0 or 101 is inserted
- **THEN** the insert fails on `rank_snapshots_position_range`
### Requirement [PAGES-002]: the pages list shows the user's current pages, paginated in the database

`GET /api/pages` MUST return only pages of the signed-in user's clients that were seen by their
client's latest succeeded or partial run, optionally filtered by `clientId`, ordered by client
name then sitemap position, paginated with `pageSize` at most 50, with the total of matching pages.

#### Scenario: a page dropped by a re-crawl
- **WHEN** a re-crawl no longer finds a page
- **THEN** the page is not listed and the total does not count it

#### Scenario: a failed re-crawl
- **WHEN** a client's newest run failed
- **THEN** the pages of its previous successful run are still listed

#### Scenario: a page size above the limit
- **WHEN** a request asks for `pageSize=51`
- **THEN** the answer is 400

### Requirement [PAGES-003]: search matches a page's URL or any of its current keywords, literally

The `q` parameter MUST match pages whose URL contains it, or that have a current keyword whose term
contains it, case-insensitively; `%` and `_` in `q` MUST match themselves.

#### Scenario: searching for a percent sign
- **WHEN** a user searches `%`
- **THEN** only pages whose URL or keyword literally contains `%` are returned

### Requirement [PAGES-004]: latest and best positions are computed at read time

Every keyword of a listed page MUST carry its latest position and capture instant, and each page
MUST carry its best position — the minimum latest position among its current keywords, with the
keyword that produced it (ties: higher relevance, then term) — or null when it has no snapshot;
these MUST be read from the snapshot primary key for the listed page only, never stored.

#### Scenario: a page crawled after the last seed
- **WHEN** a UI-added client's page has no snapshots
- **THEN** its best position is null and every keyword's latest position is null

### Requirement [PAGES-005]: filtering by a client the user does not own is a 404

A `clientId` that is not the signed-in user's MUST answer 404 `CLIENT_NOT_FOUND`, the same as a
non-existent one.

#### Scenario: user B filters by user A's client
- **WHEN** user B requests `/api/pages?clientId=<A's client>`
- **THEN** the answer is 404 CLIENT_NOT_FOUND

### Requirement [PAGES-006]: a page's detail carries its keywords, issues and last crawl

`GET /api/pages/:id` MUST return a current page of the signed-in user with its client, its current
keywords with latest positions, its best position, its SEO issues, and its client's latest crawl
run; any other id MUST answer 404 `PAGE_NOT_FOUND`.

#### Scenario: a page that dropped out
- **WHEN** the detail of a page absent from the latest run is requested
- **THEN** the answer is 404

### Requirement [PAGES-007]: the history has one series per current keyword

`GET /api/pages/:id/positions` MUST return `{ from, to, timeZone, series }` with one series per
current keyword of the page, each a list of `{ capturedAt (UTC ISO), position }` in time order; a
keyword without points in the range MUST keep an empty series. The read MUST be one range scan of
the snapshot primary key for that page.

#### Scenario: a keyword added by a re-crawl
- **WHEN** the range ends before the keyword's first snapshot
- **THEN** its series is present and empty

### Requirement [PAGES-008]: the history range is bounded

Without `from` and `to` the range MUST be the last 30 days ending today in the user's zone; a `to`
after today MUST be clamped to today; `from` after `to`, or a span above 366 days, MUST answer 400
`INVALID_DATE_RANGE`; a malformed date MUST answer 400.

#### Scenario: a range of 367 days
- **WHEN** a request spans 367 calendar days
- **THEN** the answer is 400 INVALID_DATE_RANGE

### Requirement [PAGES-012]: a page answers every crawl-owned catalogue check with one of four statuses

A page's detail MUST carry, for each owner whose verdicts are scored (the crawl and Lighthouse),
either that owner's list of checks or null.

**What a list holds.** One entry per active code of that owner, in catalogue order, each with
exactly one of four statuses:
- the check passed;
- the check failed;
- the check could not be judged on this page;
- the owner did not record this check the last time it judged the page.

A code of an owner that is not scored MUST NOT appear as a check entry. Each owner's status MUST
be composed on the backend from the lists that owner stored, because only those lists can tell a
skipped check from one that was never recorded. The crawl's lists are stored on the page row,
and Lighthouse's lists on the page's mobile measurement.

**When a list is null.** An owner's list MUST be null when that owner has no stored lists for the
page: the crawl predates the recording, or Lighthouse has not measured the page. The other
owner's list MUST NOT depend on it.

**What the database enforces.** The crawl's stored lists MUST be written by the same statement
that writes the page's check counters. The database MUST refuse a row whose judged list
disagrees with its applicable count, whose two lists share a code, or whose lists hold a
duplicate, a null or an empty code. A re-crawl MUST replace both lists rather than merge them.

Modified by `issue-catalogue-owners`: the catalogue gained codes the crawl does not run. Listed as
checks they would read "not yet checked" on every page forever, since no crawl will ever judge
them; a speed finding is shown in the page's issues and in its Speed block instead.

Modified by `lighthouse-checks`: Lighthouse is a second owner whose verdicts are checks. It
judges the page at a different time from the crawl, and can be missing while the crawl is
present. Each owner therefore gets its own list and its own null, and one list never claims what
the other owner recorded.

#### Scenario: a page whose crawl skipped two checks

- **WHEN** its detail is read and the page stored 16 judged codes, 2 not-applicable codes and one
  failing finding
- **THEN** the crawl's list carries 18 entries: 15 passed, 1 failed and 2 not applicable, in
  catalogue order

#### Scenario: a page carrying a speed finding

- **WHEN** a page holds `CWV_CLS_POOR` among its findings
- **THEN** no check entry of any owner names a Core Web Vitals code, and every other entry's
  status is what it was without the speed finding

#### Scenario: a page Lighthouse has judged

- **WHEN** the page's mobile measurement holds 20 judged Lighthouse codes, 6 not applicable, and
  the page holds two Lighthouse findings
- **THEN** Lighthouse's list carries 18 passed, 2 failed and 6 not applicable entries, and the
  crawl's list is unchanged

#### Scenario: a page Lighthouse has not measured

- **WHEN** the page has no measurement, or one stored before Lighthouse's lists existed
- **THEN** Lighthouse's list is null and the crawl's list is composed as before

#### Scenario: a Lighthouse audit that errored

- **WHEN** a Lighthouse code is in neither of the measurement's lists
- **THEN** its status is that Lighthouse did not record it

#### Scenario: a check added to the catalogue after the crawl

- **WHEN** a crawl-owned code is in neither stored list
- **THEN** its status is "not yet checked", and the page's score is unchanged because the score
  reads the stored counters and lists and never today's catalogue

#### Scenario: a code that has left the catalogue since the crawl

- **WHEN** a stored list holds a code the catalogue no longer defines
- **THEN** no entry is produced for it

#### Scenario: a page last crawled before the lists were recorded

- **WHEN** its detail is read
- **THEN** the crawl's list is null, and the screen says the page must be re-crawled

#### Scenario: a write whose count and list disagree

- **WHEN** a page is written with an applicable count that is not the size of its judged list
- **THEN** the database rejects it and the crawl's finalize aborts

#### Scenario: a re-crawl that skips nothing

- **WHEN** a page that previously stored two not-applicable codes is re-crawled and every check
  applies
- **THEN** its stored not-applicable list is empty

### Requirement [PAGES-009]: a page's health score is the share of the checks that could apply to it, weighed by severity

The pages list and the page detail MUST each carry a score derived at read time as the rounded
percentage of the applicable checks' points that the page kept. Each check weighs what its
catalogue severity says — Critical (error) 10, Important (warning) 3, Improvement (notice) 1 —
and both the numerator and the denominator are weighed, so a page that passed every applicable
check scores 100. Only findings whose code the page's crawl judged cost points; a page whose
crawl predates per-check recording weighs every check as 1. One implementation of the formula
MUST serve both the backend and the frontend, the weights MUST live in one place, and the list's
order MUST be computed from the same sums.

The points and the counts MUST be summed over every scored owner — the crawl's and Lighthouse's
alike, each check weighed by its own severity, a check both owners judge counted on each side. An
owner with no stored record MUST contribute nothing. The score MUST be reported together with the
summed applicable and failed counts, the points possible and lost it came from, and each scored
owner's own counts or that owner's absence, so two pages with different denominators are never
presented as comparable without the denominator being visible.

Modified by `lighthouse-checks`: Lighthouse's verdicts count in the score. A page's score moves
when its first Lighthouse verdicts are stored. A client without a PageSpeed key keeps a
crawl-only score, and the per-owner counts say which kind each page has.

#### Scenario: a Critical failure costs more than an Improvement

- **WHEN** two pages judged the same Critical and Improvement checks, and one failed the Critical
  check while the other failed the Improvement
- **THEN** the first scores 9 (1 of 11 points kept) and the second 91 (10 of 11)

#### Scenario: points equal to counts

- **WHEN** a page's applicable checks were worth 16 points and its failures cost 2
- **THEN** its score is 88

#### Scenario: a page that passed everything that applied

- **WHEN** a page stored 18 applicable checks and 0 failures
- **THEN** its score is 100

#### Scenario: crawl and Lighthouse together

- **WHEN** a page's crawl judged 16 applicable checks worth 60 points of which 13 were lost, and
  Lighthouse judged 20 worth 100 points of which 7 were lost
- **THEN** its score is 88 (140 of 160 points kept), reported with `applicable: 36`, `failed: 5`,
  and the crawl's and Lighthouse's counts beside each other

#### Scenario: a page Lighthouse has not measured

- **WHEN** a page's crawl judged 16 applicable checks of which 2 failed, each worth 1 point, and
  no measurement holds Lighthouse's lists
- **THEN** its score is 88 and Lighthouse is reported absent, not as zero

#### Scenario: the list orders by the same score

- **WHEN** page A scores 88 on the crawl alone, and page B scores 90 on the crawl alone but 80
  once Lighthouse's points are added
- **THEN** page B is listed before page A

#### Scenario: a page nothing could be judged on

- **WHEN** a score is asked for with no applicable check of any owner
- **THEN** it is refused as a defect rather than reported as zero

### Requirement [PAGES-010]: the pages list is ordered worst first under a total order

The list MUST be ordered by score ascending, then by the points lost descending, and
MUST end its ordering on the page id so that the order is total; every page matching the filter
MUST appear exactly once across the paginated walk. The score expression used for ordering MUST
be evaluated in a type that preserves fractions.

#### Scenario: two pages with different scores

- **WHEN** one page scores 50 and another 90
- **THEN** the page scoring 50 comes first

#### Scenario: walking every page of a list whose scores tie

- **WHEN** four pages share a score and the list is walked at a page size of 3
- **THEN** each page id is returned exactly once and all of them are returned

#### Scenario: integer division

- **WHEN** the ordering expression divides two integer point totals without a cast
- **THEN** the two-page ordering scenario above fails

### Requirement [PAGES-011]: a finding is reported with how many of the client's current pages carry it

The API MUST report, for each issue code, how many of that client's current pages carry it,
computed at read time over the client's current pages and NOT over the filtered or paginated
slice; storage MUST NOT change. The list MUST additionally report, per page, how many of its
findings are shared with at least one other current page of the same client. Both MUST be
produced without a query per row.

#### Scenario: a template problem across a client's pages

- **WHEN** H1_MULTIPLE is present on five of a client's fifteen current pages
- **THEN** each of those pages reports the code as affecting five pages

#### Scenario: a search that matches one page

- **WHEN** the list is filtered by a search that matches only one of those five pages
- **THEN** that page still reports the code as affecting five pages, not one

#### Scenario: a problem of one page only

- **WHEN** a code is present on exactly one of the client's current pages
- **THEN** it reports one page affected, and that page's shared count does not include it

#### Scenario: another client's pages

- **WHEN** two clients of the same user both have pages carrying the code
- **THEN** each client's pages count only their own client's pages

### Requirement [PAGES-013]: a speed finding counts among a page's issues and never in its score

A speed finding MUST be counted in the page's issue counts by severity and in the client-wide
spread of its code, exactly as a crawl finding is, and MUST be returned among the detail's issues.
The page's score, its applicable and failed counts, and its place in the list's order MUST NOT
change when a speed finding is written or removed.

#### Scenario: a page gains a poor LCP
- **WHEN** a page scoring 88 out of 16 applicable checks gains `CWV_LCP_POOR`
- **THEN** its warning count grows by one, its detail lists the finding, and it still scores 88
  out of 16 in the same position of the list

#### Scenario: the same origin figure on every page
- **WHEN** fifteen pages of a client carry `CWV_INP_NEEDS_IMPROVEMENT` from origin data
- **THEN** each reports the code as affecting fifteen pages, and each counts it as site-wide

### Requirement [PAGES-014]: the list and the detail carry each page's speed summary and PageSpeed's state

Each pages-list item MUST carry the page's mobile speed summary, and each page detail MUST carry a
summary per strategy, mobile and desktop. A summary holds the queue status, the last measurement
with each metric's value, band and source and the time measured, and the reason of the last
failure, or null when the page was never queued on that strategy. Each metric's band MUST be
derived when read, from the stored value and `CWV_THRESHOLDS`, by the same function the PageSpeed
worker uses to choose findings; the band MUST NOT be stored. The failure reason MUST be sent only
for a failed row. The list response and the detail MUST carry PageSpeed's state in the API
process — `notConfigured` without a key, `keyRejected` after Google refused the key and the worker
halted, `active` otherwise — answered by the one function every read path uses. The list MUST
still be read in a constant number of statements, MUST list a page once however many strategies
it has rows for, and a page's score and place in the list's order MUST be read from its mobile
row alone.

Modified by `desktop-core-web-vitals`: a page now has a row per strategy (SPEED-020). The list
keeps the mobile badge (plan D21), and a join that does not name the strategy would list every
page twice and compute its Lighthouse share once per row (plan D43). The detail carries both,
keyed by strategy, so a third strategy would be a compile error on every reader rather than a
field nobody reads.

#### Scenario: a page with a poor CLS from the lab
- **WHEN** a page's stored mobile measurement holds CLS 0.31 from `lab`
- **THEN** its list summary's CLS reads value 0.31, band `poor`, source `lab`, and its detail
  lists `CWV_CLS_POOR`

#### Scenario: a page Google could not load, measured yesterday
- **WHEN** a mobile row is `failed` with `PAGE_LOAD_FAILED` and holds yesterday's measurement
- **THEN** the summary carries yesterday's values, status `failed` and `lastError`
  `PAGE_LOAD_FAILED`

#### Scenario: a page in backoff
- **WHEN** a row is `queued` after a timeout with `last_error` set
- **THEN** the summary's `lastError` is null

#### Scenario: no key
- **WHEN** the API runs with no PageSpeed key
- **THEN** the list and the detail carry `state: 'notConfigured'`

#### Scenario: Google rejected the key
- **WHEN** the worker has halted on a rejected key
- **THEN** the list and the detail carry `state: 'keyRejected'`, and stored measurements are
  still returned

#### Scenario: a page measured on both devices
- **WHEN** a page has a mobile and a desktop row
- **THEN** the list returns it once with its mobile summary, and its detail carries both summaries
  under `mobile` and `desktop`

#### Scenario: a page never measured on desktop
- **WHEN** a page has a mobile row and no desktop row
- **THEN** its detail's desktop summary is null

#### Scenario: a desktop measurement lands
- **WHEN** a page scoring 88 is measured on desktop
- **THEN** it still scores 88 and keeps its place in the list

### Requirement [PAGES-016]: a Lighthouse finding counts among a page's issues, in the client-wide spread and in the score, even when it repeats one of ours

A Lighthouse finding MUST be counted in the page's issue counts by severity and in the
client-wide spread of its code, exactly as a crawl finding is. It MUST be returned among the
detail's issues and MUST count as a failed check in the page's score. A Lighthouse finding that
repeats a crawl finding of the same counterpart group MUST still be counted on its own. Neither
finding MAY hide the other.

#### Scenario: a page without a title
- **WHEN** a page with 16 applicable crawl checks and 7 judged Lighthouse audits holds
  `TITLE_MISSING` and Lighthouse's title code, and nothing else fails
- **THEN** its issue counts include both, and its score is 21 passed of 23 applicable

#### Scenario: a problem on a template
- **WHEN** five of a client's fifteen current pages fail Lighthouse's `link-text`
- **THEN** each of those pages reports that code as affecting five pages

#### Scenario: a measurement stored before the accessibility audits were retired
- **WHEN** a page's measurement judged 37 Lighthouse audits, ten of them SEO audits, and failed
  `color-contrast`
- **THEN** its score counts the ten SEO audits only, and `color-contrast` neither fails nor
  appears among its checks

AMENDED after implementation (D24): the score counts the active Lighthouse codes only, read
through their weights in the query, not `cardinality(lighthouse_judged)` and `lighthouse_failed`.

### Requirement [PAGES-017]: the measurement carries the field TTFB, the shares of visits, the LCP breakdown and the category scores

A page's speed summary MUST carry, with its measurement:
- the field TTFB with its band and source, or none;
- for each metric whose source is real visitors, its good and poor shares;
- the LCP breakdown, with its element and phases, marked as a lab figure;
- the SEO and accessibility category scores, each or both absent when not measured.

TTFB's band MUST be derived when read from Google's published TTFB thresholds (good up to 800
ms, poor above 1800 ms), by one shared function, and MUST NOT be stored. TTFB MUST NOT produce a
finding. The list MUST still be read in a constant number of statements.

#### Scenario: a page measured with field data
- **WHEN** a page's measurement holds TTFB 620 ms from `url` and LCP shares 0.68 good, 0.11 poor
- **THEN** its summary reads TTFB 620 ms, band good, source `url`, and LCP shares 0.68 and 0.11

#### Scenario: a page measured before this change
- **WHEN** a page's measurement predates the new columns
- **THEN** its summary carries its Core Web Vitals as before and every new part as absent
