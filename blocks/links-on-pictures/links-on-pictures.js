/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  Array.from(block.firstElementChild.children)
    .forEach((div) => {
      div.className = 'link-on-picture';
    });

  block.querySelectorAll('.button')
    .forEach((button) => {
      button.className = 'text-link-on-picture';
    });
}
