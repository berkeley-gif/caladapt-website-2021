import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

function serialize(svg) {
  const xmlns = 'http://www.w3.org/2000/xmlns/';
  const xlinkns = 'http://www.w3.org/1999/xlink';
  const svgns = 'http://www.w3.org/2000/svg';
  svg = svg.cloneNode(true);
  svg.setAttributeNS(xmlns, 'xmlns', svgns);
  svg.setAttributeNS(xmlns, 'xmlns:xlink', xlinkns);
  const serializer = new window.XMLSerializer;
  const string = serializer.serializeToString(svg);
  return new Blob([string], {type: 'image/svg+xml'});
}

function parseStyles(svg) {
  const styleSheets = [];
  let i;
  // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
  const docStyles = svg.ownerDocument.styleSheets;

  // transform the live StyleSheetList to an array to avoid endless loop
  for (i = 0; i < docStyles.length; i++) {
    styleSheets.push(docStyles[i]);
  }

  if (!styleSheets.length) {
    return;
  }

  const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (!defs.parentNode) {
    svg.insertBefore(defs, svg.firstElementChild);
  }
  svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;

  // create a new style element
  const style = document.createElement('style');

  // iterate through all document's stylesheets
  for (i = 0; i < styleSheets.length; i++) {
    const currentStyle = styleSheets[i]

    let rules;
    try {
      rules = currentStyle.cssRules;
    } catch (e) {
      continue;
    }

    // some stylesheets can't be accessed and will throw a security error
    const l = rules && rules.length;
    // iterate through each cssRules of this stylesheet
    for (let j = 0; j < l; j++) {
      // get the selector of this cssRules
      const selector = rules[j].selectorText;
      // probably an external stylesheet we can't access
      if (!selector) {
        continue;
      }

      // is it our svg node or one of its children ?
      if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {
        const { cssText } = rules[j];
        // append it to our <style> node
        style.innerHTML += cssText;
      }
    }
  }

  // if we got some rules
  if (style.innerHTML) {
    // append the style node to the clone's defs
    defs.appendChild(style);
  }
}

export function exportSVG(container, svgId='.layercake-layout-svg') {
  const svgEl = container.querySelector(svgId);
  // Create a clone of our svg node
  const svg = svgEl.cloneNode(true);
  // Parse the styles
  parseStyles(svg);
  // Serialize svg
  const blob = serialize(svg);
  saveAs(blob, 'chart.svg');
}

export async function exportPNG(container, ignoreArr=['chart-download']) {
  const divHeight = container.offsetHeight;
  const divWidth = container.offsetWidth;
  const ignoreElements = (el) => {
    let flag = false;
    ignoreArr.forEach((cls) => {
      if (el.classList.contains(cls)) {
        flag = true;
      }      
    });
    return flag;
  }

  const options = {
    allowTaint: true,
    useCORS: true,
    width: divWidth,
    height: divHeight,
    scale: 2,
    ignoreElements,
  };

  // Hack to prevent html2canvas from moving image to middle of canvas
  // https://stackoverflow.com/questions/36213275/html2canvas-does-not-render-full-div-only-what-is-visible-on-screen
  window.scrollTo(0,0);  

  // Convert to canvas
  return html2canvas(container, options)
    .then((canvas) => {
      saveAs(canvas.toDataURL(), 'chart.png');
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    })
    .catch((err) => {
      return err;
    });
}

export async function exportPDF(container, ignoreArr=['chart-download']) {
  const headerEl = container.querySelector('.content-header');
  const statsEls = container.querySelectorAll('.content-stats');
  const chartEl = container.querySelector('.content-chart');
  console.log('chartEl', chartEl);

  const divHeight = container.offsetHeight;
  const divWidth = container.offsetWidth;
  const ignoreElements = (el) => {
    let flag = false;
    ignoreArr.forEach((cls) => {
      if (el.classList.contains(cls)) {
        flag = true;
      }      
    });
    return flag;
  }

  const options = {
    allowTaint: true,
    useCORS: true,
    width: divWidth,
    height: divHeight,
    scale: 2,
    ignoreElements,
  };

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'letter',
  });

  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.getHeight();

  let yPos = 20;
  let xPos = 20;

  window.scrollTo(0,0);

  const { headerRatio, header } = await html2canvas(headerEl, options)
    .then((canvas) => {
      const headerRatio = headerEl.offsetHeight / headerEl.offsetWidth;
      console.log('header', headerRatio, headerEl.offsetHeight, headerEl.offsetWidth);
      const header = canvas.toDataURL('image/png');
      return { headerRatio, header };
    })
    .catch((err) => {
      return err;
    });

  const { statsRatio, stats } = await html2canvas(statsEls[0], options)
    .then((canvas) => {
      const statsRatio = statsEls[0].offsetHeight / statsEls[0].offsetWidth;
      console.log('stats', statsRatio, statsEls[0].offsetHeight, statsEls[0].offsetWidth);
      const stats = canvas.toDataURL('image/png');
      return { statsRatio, stats };
    })
    .catch((err) => {
      return err;
    });

  const { imgRatio, img } = await html2canvas(chartEl, options)
    .then((canvas) => {
      const imgRatio = chartEl.offsetHeight / chartEl.offsetWidth;
      console.log('header', headerRatio, headerEl.offsetHeight, headerEl.offsetWidth);
      const img = canvas.toDataURL('image/png');
      return { img, imgRatio };
    })
    .catch((err) => {
      return err;
    });

  doc.addImage(header, 'png', xPos, yPos, docWidth, 200);
  yPos =+ headerEl.offsetHeight + 20;
  doc.addImage(stats, 'png', xPos, yPos, docWidth, docWidth * statsRatio);
  yPos =+ 300 + 20;
  doc.addImage(img, 'png', xPos, yPos, docWidth, docWidth * imgRatio);
  doc.save('chart.pdf');
}

export async function exportCSV(csvData) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'chart.csv');
}
