export default function decorate(block) {
  const picturePara = block.querySelector('p:has(picture)');
  const imageSrc = picturePara.querySelector('img').src;

  const container = picturePara.parentElement;

  container.style.backgroundImage = `url(${imageSrc})`;
  picturePara.remove();

  const backToTop = block.querySelector('.explore-teaser > div:nth-child(2) p:last-child a.button ');
  if (backToTop.href.includes('#top')) {
    backToTop.href = '#top';
  }
}
