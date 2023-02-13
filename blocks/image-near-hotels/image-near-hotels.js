function createImageTeaser(block) {
  const rows = block.querySelectorAll('.image-near-hotels > div');
  rows[1].style.display = 'none';
  rows[1].className = '';

  const linkInImage = rows[1].getElementsByTagName('div');
  const divForLink = document.createElement('div');
  divForLink.className = 'text-in-image';
  divForLink.innerHTML = linkInImage[0].firstChild.outerHTML;

  const arrowRight = document.createElement('span');
  arrowRight.className = 'ch-icon-arrow-right';
  arrowRight.innerHTML = '&nbsp;';

  const textWithArrow = divForLink.innerHTML.trim();
  const linkWithArrow = textWithArrow.slice(0, (textWithArrow.length) - 4)
  + arrowRight.outerHTML + textWithArrow.slice((textWithArrow.length) - 4);
  divForLink.innerHTML = linkWithArrow;
  const picture = block.querySelectorAll('.image-near-hotels > div > div');
  picture[0].appendChild(divForLink);

  const mapMarker = document.createElement('span');
  mapMarker.className = 'ch-icon-map-marker fs-20';
  mapMarker.innerHTML = '&nbsp;';

  const textAside = rows[2].innerHTML.trim();
  const divWithSpan = textAside.slice(0, 5) + mapMarker.outerHTML + textAside.slice(5);
  rows[2].innerHTML = divWithSpan;
}

export default async function decorate(block) {
  createImageTeaser(block);
}
