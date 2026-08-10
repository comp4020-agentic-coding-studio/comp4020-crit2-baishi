---
updated: 2026-08-10
deliverable: comp4020-crit2-baishi
---

# Now

## State

crit-2 ("unsolicited redesign") is **fully finished and shipped**, done in one
run at 40h out from cutoff — well outside the 24h finishing window, but the
build was small enough (six static HTML pages, no framework) to finish and
run the full finishing checklist in the same sitting rather than spread it
across the week.

Picked **Megalo Print Studio + Gallery** (Kingston, Canberra;
https://www.megalo.org/) — a real, articulable reason to like it: printmaking
and carving are the same family of craft as the Baishi persona's namesake.
Found two concrete, fixable flaws on the live site by opening it with
`agent-browser` rather than guessing: the homepage names neither address nor
hours despite being a physical venue, and the workshop listing is six bare
titles with no dates/prices. Built six pages (home, about, learn,
studio & membership, exhibitions, visit) restructuring Megalo's real content
(history, membership tiers, workshop program, exhibition programme, contact
details) around those two fixes — home page hero now carries a `<dl>` with
address/hours/phone above the fold; `learn.html` groups real workshops by
print technique instead of a flat grid.

Full finishing checklist run and green:
- Wrote `spec/crit-2.test.ts` (replacing the deleted starter test) asserting
  crit-2's actual checkable contract: every page links to `megalo.org`, no
  page ships `<script>`, the visit and home pages state the real address/hours
  as text (not just behind a link), every page carries the full 6-item nav.
- `CI=true pnpm check`: 68 tests, clean build, zero typecheck/lint output.
  Hit and fixed three real `stylelint no-descending-specificity` findings
  before committing (`.hero .lede`→`.hero-lede`, `.tier ul/li`→
  `.tier-benefits`, `.footer-social a`→flex+gap on the container).
- `pnpm dlx linkinator ./dist --silent` (run right after a fresh `pnpm build`,
  same known quirk as crit-1 about not chaining it with `&&`): 10 links, zero
  broken.
- `agent-browser` pass at both required viewports (1920×1080, 390×844) across
  all 6 pages, screenshots reviewed, console confirmed empty on a fresh
  session (ruled out stale buffered `[warning] yui: ...` lines that were
  actually leftover from an earlier `megalo.org` tab, not this site).
- `PROCESS.md` rewritten with 5 real cited commits (the org/problem choice,
  the "don't invent what I can't verify" workshop-page decision, the spec
  test, the stylelint fixes) — verified with `CI=true pnpm check:evidence`
  (passes: reflection matches current deliverable, all 5 citations resolve).
- `reflections/crit-2.md` written (headed "Unsolicited redesign", the course
  source's title, not a week number): breakthrough was separating "I like
  this org" from "I have a brief" and going looking for a real, fixable flaw
  instead of just decorating; developer-identity thread was treating "better"
  as a falsifiable, tested claim (the crit-2 spec test) rather than a vibe,
  and preferring an honest gap (no invented workshop dates/prices) over fake
  completeness.
- Committed incrementally, one commit per page/concern (`68dcd68` styles+home,
  then `44c7bfd`/`539e366`/`ba0c657`/`d48cc9b`/`8a7a33b` one per remaining
  page, `e9afdb7` spec swap, `e6a0732` PROCESS.md+reflection). `git status`
  clean, pushed — `origin/main` now at `e6a0732`.
- Tried to verify the live URL (doctrine step 6) but both the repo API and the
  GitHub Pages URL return 404 unauthenticated — consistent with the repo
  still being private, same as every crit-1 run. Expected, not a problem.

## Next action

Crit-2 is done: all doctrine finishing steps complete, tree clean, pushed, 6+
days still before cutoff. Any future run before cutoff should re-verify
rather than open a new direction (re-fetch course source for drift, re-run
`pnpm check`/`check:evidence`, confirm still pushed and clean) — per doctrine
"then stop." A genuinely new check becomes available once the repo goes
public: verify the live GitHub Pages URL end to end, which no run (crit-1 or
crit-2) has been able to do yet since the repo has stayed private throughout.

## Lessons carried into MEMORY.md this run

See MEMORY.md's "Working patterns that held up" section for the full detail:
using `agent-browser eval` on a live org's own DOM to find its real subpage
URLs instead of guessing paths; verified real addresses fed into OSM's own
search endpoint as a legitimate non-guessed link pattern; the
`no-descending-specificity` fix pattern (unqualify the class rather than
reorder the file); and the reasoning for not converting to Astro this crit.
