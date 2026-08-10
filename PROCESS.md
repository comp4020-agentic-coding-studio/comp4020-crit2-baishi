# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it.

## What I built

An unsolicited redesign of [Megalo Print Studio + Gallery](https://www.megalo.org/),
a Canberra print studio and gallery in Kingston. Six pages (home, about, learn,
studio & membership, exhibitions, visit) carrying their real information ---
history, membership prices, workshop program, exhibition dates, address and
hours --- rewritten and restructured, not pasted. Hand-written HTML/CSS on the
starter's Vite multi-page setup: with a fixed set of six informational pages
and no interactivity, Astro's content collections and componentisation buy
nothing this brief needs, so I kept the stack that already proved itself on
crit-1 rather than spend build time on a framework swap.

## The moments that mattered

1. **Choosing what to critique, not just what to admire.** I like Megalo for a
   reason close to my own name --- carving and printmaking are the same family
   of craft --- but liking an organisation isn't a brief on its own. I opened
   their live site with `agent-browser` before deciding anything and found the
   actual problem: a physical venue whose homepage names neither its address
   nor its hours, and a workshop listing page that's six bare titles with no
   dates or prices. That became the spine of the redesign ---
   [`68dcd68`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/68dcd68)
   puts a "visit" strip with address, hours and phone directly in the home
   page's hero, above every other section.
2. **Not inventing what I couldn't verify.** Megalo's workshop pages don't
   list dates or prices even on their own site, and I have no way to know
   whether "before you come" advice like accessibility or parking exists.
   Rather than fabricate detail to make the redesign feel more complete, I
   grouped the real workshop titles by technique and linked out to Megalo's
   own booking page for anything that changes week to week
   ([`539e366`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/539e366)),
   and left "before you come" to only the facts I'd actually sourced
   ([`8a7a33b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/8a7a33b)).
   A redesign that's honest about its gaps is more useful than one that reads
   complete but is partly made up.
3. **Turning the spec into a test that would catch a regression, not just
   pass once.** `spec/invariants.test.ts` doesn't know this week's brief
   requires a link to the real organisation, so I wrote
   [`e9afdb7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/e9afdb7):
   every built page must link to `megalo.org`, the home and visit pages must
   surface the real address and hours as text (not just behind a link), and
   every page must carry the full six-item nav. That test would fail the
   moment a future edit dropped the "visit" strip from the homepage or
   forgot the link back to Megalo on a new page --- it checks the contract,
   not today's markup.
4. **Fixing lint findings before committing, not after.** `stylelint`'s
   `no-descending-specificity` flagged three selectors (`.hero .lede`,
   `.tier ul`, `.footer-social a`) whose specificity contradicted their
   source order. Rather than reorder the file to satisfy the linter, I gave
   each its own unqualified class (`.hero-lede`, `.tier-benefits`, a flex
   `.footer-social` with `gap` instead of per-child margin) so the rule can't
   fire again as the file grows --- landed inside
   [`68dcd68`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/68dcd68)
   and [`ba0c657`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/ba0c657),
   so `pnpm check` was green before either commit landed, not fixed up after.

## Verification

`CI=true pnpm check` (68 tests, clean build, zero lint) and
`pnpm dlx linkinator ./dist` (10 links, zero broken) both green as of
[`e9afdb7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/e9afdb7).
Every page opened locally with `agent-browser` at 1920x1080 and 390x844 with
an empty console, screenshots reviewed by hand for both viewports.

A later deepening pass ran two checks the roster above doesn't cover, since
this repo's own `CLAUDE.md` leaves accessibility and HTML validity as
self-directed work. `pnpm dlx html-validate dist/*.html` caught a phone
number that could line-wrap mid-digit-group on both the home and visit pages
--- fixed with `&nbsp;` in
[`e197bc3`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/e197bc3).
An axe-core sweep (CDN-injected via `agent-browser eval`, all six pages) then
flagged a real `region` violation on the home page: the `.hero` block ---
carrying the address, hours and phone in the h1's own section --- sat between
`</header>` and `<main>`, so it wasn't contained by any landmark, unlike
every other page where the equivalent content opens straight inside `<main>`.
Moved it inside in
[`d613eaf`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-baishi/commit/d613eaf);
re-running the sweep afterwards came back with zero violations on every
page, and a fresh screenshot pass at both viewports confirmed the layout is
unaffected.

## Before you ship

Real research behind every page: Megalo's own site was fetched directly
(`megalo.org` and its subpages) for history, address, hours, membership
prices and the current exhibition programme --- nothing here is guessed.
