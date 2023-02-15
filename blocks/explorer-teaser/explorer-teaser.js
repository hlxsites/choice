export default function decorate(block) {
  const backToTop = block.querySelector(
    '.explorer-teaser > div > div:nth-child(2) p:last-child a.button '
  );
  if (backToTop.href.includes('#top')) {
    backToTop.href = '#top';
  }
}
