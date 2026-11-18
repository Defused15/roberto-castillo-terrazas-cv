import {render, screen, within} from '@testing-library/react';
import {ResumeView} from '@/components/resume-content';
import {QualityBadge} from '@/components/quality-badge';
import {LANGS, RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {
  CV_REPO,
  QA_PLAYGROUND_REPO,
  TEST_HUB_URL,
  type TestHubStats,
} from '@/lib/test-hub';
import {AS_OF} from '@/test/dates';

const STATS: TestHubStats = {total: 435, passed: 435, ranOn: '2026-11-18'};
const PLAYWRIGHT_STATS: TestHubStats = {
  total: 972,
  passed: 971,
  ranOn: '2026-11-18',
};

describe('QualityBadge', () => {
  it.each([
    ['en', /435 tests passing/, /18 Nov$/],
    ['es', /435 tests en verde/, /18 nov$/],
  ] as const)(
    'links the live result to the Test Hub [%s]',
    (lang, count, date) => {
      render(<QualityBadge stats={STATS} lang={lang} />);
      const link = screen.getByRole('link', {name: count});
      expect(link).toHaveAttribute('href', TEST_HUB_URL);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveTextContent(date);
      expect(link).toHaveClass('print:hidden');
    },
  );
});

describe.each(LANGS)('ResumeView › quality badge [%s]', lang => {
  const d = RESUME_DATA_BY_LANG[lang];
  const projects = () =>
    screen.getByRole('region', {name: d.ui.sections.projects});

  const cardOf = (badge: HTMLElement) => badge.closest('.rounded-lg');
  const titleOf = (repo: string) =>
    d.projects.find(p => p.githubLink === repo)!.title;

  it("shows the badge only on this CV's own project card", () => {
    render(
      <ResumeView
        data={d}
        lang={lang}
        asOf={AS_OF}
        quality={{[CV_REPO]: STATS}}
      />,
    );
    const badges = within(projects()).getAllByRole('link', {name: /tests/});
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent(/435 tests/);
    expect(cardOf(badges[0])).toHaveTextContent(titleOf(CV_REPO));
  });

  it('shows each green suite on its own project card', () => {
    render(
      <ResumeView
        data={d}
        lang={lang}
        asOf={AS_OF}
        quality={{[CV_REPO]: STATS, [QA_PLAYGROUND_REPO]: PLAYWRIGHT_STATS}}
      />,
    );
    expect(
      within(projects()).getAllByRole('link', {name: /tests/}),
    ).toHaveLength(2);
    const playground = within(projects()).getByRole('link', {
      name: /971 tests/,
    });
    expect(cardOf(playground)).toHaveTextContent(titleOf(QA_PLAYGROUND_REPO));
    expect(cardOf(playground)).not.toHaveTextContent(/435 tests/);
  });

  it.each([
    ['no results', {}],
    ['no quality prop', undefined],
  ])('renders no badge with %s', (_, quality) => {
    render(<ResumeView data={d} lang={lang} asOf={AS_OF} quality={quality} />);
    expect(
      within(projects()).queryByRole('link', {name: /tests/}),
    ).not.toBeInTheDocument();
  });
});
