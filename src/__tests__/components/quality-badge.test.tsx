import {render, screen, within} from '@testing-library/react';
import {ResumeView} from '@/components/resume-content';
import {QualityBadge} from '@/components/quality-badge';
import {LANGS, RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {TEST_HUB_URL, type TestHubStats} from '@/lib/test-hub';
import {AS_OF} from '@/test/dates';

const STATS: TestHubStats = {total: 435, passed: 435, ranOn: '2026-11-18'};
const CV_REPO = 'https://github.com/Defused15/roberto-castillo-terrazas-cv';

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

  it("shows the badge only on this CV's own project card", () => {
    render(<ResumeView data={d} lang={lang} asOf={AS_OF} quality={STATS} />);
    const badges = within(projects()).getAllByRole('link', {name: /435 tests/});
    expect(badges).toHaveLength(1);
    const cv = d.projects.find(p => p.githubLink === CV_REPO)!;
    expect(badges[0].closest('.rounded-lg')).toHaveTextContent(cv.title);
  });

  it('renders no badge without a green report', () => {
    render(<ResumeView data={d} lang={lang} asOf={AS_OF} quality={null} />);
    expect(
      within(projects()).queryByRole('link', {name: /tests/}),
    ).not.toBeInTheDocument();
  });
});
