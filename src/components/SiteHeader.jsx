import React from 'react';

export default function SiteHeader({ pageUrl, siteName, navLinks, overlay = false }) {
  return (
    <header className={`o-site-header ${overlay ? 'o-site-header--overlay theme-inverted-overlay-only' : 'theme-inverted'}`}>
      <div className="o-site-header__inner">
        <a
          href="/"
          className="a-logo-link"
          rel="home prefetch-intent"
          aria-current={pageUrl === '/' ? 'page' : 'false'}
        >
          <span className="a-logo-link__first">Evan</span> Minto
        </a>

        <nav className="m-navbar">
          <ul>
            {navLinks.map((navPage) => <li>
              <a
                href={navPage.url}
                className="a-nav-link"
                rel="prefetch-intent"
                aria-current={pageUrl.indexOf(navPage.url) > -1 || (navPage.name === 'Work' && pageUrl.indexOf('case-studies') !== -1) ? 'page' : 'false'}
              >
                {navPage.name}
              </a>
            </li>)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
