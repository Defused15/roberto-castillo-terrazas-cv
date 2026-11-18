import {fireEvent, render, screen} from '@testing-library/react';
import {ProfileAvatar} from '@/components/profile-avatar';

describe('ProfileAvatar', () => {
  it("renders the image with the person's name as alt text", () => {
    render(
      <ProfileAvatar src="/avatar.jpg" alt="Roberto Castillo" fallback="RC" />,
    );
    const img = screen.getByRole('img', {name: 'Roberto Castillo'});
    // next/image rewrites src through its optimizer; the original path must survive
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain(
      '/avatar.jpg',
    );
    expect(screen.queryByText('RC')).not.toBeInTheDocument();
  });

  it('falls back to the initials when the image fails to load', () => {
    render(
      <ProfileAvatar src="/avatar.jpg" alt="Roberto Castillo" fallback="RC" />,
    );
    fireEvent.error(screen.getByRole('img', {name: 'Roberto Castillo'}));
    expect(screen.getByText('RC')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
