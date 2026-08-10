import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Turns crit 2's published spec into checks a machine can run. Lines a
// person has to judge at the crit (is the redesign actually better? is the
// content genuinely rewritten, not pasted?) are left to the crit, not here.
const DIST = resolve("dist");
const REAL_SITE = "megalo.org";

function htmlFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

const pages = htmlFiles().map((path) => ({
  name: relative(DIST, path),
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

function links(doc: Document): string[] {
  return Array.from(doc.querySelectorAll("a[href]")).map((a) =>
    a.getAttribute("href"),
  ) as string[];
}

describe("crit 2: links to the real organisation", () => {
  it("built more than one page", () => {
    expect(pages.length).toBeGreaterThan(1);
  });

  for (const { name, doc } of pages) {
    it(`${name} links to the real site (${REAL_SITE})`, () => {
      expect(links(doc).some((href) => href.includes(REAL_SITE))).toBe(true);
    });
  }
});

describe("crit 2: no backend, no JavaScript needed", () => {
  for (const { name, doc } of pages) {
    it(`${name} ships no <script>`, () => {
      expect(doc.querySelectorAll("script").length).toBe(0);
    });
  }
});

describe("crit 2: real, findable information", () => {
  const visit = pages.find(({ name }) => name === "visit.html");

  it("has a visit page", () => {
    expect(visit).toBeTruthy();
  });

  it("visit page states the real street address", () => {
    expect(visit!.doc.body.textContent).toContain(
      "21 Wentworth Avenue, Kingston ACT 2604",
    );
  });

  it("visit page states real opening hours", () => {
    expect(visit!.doc.body.textContent).toMatch(/9:30am.{0,3}5:00pm/);
  });

  it("home page surfaces where and when without a click through", () => {
    const home = pages.find(({ name }) => name === "index.html")!;
    expect(home.doc.body.textContent).toContain("Kingston");
    expect(home.doc.body.textContent).toMatch(/9:30am.{0,3}5:00pm/);
  });
});

describe("crit 2: every page reachable from every other", () => {
  // The shared nav on every page links to all six pages (home as "./"),
  // so every page's link set should be a superset of this canonical list.
  const NAV_TARGETS = [
    "./",
    "./about.html",
    "./learn.html",
    "./studio.html",
    "./exhibitions.html",
    "./visit.html",
  ];

  for (const { name, doc } of pages) {
    it(`${name} carries the full navigation`, () => {
      const hrefs = new Set(links(doc));
      for (const target of NAV_TARGETS) {
        expect(hrefs.has(target), `${name} is missing a link to ${target}`).toBe(
          true,
        );
      }
    });
  }
});
