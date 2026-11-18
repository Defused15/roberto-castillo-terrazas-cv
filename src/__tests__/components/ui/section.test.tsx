import {render, screen, within} from '@testing-library/react';
import {Section} from '@/components/ui/section';

describe('Section', () => {
  it('is a region landmark named by its own heading', () => {
    render(
      <Section title="Work Experience">
        <p>Inetum</p>
      </Section>,
    );
    const region = screen.getByRole('region', {name: 'Work Experience'});
    expect(
      within(region).getByRole('heading', {level: 2, name: 'Work Experience'}),
    ).toBeInTheDocument();
    expect(within(region).getByText('Inetum')).toBeInTheDocument();
  });

  it('keeps landmark names unique when several sections are rendered', () => {
    render(
      <>
        <Section title="About" />
        <Section title="Skills" />
      </>,
    );
    expect(screen.getAllByRole('region')).toHaveLength(2);
    expect(screen.getByRole('region', {name: 'About'})).not.toHaveTextContent(
      'Skills',
    );
    expect(screen.getByRole('region', {name: 'Skills'})).not.toHaveTextContent(
      'About',
    );
  });

  it('forwards HTML attributes, including the print page-break class', () => {
    render(
      <Section
        title="Projects"
        id="projects"
        data-print="new-page"
        className="print-force-new-page"
      />,
    );
    const region = screen.getByRole('region', {name: 'Projects'});
    expect(region).toHaveAttribute('id', 'projects');
    expect(region).toHaveAttribute('data-print', 'new-page');
    expect(region).toHaveClass('print-force-new-page');
  });
});
