import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import getStaticMapUrl from './mapbox-static-map';

const skipNodes = function(classes) {
  return function(el) {
    classes.forEach((cls) => {
      if (el.classList.contains(cls)) {
        return true
      }      
    });
    return false;   
  }
}

const defaultOptions = {
  allowTaint: true,
  useCORS: true,
  scale: 2,
  background: '#fff',
};

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

function getDataUri(url) {
  return new Promise(resolve => {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain

    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight; 

      //next three lines for white background in case png has a transparent background
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';  /// set white fill style
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.getContext('2d').drawImage(this, 0, 0);

      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.src = url;
  })
}

export function exportSVG(container, svgId='.layercake-layout-svg') {
  const svgEl = container.querySelector(svgId);
  // Create a clone of our svg node
  const svg = svgEl.cloneNode(true);
  // Parse the styles
  parseStyles(svg);
  // Serialize svg
  const blob = serialize(svg);
  if (blob) {
    Promise.resovle({ status:'success' });
    saveAs(blob, 'chart.svg');
  } else {
    Promise.resovle({ status:'error', msg: 'Unable to create an SVG file' });
  }
}

export async function exportPNG(container, ignore=['chart-download']) {
  const divHeight = container.offsetHeight;
  const divWidth = container.offsetWidth;

  const options = {
    ...defaultOptions,
    width: divWidth,
    height: divHeight,
    ignoreElements: skipNodes(ignore)(container),
  };

  // Hack to prevent html2canvas from moving image to middle of canvas
  // https://stackoverflow.com/questions/36213275/html2canvas-does-not-render-full-div-only-what-is-visible-on-screen
  window.scrollTo(0,0);  

  // Convert to canvas
  return html2canvas(container, options)
    .then((canvas) => {
      saveAs(canvas.toDataURL(), 'chart.png');
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
      return Promise.resolve({ status:'success' });
    })
    .catch((err) => {
      return Promise.resolve({ status:'error', msg: err });
    });
}

async function addElementToPDF(el, docWidth, docHeight, ignore) {
  const options = {
    ...defaultOptions,
    ignoreElements: skipNodes(ignore)(el),
  };

  return await html2canvas(el, options)
    .then((canvas) => {
      const widthRatio = docWidth / canvas.width
      const heightRatio = docHeight / canvas.height
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
      const img = canvas.toDataURL('image/png');
      return { 
        width: canvas.width * ratio,
        height: canvas.height * ratio,
        img,
      };
    })
    .catch((err) => {
      return err;
    });
}

export async function exportPDF(container, location, ignore=['chart-download', 'bx--btn', 'bx--modal']) {
  const headerEl = container.querySelector('.content-header');
  const statsEls = container.querySelectorAll('.content-stats');
  const chartEl = container.querySelector('.content-chart');

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
  });

  const docWidth = doc.internal.pageSize.getWidth() - 40;
  const docHeight = doc.internal.pageSize.getHeight() - 40;
  console.log(docHeight, docWidth);

  let yPos = 20;
  let xPos = 20;

  window.scrollTo(0,0);

  const {
    width: headerW,
    height: headerH,
    img: headerImg,
  } = await addElementToPDF(headerEl, docWidth * 1.2, docHeight, ignore);
  doc.addImage(headerImg, 'png', xPos, yPos, headerW, headerH);
  yPos += headerH + 10;

  const mapImg = await getDataUri(getStaticMapUrl(location));
  doc.addImage(mapImg, 'png', xPos, yPos, 150, 150);
  yPos += 150 + 10;

  const {
    width: statsW0,
    height: statsH0,
    img: statsImg0,
  } = await addElementToPDF(statsEls[0], docWidth/3, docHeight, ignore);
  doc.addImage(statsImg0, 'png', xPos, yPos, statsW0, statsH0);
  xPos += statsW0;

  const {
    width: statsW1,
    height: statsH1,
    img: statsImg1,
  } = await addElementToPDF(statsEls[1], docWidth/3, docHeight, ignore);
  doc.addImage(statsImg1, 'png', xPos, yPos, statsW1, statsH1);
  xPos += statsW1;

  const {
    width: statsW2,
    height: statsH2,
    img: statsImg2,
  } = await addElementToPDF(statsEls[2], docWidth/3, docHeight, ignore);
  doc.addImage(statsImg2, 'png', xPos, yPos, statsW2, statsH2);
  
  xPos = 20;
  yPos += statsH2 + 10;

  const {
    width: chartW,
    height: chartH,
    img: chartImg,
  } = await addElementToPDF(chartEl, docWidth * 0.8, docHeight, ignore);
  doc.addImage(chartImg, 'png', xPos, yPos, chartW, chartH);

  doc.save('screen.pdf');
  return Promise.resolve({ status:'success' });
}

export async function exportCSV(csvData) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'chart.csv');
  return Promise.resolve({ status:'success' });
}
