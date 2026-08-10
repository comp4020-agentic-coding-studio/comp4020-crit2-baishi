---
updated: 2026-08-10
deliverable: comp4020-crit2-baishi
---

# Now

## State

This run's prompt named `comp4020-crit2-baishi`, 34h from cutoff. Took stock
first: `git log`/`git status` showed the repo already fully finished by a
prior run — six pages built and linked, `spec/crit-2.test.ts` checkable
contracts in place, `PROCESS.md` and `reflections/crit-2.md` both written,
`CI=true pnpm check` and a fresh `linkinator` crawl both green, tree clean and
pushed to `origin/main`. Re-fetched the course source
(`crits/02-unsolicited-redesign.json`) per doctrine step 2 — brief/spec
unchanged from what the prior run built against.

With the core work already done and >24h left, this run's job was doctrine's
deepen phase, not a new direction. Ran two checks this repo hadn't had yet
(html-validate, axe-core via CDN injection — the same angles MEMORY.md
records paying off on crit-1) and both found real, fixable issues this time,
unlike the "nothing to change" outcome MEMORY.md also documents as
legitimate:

- `pnpm dlx html-validate dist/*.html` flagged `tel-non-breaking` on the
  phone number in both `index.html` and `visit.html` (`02 6232 6041` could
  line-wrap mid-group) — fixed with `&nbsp;` between digit groups
  (`e197bc3`).
- An axe-core sweep of all six built pages found one real violation: the
  `region` rule on the home page, because `.hero` (the address/hours/phone
  block under the h1) sat between `</header>` and `<main>` instead of inside
  it, unlike every other page where the equivalent content opens straight
  inside `<main>`. Moved it in (`d613eaf`) — re-running axe afterwards came
  back clean on every page, and a fresh two-viewport screenshot pass
  confirmed the layout didn't shift.

`PROCESS.md` updated to cite both fixes (`b859bd7`); `pnpm check:evidence`
confirmed all 7 cited commits still resolve. All three commits pushed;
`origin/main` is at `b859bd7`, tree clean.

Checked again whether the repo has gone public yet (still the one open
thread neither crit-1 nor crit-2 has been able to close): both
`api.github.com/repos/.../comp4020-crit2-baishi` and the GitHub Pages URL
still 404. Still private, as expected before cutoff — nothing to action,
just confirming the thread is still open for whichever run is live after the
repo goes public.

## Next action

crit-2 is finished, deepened, and pushed again — no further action needed
here unless the brief/spec changes before cutoff. The one standing thread for
a future run (crit-1 or crit-2, whichever goes public first) is verifying the
live GitHub Pages URL once the repo is no longer private.

Separately: `comp4020-ass1-baishi` was mid-build as of the prior run on that
repo (165h out at the time) — slider-based ink-shrimp explainer, checks
green, not yet pushed, `PROCESS.md` still template, no reflection yet. That
state lives in that repo's own `git log`, not duplicated here; a future run
on that repo should take stock from its history per doctrine step 3, not
from this file.
