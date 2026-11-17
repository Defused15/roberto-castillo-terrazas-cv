import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResumeContent, ResumeView } from "@/components/resume-content";
import { LANGS, RESUME_DATA_BY_LANG, type ResumeData } from "@/data/resume-data";
import { formatPhone, phoneCountry } from "@/lib/format-phone";
import { capturedEvents, preventNavigation, startAnalytics } from "@/test/analytics";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";

/**
 * Behavior tests for the CV page. Expectations are derived from the data, so
 * they never need updating when content changes, but removing a section, a
 * list or a field from the page fails a test.
 */

const EN = RESUME_DATA_BY_LANG.en;

/** Asserts each text is shown in `scope` exactly as many times as it occurs in `texts`. */
function expectRendered(scope: HTMLElement, texts: readonly string[]) {
  const expected = new Map<string, number>();
  texts.forEach((t) => expected.set(t, (expected.get(t) ?? 0) + 1));
  const actual = [...expected.keys()].map((t) => [t, within(scope).queryAllByText(t).length]);
  expect(Object.fromEntries(actual)).toEqual(Object.fromEntries(expected));
}

const hrefs = (els: HTMLElement[]) => els.map((el) => el.getAttribute("href"));
const region = (name: string) => screen.getByRole("region", { name });
/** Names of the region landmarks in document order (each is named by its h2). */
const regionNames = () =>
  screen
    .getAllByRole("region")
    .map((r) => document.getElementById(r.getAttribute("aria-labelledby") ?? "")?.textContent);
const dates = (x: { start: string; end: string | null }, present: string) =>
  `${x.start} - ${x.end ?? present}`;

describe.each(LANGS)("ResumeContent [%s]", (lang) => {
  const d = RESUME_DATA_BY_LANG[lang];

  beforeEach(() => {
    renderWithProviders(<ResumeContent />, { lang });
  });

  it("renders every section as a named region, in CV order", () => {
    expect(regionNames()).toEqual(Object.values(d.ui.sections));
  });

  it("introduces the person: name, headline, photo and summary", () => {
    expect(screen.getByRole("heading", { level: 1, name: d.name })).toBeInTheDocument();
    expect(screen.getByText(d.about)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: d.name })).toBeInTheDocument();
    expect(within(region(d.ui.sections.about)).getByText(d.summary)).toBeInTheDocument();
  });

  it("links every location to its map, primary location first", () => {
    const links = d.locations.map((l) => screen.getByRole("link", { name: l.name }));
    expect(hrefs(links)).toEqual(d.locations.map((l) => l.link));
    links.forEach((a) => expect(a).toHaveAttribute("rel", "noopener noreferrer"));
    // Locations share one line, separated by a middle dot.
    expect(links[0].closest("p")?.textContent).toBe(d.locations.map((l) => l.name).join("·"));
  });

  it("shows the email and every phone number in readable form", () => {
    expect(screen.getByText(d.contact.email, { selector: "p" })).toBeInTheDocument();
    const phoneLinks = d.contact.phones.map(
      (p) => screen.getAllByRole("link", { name: formatPhone(p) })[0],
    );
    expect(hrefs(phoneLinks)).toEqual(d.contact.phones.map((p) => `tel:${p}`));
    expect(phoneLinks[0].closest("p")?.textContent).toBe(d.contact.phones.map(formatPhone).join("·"));
  });

  it("offers labelled quick-contact links for email, phone and social profiles", () => {
    const [firstPhone] = d.contact.phones;
    expect(screen.getByRole("link", { name: d.ui.contact.email })).toHaveAttribute(
      "href",
      `mailto:${d.contact.email}`,
    );
    expect(
      screen.getByRole("link", { name: `${d.ui.contact.call} ${formatPhone(firstPhone)}` }),
    ).toHaveAttribute("href", `tel:${firstPhone}`);
    d.contact.social.forEach((s) => {
      const link = screen.getByRole("link", { name: d.ui.contact.profiles[s.name] });
      expect(link).toHaveAttribute("href", s.url);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders every job with its link, logo, title, dates, badges and bullets", () => {
    const work = region(d.ui.sections.work);
    d.work.forEach((w) => {
      expect(within(work).getByRole("link", { name: w.company })).toHaveAttribute("href", w.link);
      expect(within(work).getByRole("img", { name: `${w.company} logo` })).toBeInTheDocument();
    });
    expectRendered(work, [
      ...d.work.map((w) => w.title),
      ...d.work.map((w) => dates(w, d.ui.present)),
      ...d.work.flatMap((w) => w.badges),
      ...d.work.flatMap((w) => w.description),
    ]);
    expect(within(work).getAllByRole("listitem")).toHaveLength(
      d.work.reduce((n, w) => n + w.description.length, 0),
    );
  });

  it("renders every degree with its school and dates", () => {
    expectRendered(region(d.ui.sections.education), [
      ...d.education.map((e) => e.school),
      ...d.education.map((e) => e.degree),
      ...d.education.map((e) => dates(e, d.ui.present)),
    ]);
  });

  it("renders every skill under its category", () => {
    const skills = region(d.ui.sections.skills);
    expectRendered(skills, [
      ...d.skills.map((s) => s.category),
      ...d.skills.flatMap((s) => s.items),
    ]);
  });

  it("links every certification to its credential, with issuer and year", () => {
    const certs = region(d.ui.sections.certifications);
    d.certifications.forEach((c) => {
      expect(hrefs(within(certs).getAllByRole("link", { name: c.title }))).toContain(c.url);
    });
    expectRendered(certs, [
      ...d.certifications.map((c) => c.title),
      ...d.certifications.map((c) => c.issuer),
      ...d.certifications.map((c) => c.year),
    ]);
  });

  it("renders every language with its proficiency", () => {
    expectRendered(region(d.ui.sections.languages), [
      ...d.languages.map((l) => l.language),
      ...d.languages.map((l) => l.proficiency),
    ]);
  });

  it("renders every project with its website, repository, description and stack", () => {
    const projects = region(d.ui.sections.projects);
    d.projects.forEach((p) => {
      if (p.link) {
        expect(within(projects).getByRole("link", { name: p.title })).toHaveAttribute("href", p.link.href);
      }
    });
    expect(hrefs(within(projects).getAllByRole("link", { name: d.ui.githubRepo }))).toEqual(
      d.projects.flatMap((p) => (p.githubLink ? [p.githubLink] : [])),
    );
    expectRendered(projects, [
      ...d.projects.map((p) => p.description),
      ...d.projects.flatMap((p) => p.techStack),
      ...d.projects.flatMap((p) => (p.link ? [p.link.label] : [])),
    ]);
  });
});

describe.each(LANGS)("ResumeContent › analytics events [%s]", (lang) => {
  const d = RESUME_DATA_BY_LANG[lang];
  let allowNavigation: () => void;

  beforeEach(async () => {
    await startAnalytics();
    allowNavigation = preventNavigation();
  });
  afterEach(() => allowNavigation());

  /** Renders the page, clicks `link` and returns the events it sent. */
  async function click(find: () => HTMLElement) {
    const { user } = renderWithProviders(<ResumeContent />, { lang });
    await user.click(find());
    return capturedEvents();
  }

  it("sends contact_email from the email button", async () => {
    expect(await click(() => screen.getByRole("link", { name: d.ui.contact.email }))).toEqual([
      ["contact_email", undefined],
    ]);
  });

  it("sends contact_phone with the country only from the call button", async () => {
    const [first] = d.contact.phones;
    const events = await click(() =>
      screen.getByRole("link", { name: `${d.ui.contact.call} ${formatPhone(first)}` }),
    );
    expect(events).toEqual([["contact_phone", { number_country: phoneCountry(first) }]]);
    expect(JSON.stringify(events)).not.toContain(first.slice(3));
  });

  it.each(RESUME_DATA_BY_LANG[lang].contact.phones)(
    "sends contact_phone with the country only from the phone line (%s)",
    async (phone) => {
      const events = await click(() => screen.getAllByRole("link", { name: formatPhone(phone) })[0]);
      expect(events).toEqual([["contact_phone", { number_country: phoneCountry(phone) }]]);
    },
  );

  it.each([
    ["GitHub", "social_github"],
    ["LinkedIn", "social_linkedin"],
  ] as const)("sends %s profile clicks as %s", async (network, event) => {
    expect(
      await click(() => screen.getByRole("link", { name: d.ui.contact.profiles[network] })),
    ).toEqual([[event, undefined]]);
  });

  it("sends cert_link with the certification and issuer", async () => {
    const [cert] = d.certifications;
    const events = await click(() =>
      within(region(d.ui.sections.certifications)).getByRole("link", { name: cert.title }),
    );
    expect(events).toEqual([["cert_link", { cert: cert.title, issuer: cert.issuer }]]);
  });

  it("sends project_link and project_repo with the project title", async () => {
    const withSite = d.projects.find((p) => p.link)!;
    const withRepo = d.projects.find((p) => p.githubLink)!;
    const { user } = renderWithProviders(<ResumeContent />, { lang });
    const projects = region(d.ui.sections.projects);

    await user.click(within(projects).getByRole("link", { name: withSite.title }));
    const repoLinks = within(projects).getAllByRole("link", { name: d.ui.githubRepo });
    await user.click(repoLinks[d.projects.filter((p) => p.githubLink).indexOf(withRepo)]);

    expect(capturedEvents()).toEqual([
      ["project_link", { project: withSite.title }],
      ["project_repo", { project: withRepo.title }],
    ]);
  });

  it("sends language_switch with the target language", async () => {
    const events = await click(() => screen.getByRole("button", { name: languageToggleName(lang) }));
    expect(events).toEqual([["language_switch", { to: lang === "en" ? "es" : "en" }]]);
  });

  it("sends nothing for links without an event, such as locations", async () => {
    expect(await click(() => screen.getByRole("link", { name: d.locations[0].name }))).toEqual([]);
  });
});

describe.each(LANGS)("ResumeContent › footer [%s]", (lang) => {
  it("ends the page with a footer linking to the privacy notice", () => {
    const d = RESUME_DATA_BY_LANG[lang];
    renderWithProviders(<ResumeContent />, { lang });
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: d.ui.privacy.link })).toHaveAttribute(
      "href",
      "/privacy",
    );
    // A sibling of <main>, so it is the page's contentinfo landmark.
    expect(screen.getByRole("main").nextElementSibling).toBe(footer);
  });
});

describe("ResumeContent › language switch", () => {
  it("switches the whole page to Spanish and back", async () => {
    const ES = RESUME_DATA_BY_LANG.es;
    const { user } = renderWithProviders(<ResumeContent />);

    await user.click(screen.getByRole("button", { name: languageToggleName("en") }));

    expect(regionNames()).toEqual(Object.values(ES.ui.sections));
    expect(screen.getByText(ES.summary)).toBeInTheDocument();
    expect(screen.queryByText(EN.summary)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: ES.ui.contact.profiles.GitHub })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "es");
    expect(localStorage.getItem("cv-lang")).toBe("es");

    await user.click(screen.getByRole("button", { name: languageToggleName("es") }));

    expect(regionNames()).toEqual(Object.values(EN.ui.sections));
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });
});

// Print contract. jsdom has no print media, so the Tailwind print variants are
// the only observable contract in a unit test: `print:hidden` hides interactive
// controls on paper and `hidden print:flex` shows contact details as text. The
// real rendering is verified by printing the page in a browser.
describe("ResumeContent › print", () => {
  const screenOnly = (el: HTMLElement) => el.closest(".print\\:hidden") !== null;
  const printOnly = (el: HTMLElement) => el.closest(".hidden.print\\:flex") !== null;

  beforeEach(() => {
    renderWithProviders(<ResumeContent />);
  });

  it("hides every interactive control on paper", () => {
    const controls = [
      screen.getByRole("button", { name: EN.ui.theme.toggle }),
      screen.getByRole("button", { name: languageToggleName("en") }),
      screen.getByRole("link", { name: EN.ui.contact.email }),
      screen.getByRole("link", { name: `${EN.ui.contact.call} ${formatPhone(EN.contact.phones[0])}` }),
      ...EN.contact.social.map((s) => screen.getByRole("link", { name: EN.ui.contact.profiles[s.name] })),
    ];
    expect(controls.filter((el) => !screenOnly(el))).toEqual([]);
  });

  it("prints the email address as text", () => {
    const link = screen.getByRole("link", { name: EN.contact.email });
    expect(link).toHaveAttribute("href", `mailto:${EN.contact.email}`);
    expect(printOnly(link)).toBe(true);
  });

  it.each(EN.contact.phones)("shows %s once on screen and once on paper", (phone) => {
    const links = screen.getAllByRole("link", { name: formatPhone(phone) });
    expect(hrefs(links)).toEqual([`tel:${phone}`, `tel:${phone}`]);
    expect(links.map((a) => [screenOnly(a), printOnly(a)])).toEqual([
      [true, false],
      [false, true],
    ]);
  });
});

describe("ResumeView › optional content", () => {
  const build = (overrides: Partial<ResumeData>): ResumeData => ({ ...EN, ...overrides });

  it("omits every email and phone link when the contact has none", () => {
    const { container } = render(
      <ResumeView data={build({ contact: { ...EN.contact, email: "", phones: [] } })} />,
    );
    // An empty contact line would still take up vertical space in the header.
    expect(container.querySelector("p:empty")).toBeNull();
    const contactHrefs = hrefs(screen.getAllByRole("link")).filter((h) => /^(mailto|tel):/.test(h ?? ""));
    expect(contactHrefs).toEqual([]);
    // Social profiles do not depend on email or phone.
    expect(screen.getByRole("link", { name: EN.ui.contact.profiles.GitHub })).toBeInTheDocument();
  });

  it("shows a single phone without a separator", () => {
    const [phone] = EN.contact.phones;
    render(<ResumeView data={build({ contact: { ...EN.contact, phones: [phone] } })} />);
    const [onScreen] = screen.getAllByRole("link", { name: formatPhone(phone) });
    expect(onScreen.closest("p")?.textContent).toBe(formatPhone(phone));
  });

  it("sends no phone event for a country the event cannot report", async () => {
    await startAnalytics();
    const allowNavigation = preventNavigation();
    const phone = "+15551234567";
    const user = userEvent.setup();
    render(<ResumeView data={build({ contact: { ...EN.contact, phones: [phone] } })} />);
    await user.click(screen.getAllByRole("link", { name: formatPhone(phone) })[0]);
    allowNavigation();
    expect(capturedEvents()).toEqual([]);
  });

  it("renders a project without a website as a plain title", () => {
    const project = { ...EN.projects[0], link: undefined };
    render(<ResumeView data={build({ projects: [project] })} />);
    const projects = region(EN.ui.sections.projects);
    expect(within(projects).getByText(project.title)).toBeInTheDocument();
    expect(within(projects).queryByRole("link", { name: project.title })).not.toBeInTheDocument();
  });
});
