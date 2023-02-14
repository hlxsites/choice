export default function decorate(block) {
  const picturePara = block.querySelector('p:has(picture)');
  const imageSrc = picturePara.querySelector('img').src;

  const container = picturePara.parentElement;

  container.style.backgroundImage = `url(${imageSrc})`;
  picturePara.remove();
}
