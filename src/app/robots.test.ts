
import robots from './robots';

describe('robots', () => {
  it('should return the correct robots object', () => {
    const result = robots();

    expect(result).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/dashboard', '/editor', '/profile', '/admin', '/test-connection'],
        },
      ],
      sitemap: 'https://studio-9489287013-59986.web.app/sitemap.xml',
    });
  });
});
