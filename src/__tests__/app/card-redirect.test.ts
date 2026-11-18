import nextConfig from '../../../next.config';

describe('business card redirect', () => {
  it('sends /c to the CV with card UTM tags, as a temporary redirect', async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: '/c',
      destination: '/?utm_source=business-card&utm_medium=qr',
      permanent: false,
    });
  });
});
