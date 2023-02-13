
function createImageTeaser(block) {
  const newImageTeaser = document.createElement('div');
  /*
    newTableTechnoForMobile.classList.add('table-techno-mobile');
    block.parentElement.appendChild(newTableTechnoForMobile);
  */
    const titleTables = [];
    const imageTables = [];
    const descriptionTables = [];
  
    const rows = block.querySelectorAll('.image-near-hotels > div');
    rows[1].style.display='none';
    rows.forEach((element, i) => {
      console.log(element);
    });
  /*
    titleTables.forEach((theTitle, i) => {
      const textInDiv = titleTables[i].textContent;
      titleTables[i].textContent = '';
      const titleH1 = document.createElement('h1');
      titleH1.textContent = textInDiv;
      titleTables[i].appendChild(titleH1);
  
      newTableTechnoForMobile.appendChild(titleTables[i]);
      newTableTechnoForMobile.appendChild(imageTables[i]);
      newTableTechnoForMobile.appendChild(descriptionTables[i]);
    });*/
  }
  
  export default async function decorate(block) {
    createImageTeaser(block);
  }