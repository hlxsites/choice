import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 992px)');
const LANG_REGEX = /\/[a-z]{2}-[a-z]{2}\//;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || MQ.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || MQ.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (MQ.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || MQ.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = config.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = { 'top-bar': ['language', 'top'], 'main-bar': ['brand', 'sections', 'login'] };
    Object.entries(classes).forEach((c) => {
      const navHead = document.createElement('div');
      navHead.classList.add(`nav-${c[0]}`);
      c[1].forEach((e) => {
        const section = nav.children[0];
        if (section) section.classList.add(`nav-${e}`);
        section.remove();
        navHead.appendChild(section);
      });
      nav.appendChild(navHead);
    });

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (MQ.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }

    // language-selector
    const pathName = window.location.pathname;
    const currentLang = LANG_REGEX.exec(pathName)[0];
    const navLanguage = nav.querySelector('.nav-language');
    const languages = navLanguage.querySelectorAll('a');

    languages.forEach((l) => {
      const lang = LANG_REGEX.exec(l.href)[0];
      if (currentLang === lang) {
        const langSwitcher = document.createElement('div');
        langSwitcher.classList.add('nav-language-switcher');

        const langLabel = document.createElement('div');
        langLabel.innerHTML = l.innerHTML;

        const langPic = l.parentElement.parentElement.parentElement.querySelector('picture');
        const switcherIcon = document.createElement('span');
        switcherIcon.classList.add('nav-language-switcher-icon');

        if (langPic) langSwitcher.appendChild(langPic);
        langSwitcher.appendChild(langLabel);
        langSwitcher.appendChild(switcherIcon);
        navLanguage.appendChild(langSwitcher);
      }
    });

    // nav-brand link
    const navBrand = nav.querySelector('.nav-brand');
    const picture = navBrand.querySelector('p picture');
    const parent = picture.parentNode;
    const link = parent.nextElementSibling.querySelector('a');

    if (link && link.textContent.includes(link.getAttribute('href'))) {
      link.parentElement.remove();
      link.innerHTML = picture.outerHTML;
      parent.replaceWith(link);
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, MQ.matches);
    MQ.addEventListener('change', () => toggleMenu(nav, navSections, MQ.matches));

    const mobileNav = nav.querySelector('.mobile-nav').parentElement;
    mobileNav.classList.add('mobile-nav-overlay');
    const closeButton = nav.querySelector('.nav-hamburger button').cloneNode(true);
    closeButton.addEventListener('click', () => toggleMenu(nav, navSections));
    const mobileNavTop = mobileNav.querySelector('.mobile-nav > div:first-child > div');
    mobileNavTop.classList.add('mobile-nav-top', 'nav-hamburger');
    mobileNavTop.appendChild(closeButton);

    const langContents = nav.querySelectorAll('.mobile-nav > div:last-child li > a');
    const langSelector = document.createElement('select');
    langContents.forEach((l) => {
      const option = document.createElement('option');
      option.label = l.innerHTML;
      option.innerHTML = l.innerHTML;
      option.value = LANG_REGEX.exec(l.href);
      langSelector.appendChild(option);
    });

    const langContainer = nav.querySelector('.mobile-nav > div:last-child > div');
    langContainer.querySelector('ul').remove();
    const arrow = document.createElement('span');
    arrow.classList.add('mobile-nav-selector-arrow');
    langContainer.appendChild(arrow);
    langContainer.appendChild(langSelector);

    decorateIcons(nav);
    block.append(nav);
  }
}
