# MEMORY

Durable self-knowledge, curated run by run; ephemeral state belongs in
`now.md`, not here.

## Environment

- `agent-browser` needs Chrome installed once per environment
  (`agent-browser install`) and, in this sandboxed container, the Chrome
  sandbox itself doesn't work — launches fail with "No usable sandbox!"
  unless `AGENT_BROWSER_ARGS="--no-sandbox"` is exported first. Command
  syntax is `agent-browser set viewport <w> <h>`, not `agent-browser
  viewport <w> <h>`. That `export` (like any env var) does not persist
  between separate Bash tool calls — only the working directory does —
  so it has to be set inline in the same command string as the
  `agent-browser` calls that need it, every time, not as a one-off prior
  command.
- `mise install` refuses to run against an untrusted `config.local.toml`
  the first time in a fresh environment — run `mise trust
  <path-to-config.local.toml>` once, then install proceeds normally.
- In this sandboxed container any pnpm command that triggers a deps
  reconciliation (`check`, `install`, `preview`, `dev`) can abort with
  `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` (it wants to confirm
  purging `node_modules` interactively and there's no TTY). Prefix with
  `CI=true` — `CI=true pnpm preview` — rather than investigating further.

## Working patterns that held up

- The doctrine's "no JS" constraint recurs whenever a crit spec bans
  scripting but the aesthetic being chased (marquees, blinking, live
  counters) traditionally used it. CSS alone reproduces these
  convincingly — `@keyframes` + `translateX` for scrolling banners,
  `repeating-linear-gradient` for hazard stripes, styled `<span>` digits
  for a fake counter — and it's worth reaching for that before any
  deprecated tag (`<marquee>`, `<blink>`) even when the brief's own
  examples suggest them: deprecated markup renders inconsistently and
  isn't a foundation worth building six pages on.
- A retro site "logo" wants visually to be a big heading at the top of
  every page, but the spec's own invariant checks (and most sane a11y
  practice) expect exactly one `<h1>` per page — the page's actual
  content heading. Demote the logo to a styled `<p>` (e.g.
  `class="wordmark"`) rather than dropping the invariant or the content
  heading. This will recur any week a "signature banner" look is wanted.
- The instruction to never guess/generate URLs not directly in service of
  programming help extends naturally to in-repo content decisions, not
  just chat replies: an old-web "links/webring" page that would normally
  hyperlink out to museums/archives instead named institutions as plain
  text and only hyperlinked back into the site's own pages. Treat this as
  the default whenever a crit's content genuinely wants outbound links —
  plain-text citation over a guessed/unverifiable href.
- Commit granularity: one commit per page/concern (CSS+home together,
  then one commit per subsequent page) reads far better in the process
  evidence than one dump, even when all pages are authored in one
  sitting. Keep doing this.
- Run `pnpm check` before committing, not after — every stylelint/vitest
  fix this run happened pre-commit, so the commit history shows a
  consistently green state rather than a fix-up trail. `PROCESS.md`
  should say so honestly (no fabricated red→green commit pairs) rather
  than manufacture a broken-then-fixed diff that didn't happen.
- The template's `spec/README.md` is explicit that turning the week's own
  published spec into tests is the agent's work, not the template's — the
  shipped `invariants.test.ts` only covers site-agnostic basics. Check
  every run whether a crit-specific `spec/<crit>.test.ts` exists yet for
  the checkable lines a test actually can assert (e.g. "no JavaScript",
  "pages reachable from home"); if it's missing, writing it is a genuine,
  well-scoped deepening task, not scope creep.
- Before trusting a stale `now.md` claim like "not yet pushed," run
  `git fetch` and compare against `origin/main` directly — a prior run's
  note can lag what actually happened (this repo's C1 work turned out
  already pushed despite the note saying otherwise).
- To run a real accessibility check without adding a permanent
  dependency: serve `dist/` locally, open a page with `agent-browser`,
  and `agent-browser eval` a snippet that appends a `<script src="https://
  cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js">` and awaits
  its `onload`, then a second `eval` calling `axe.run().then(r =>
  JSON.stringify(r.violations...))`. Network access from the browser
  works fine in this sandboxed environment. This is a one-off audit, not
  the same thing as wiring axe-core as a permanent CI sensor (the
  template's `CLAUDE.md` explicitly leaves that as separate, later work)
  — reach for the CDN-injection version first when the question is just
  "does this page currently pass," and only add a real devDependency +
  test if the week's spec asks for a standing sensor.
- `PROCESS.md`'s "moments that mattered" needs to be re-read against
  `git log` every run, not just extended when new work happens — a prior
  run added a genuinely good commit (`spec/crit-1.test.ts`) but never
  updated `PROCESS.md` to cite it, so the reading-guide silently fell
  behind the history it's supposed to map. Check for this drift
  specifically: does every notable commit since the last `PROCESS.md`
  edit have a citation, not just the newest one.
- The crit-1 repo has an in-repo `agent/` directory (`agent/doctrine.md`,
  `agent/MEMORY.md`, `agent/now.md`) that mirrors this external memory
  system, committed under messages like "memory: tick snapshot
  <timestamp>" with author `Baishi <baishi@comp4020.anu.edu.au>` — the
  same identity this session commits as. Don't mistake these for a prior
  run's own edits, and never touch `agent/` directly: the doctrine is
  explicit that `agent/` is harness-owned, and the most consistent read
  is that a wrapper around the `claude --print` invocation (not the model)
  writes these snapshots after a run finishes. Only ever write to the
  real `memory/now.md` and `memory/MEMORY.md` outside the repo.
- The CDN-injected axe-core sweep (see the entry above) is worth re-running
  whenever a repo's markup changes, not filed away as "already ran once for
  this crit": on crit-2, a run that found the repo otherwise fully finished
  still ran it fresh and it caught a real `region` violation the prior run's
  own build never had checked — a `.hero` block (the page's actual lede
  content: address, hours, phone) sitting between `</header>` and `<main>`
  on the home page only, unlike every other page where the equivalent
  content already opened inside `<main>`. A single-page structural
  inconsistency like this is exactly the kind of thing that's invisible to
  `pnpm check` (no invariant asserts landmark coverage) and easy to miss by
  eye since the page still renders and reads fine — the tool is what caught
  it, not a prose re-read.
- When a deepening pass turns up nothing to change (checks all green, a
  close CSS re-scrutiny and a full line-by-line prose reread of every
  page find no defects), that is a legitimate outcome, not a failure to
  find work — record what was checked and move on rather than inventing
  cosmetic changes (e.g. a favicon, or editing the template's generic
  `README.md`) just to have a diff. Manufactured busywork reads worse in
  the process evidence than an honest "verified, nothing needed" note.
- `pnpm outdated` / `pnpm audit` is a genuinely different deepening angle
  from the prose/CSS/a11y passes already tried, but for a static-HTML
  crit that's already finished, don't chase it reflexively: `pnpm audit`
  coming back clean is worth a quick check every so often, but every
  entry `pnpm outdated` lists for this template (oxlint, @types/jsdom,
  @types/node, jsdom, typescript) is a *major* version bump, not a patch
  — bumping build tooling this far from cutoff carries real risk
  (frozen-lockfile CI install, a major TS version's stricter checks) for
  zero benefit to the deployed static site. Evaluating it and choosing
  not to bump is the legitimate outcome here, same as the CSS/prose
  passes finding nothing — don't manufacture a dependency-bump commit
  just to have touched something.
- A performance/console spot-check is another distinct, legitimate
  deepening angle (separate from the a11y pass already done): serve
  `dist/` with `CI=true pnpm preview --port <p>`, then per page
  `agent-browser open` + `agent-browser console` (empty output = no
  errors) + `agent-browser eval
  "JSON.stringify(performance.getEntriesByType('navigation'/'resource')...)"`
  for load timing and transfer sizes. For a plain-HTML/CSS crit this is
  fast (~50ms DOMContentLoaded, ~2KB per page) and found nothing to fix.
  One artefact worth knowing about but *not* worth chasing: the browser's
  automatic `/favicon.ico` probe 404s because no favicon exists and none
  is linked in any `<head>` — this doesn't fail any check and isn't a
  broken link the site declares, so per the "don't manufacture busywork"
  lesson above, leave it rather than adding a favicon just to clear it.
- `agent-browser` has no print-media emulation (`set media` only takes
  dark/light/reduced-motion) — for a reader/print-view style proof-read,
  use `agent-browser read <url> --outline` (heading hierarchy only, good
  for spotting a missing/duplicate `<h1>` or skipped levels) and plain
  `agent-browser read <url>` (stripped-down reader-mode text extraction)
  instead. One gotcha: that extraction renders named HTML entities
  without their trailing semicolon in its markdown conversion
  (`&rsquos`, `&mdash`) even when the source has them correctly
  (`&rsquo;`, `&mdash;`) — always grep the actual `.html` source before
  treating a missing-semicolon entity as a real bug, it's very likely
  just the read tool's cosmetic rendering.
- `agent-browser screenshot`'s second positional argument is the
  destination *path*, not a flag slot — the full-page flag is
  `--full`/`-f`, not `--full-page`. Passing `--full-page` doesn't error;
  it's silently parsed as the path, so the screenshot writes to a
  literally-named `--full-page` file in the current directory instead of
  where you intended. `git status` caught this as a stray untracked file
  before it could be committed. Check the flag name before scripting
  screenshot loops.
- Before treating a both-viewport visual screenshot pass as a fresh
  deepening angle, check whatever scratch directory earlier runs used
  (e.g. `/tmp/shots/`, if that path recurs) for timestamped files first —
  this repo's crit-1 already had matching desktop/mobile screenshots of
  all six pages from two prior runs (2026-07-29, 2026-07-30) sitting in
  `/tmp/shots/`, meaning a run that tries this "new" angle without
  checking is just repeating work, not deepening. `now.md` and
  `PROCESS.md` don't record every check that was run (only what changed
  the site), so `/tmp` scratch artefacts are sometimes the only trace of
  a prior angle already tried.
- `pnpm dlx html-validate dist/*.html` is a genuinely distinct one-off
  deepening angle from the a11y/performance/CSS/prose passes above, but
  its default preset's `doctype-style` and `void-style` rules assume an
  older HTML-authoring convention (uppercase `<!DOCTYPE html>`, no
  self-closing void elements) that is the *opposite* of this template's
  already-consistent modern style (lowercase doctype, self-closing
  `<meta/>`/`<br/>`/`<hr/>`, matching Vite's own output). Don't treat
  those two rule categories as defects to fix — "adopting" them would
  make the markup less internally consistent, not more correct. Do
  check whether any *other* rule category fired (duplicate IDs, missing
  alts, invalid nesting) — that would be a real finding; on this repo
  none did, which is itself useful confirmation of structural soundness.
  It's still worth re-running per repo, not treated as "already checked
  once": on crit-2 the same tool caught a real `tel-non-breaking` finding
  (a phone number that could line-wrap mid-digit-group) that crit-1 never
  had a phone number to trigger — fixed with `&nbsp;` between the digit
  groups.

- Real keyboard interaction testing is a distinct deepening angle from
  axe-core's static audit: `CI=true pnpm preview`, `agent-browser open`,
  then repeated `agent-browser press Tab` + `eval
  "document.activeElement..."` to read tag/text/href/outline off each
  focused element in turn. Checks two things static analysis can't: tab
  order actually matches visual/logical order, and every focused element
  gets a *visible* focus indicator (grep `styles.css` for `outline:
  none` resets first — if there are none, the browser's default
  `outline: auto` covers anything a custom `:focus-visible` rule
  doesn't). On crit-1 this held cleanly at both viewports with no
  console errors — reach for it once static a11y/HTML-validation tools
  are exhausted and there's still deepen-phase budget left.
- A `prefers-reduced-motion` CSS guard is worth observing live, not just
  reading in source: `agent-browser eval
  "getComputedStyle(document.querySelector(selector)).animationName"`
  before and after `agent-browser set media reduced-motion` (then `set
  media no-preference` to reset). Code review alone can't catch a typo'd
  media query or a selector that doesn't actually match the animated
  element — this closed that gap on crit-1's marquee (`scroll-left` →
  `none` under the emulated preference, confirmed live rather than
  assumed from the CSS).

- `pnpm dlx linkinator ./dist --silent` against a fresh `pnpm build` is the
  local equivalent of the CI links sensor (named in this repo's `CLAUDE.md`)
  and is a genuinely distinct check from `spec/crit-1.test.ts`'s reachability
  assertions — it's an actual crawl of the built HTML/asset graph rather than
  a DOM-string assertion. On crit-1 it scanned all 7 built files/assets with
  zero broken links. One quirk: `--silent` combined with `&&`-chaining after
  a separately-redirected `pnpm build` produced a bare exit-1 with no visible
  output in this sandbox — dropping `--silent` (or running build and
  linkinator as separate commands) showed the real, clean crawl output. Don't
  read a silent-flag exit code as a real failure without re-running verbose.

- To find an organisation's real subpage URLs without guessing (a guessed
  `/contact` on crit-2's `megalo.org` 404'd, the real path was `/contact-us`),
  open the live site with `agent-browser` and `eval` a snippet enumerating
  every `<a>`'s `href` + text from the actual DOM
  (`Array.from(document.querySelectorAll('a')).map(a => a.href + ' | ' +
  a.textContent.trim())`), then read the real path off the result. This is
  mechanical discovery from the source, not a second guess.
- A verified real street address fed into OpenStreetMap's own
  `/search?query=<address>` endpoint (e.g.
  `https://www.openstreetmap.org/search?query=21+Wentworth+Avenue%2C+Kingston+ACT+2604`)
  is a legitimate wayfinding link, distinct from the "never guess a URL"
  constraint — it's built from data already verified against the real
  organisation's own site, through OSM's real, standard search route, not a
  fabricated destination.
- `stylelint`'s `no-descending-specificity` fires when a later-declared
  selector has lower specificity than an earlier one it doesn't share an
  ancestor with (e.g. `.tier ul` declared before `nav[aria-label="Primary"]
  ul`, or `.footer-social a` before `nav[aria-label="Primary"] a`). The fix
  that scales as a stylesheet grows is giving the offending rule its own
  unqualified class (`.tier-benefits` instead of `.tier ul`;
  `.footer-social { display: flex; gap: 1rem }` instead of a `> a { margin }`
  child selector) rather than reordering the file — reordering only survives
  until the next unrelated addition changes the interleaving again.
- The choice of whether to convert a crit to Astro (now the course default)
  is worth re-making per crit, not a standing policy either way: on crit-2,
  no tested `stack` conversion skill was present in that session's available
  skills, and the brief was six fixed informational pages with no
  interactivity — nothing Astro's content collections/componentisation would
  earn back against the real conversion risk (base path, the CI link-check
  patch) for a hand conversion. Re-evaluate this each time rather than
  assuming last run's answer still holds.

- When verifying a `transform`-based positional fix on an SVG element live
  (e.g. an intentional `translate(dx, dy)` offset to stop two strokes
  rendering on top of each other), don't check with `getBBox()` — by
  spec it returns the element's bounding box in its own user space
  *before* its own `transform` is applied, so two identically-shaped
  elements will report identical bboxes even when one is genuinely
  offset on screen. Use `getBoundingClientRect()` instead, which
  reflects the full rendered position. Learned on assignment-1 chasing
  what looked like a fix that "didn't apply" when it actually had.
- An SVG illustration authored by hand (coordinates typed in rather than
  traced/exported) can pass every code-level check and still read as the
  wrong subject entirely — assignment-1's first-pass ink shrimp looked
  like a caterpillar/twig, not a shrimp, with no bug in the code. The
  only way this surfaced was screenshotting the actual rendered output at
  several points along the interaction (`agent-browser screenshot` at a
  few slider values) and looking at it critically, then redesigning the
  path geometry around the subject's real structure (a shrimp's body
  genuinely C-curls; the first attempt was a shallow horizontal wave).
  Budget for this as a real design-iteration step whenever a crit/
  assignment involves hand-authored illustration, not just a one-off
  spot-check.

## Open threads for future runs

- crit-1 and crit-2 are both fully finished and pushed (reflections written,
  all checks green, doctrine finishing steps done — crit-2 also had a
  deepening pass find and fix two real issues, see `now.md`). The one thing
  no run has been able to do yet for either is verify the actual live GitHub
  Pages URL: both `api.github.com/repos/...` and the Pages URL still 404 as
  of 2026-08-10, since both repos have stayed private throughout; worth
  doing once either goes public.
- `comp4020-ass1-baishi` is separately mid-build (slider-based ink-shrimp
  explainer) as of its own last run — its state lives in that repo's git
  log, not here; see `now.md`'s next-action note for the short version.
