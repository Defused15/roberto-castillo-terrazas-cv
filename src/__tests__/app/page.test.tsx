import Page from '@/app/page';
import {buildPersonJsonLd, serializeJsonLd} from '@/app/structured-data';
import {RESUME_DATA} from '@/data/resume-data';
import {renderWithProviders} from '@/test/render';

describe('home page', () => {
  it("embeds the person's JSON-LD, serialized safely for an inline script", async () => {
    const {container} = renderWithProviders(await Page());
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);
    expect(scripts[0].textContent).toBe(
      serializeJsonLd(buildPersonJsonLd(RESUME_DATA)),
    );
  });
});
