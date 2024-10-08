// Annotation component based on annotated column example from LayerCake
// https://layercake.graphics/example/Column

// Some lookups to convert between x, y / width, height terminology
// and CSS names
const lookups = [
  { dimension: "width", css: "left", position: "x" },
  { dimension: "height", css: "top", position: "y" },
];

/* --------------------------------------------
 * parseCssValue
 *
 * Parse various inputs and return then as a number
 * Can be a number, which will return the input value
 * A percentage, which will take the percent of the appropriate dimentions
 * A pixel value, which will parse as a number
 *
 */
export function parseCssValue(d, orientVertical, width, height) {
  if (!d) return 0;
  if (typeof d === "number") {
    return d;
  }
  if (d.indexOf("%") > -1) {
    return (+d.replace("%", "") / 100) * (orientVertical ? height : width);
  }
  return +d.replace("px", "");
}

/* --------------------------------------------
 * getElPosition
 *
 * Construct a bounding box relative in our coordinate space
 * that we can attach arrow starting points to
 *
 */
export function getElPosition(el) {
  const annotationBbox = el.getBoundingClientRect();
  const parentBbox = el.parentNode.getBoundingClientRect();
  const coords = {
    top: annotationBbox.top - parentBbox.top,
    right: annotationBbox.right - parentBbox.left,
    bottom: annotationBbox.bottom - parentBbox.top,
    left: annotationBbox.left - parentBbox.left,
    width: annotationBbox.width,
    height: annotationBbox.height,
  };
  return coords;
}

/* --------------------------------------------
 * getPositionFromData
 *
 * Use layercake accessor functions to calculate
 * source/target coordinates from row in data
 *
 */
export function getPositionFromData({
  data,
  xGet,
  yGet,
  width,
  height,
  dx = 0,
  dy = 0,
}) {
  const x = xGet(data) || 0;
  const y = yGet(data) || 0;
  return [
    parseCssValue(x, 0, width, height) + dx,
    parseCssValue(y, 1, width, height) + dy,
  ];
}

/* --------------------------------------------
 * getPositionFromAnchor
 *
 * Use label position & anchor to calculate
 * source coordinates
 *
 */
export function getPositionFromAnchor({ anchor, label, dx = 0, dy = 0 }) {
  const elPos = getElPosition(label);
  const [x, y] = anchor.split("-").map((d, i) => {
    const point =
      d === "middle"
        ? elPos[lookups[i].css] + elPos[lookups[i].dimension] / 2
        : elPos[d];
    return point;
  });
  return [x + dx, y + dy];
}

/* --------------------------------------------
 * getPositionFromXY
 *
 * Use label position, x & y to calculate
 * target coordinates
 *
 */
export function getPositionFromXY({ x, y, width, height, dx = 0, dy = 0 }) {
  const xPos = parseCssValue(x, 0, width, height) + dx;
  const yPos = parseCssValue(y, 1, width, height) + dy;
  return [xPos, yPos];
}

/* --------------------------------------------
 * swoopyArrow
 *
 * Adapted from bizweekgraphics/swoopyarrows
 *
 */
export function swoopyArrow() {
  let angle = Math.PI;
  let clockwise = true;
  let xValue = (d) => d[0];
  let yValue = (d) => d[1];

  function hypotenuse(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  function render(data) {
    data = data.map((d, i) => {
      return [xValue.call(data, d, i), yValue.call(data, d, i)];
    });

    // get the chord length ("height" {h}) between points
    const h = hypotenuse(data[1][0] - data[0][0], data[1][1] - data[0][1]);

    // get the distance at which chord of height h subtends {angle} radians
    const d = h / (2 * Math.tan(angle / 2));

    // get the radius {r} of the circumscribed circle
    const r = hypotenuse(d, h / 2);

    // compose the corresponding SVG arc
    const path =
      "M " +
      data[0][0] +
      "," +
      data[0][1] +
      " a " +
      r +
      "," +
      r +
      " 0 0," +
      (clockwise ? "1" : "0") +
      " " +
      (data[1][0] - data[0][0]) +
      "," +
      (data[1][1] - data[0][1]);

    return path;
  }

  render.angle = function renderAngle(_) {
    if (!arguments.length) return angle;
    angle = Math.min(Math.max(_, 1e-6), Math.PI - 1e-6);
    return render;
  };

  render.clockwise = function renderClockwise(_) {
    if (!arguments.length) return clockwise;
    clockwise = !!_;
    return render;
  };

  render.x = function renderX(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return render;
  };

  render.y = function renderY(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return render;
  };

  return render;
}

/* --------------------------------------------
 * straightArrow
 *
 *
 */
export function straightArrow() {
  let xValue = (d) => d[0];
  let yValue = (d) => d[1];

  function render(data) {
    data = data.map((d, i) => {
      return [xValue.call(data, d, i), yValue.call(data, d, i)];
    });
    const path =
      "M " +
      data[0][0] +
      "," +
      data[0][1] +
      "L " +
      data[1][0] +
      "," +
      data[1][1];
    return path;
  }

  render.x = function renderX(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return render;
  };

  render.y = function renderY(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return render;
  };

  return render;
}

/* --------------------------------------------
 * threshold
 *
 *
 */
export function threshold() {
  let orientation = "v";
  let extent = 100;
  let xValue = (d) => d[0];
  let yValue = (d) => d[1];

  function render(data) {
    data = data.map((d, i) => {
      return [xValue.call(data, d, i), yValue.call(data, d, i)];
    });

    let path;
    if (orientation === "v") {
      path = "M" + data[0][0] + ",0" + orientation + extent;
    } else {
      path = "M0," + data[0][1] + orientation + extent;
    }
    return path;
  }

  render.orientation = function renderAngle(_) {
    if (!arguments.length) return orientation;
    orientation = _;
    return render;
  };

  render.extent = function renderExtent(_) {
    if (!arguments.length) return extent;
    extent = _ + 10;
    return render;
  };

  render.x = function renderX(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return render;
  };

  render.y = function renderY(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return render;
  };

  return render;
}

// Some sample annotations for testing
/**
 * The Annotation object, containing the properties label and one or more connector.
 * @typedef {Object} Annotation
 * @property {Object} label - Describes the annotation's label properties
 * @property {Array} connectors – An array of one or more Connector objects
 */

/**
 * The Label object, used by an Annotation object
 * The Label is an absolutely positioned div. The position is calculated
 * from the position property or data property. If neither property
 * is present it will default to "top:0;left:0"
 * @typedef {Object} Label
 * @property {String} text – The text displayed in the label
 * @property {Object} [data] – A row from data used in chart, used by layercake accessor functions to get x & y value
 * @property {Object} [position] – Position of label using css props
 * @property {Object} [style] - An object with list of css properties to overrise default label style
 */

/**
 * The Connector object, used by the Annotation object
 * The Connector is a svg path.
 * @typedef {Object} Connector
 * @property {("threshold"|"straight-arrow"|"swoopy-arrow")} type – allowed type of connector
 * @property {("v"|"h")} [orientation = "v"] - indicates if threshold line is vertical or horizontal
 * @property {Boolean} [clockwise = true] - indicates if swoopy arrow is clockwise or anticlockwise
 * @property {Object} [source] - Position of connector end nearest to label
 * @property {Object} [target] - Position of connector end farthest away from label
 * @property {Object} [style] - An object with list of css properties to overrise default connector style
 */

/**
 * The Source object, used by the Connector object
 * @typedef {Object} Source
 * @property {String} [anchor]  - attachment directives separated by a "-" (left/right-top/bottom/middle)
 * @property {Object} [data] – A row from data used in chart, used by layercake accessor functions to get x & y value
 * @property {Number} [dx] - number of pixels to offset x position
 * @property {Number} [dy] - number of pixels to offset y position
 */

/**
 * The Target object, used by the Connector object
 * @typedef {Object} Target
 * @property {Object} [data] – A row from data used in chart, used by layercake accessor functions to get x & y value
 * @property {String} [x] - x position as number, pixel value or percentage
 * @property {String} [y] - y position as number, pixel value or percentage
 */

/**
 * The Data object, used by the Label & Connector objects
 * @typedef {Object} Data
 * @property {Date} [data.date] - example for LineArea chart
 * @property {Number} [data.value] - example for LineArea chart
 * @property {Number} [data.dx] - number of pixels to offset x position
 * @property {Number} [data.dy] - number of pixels to offset y position
 */

/**
 * The Position object, used by the Label object for absolute positioning
 * @typedef {Object} Position
 * @property {String} [position.top] - top edge as number, pixel value or percentage
 * @property {String} [position.bottom] - bottom edge as number, pixel value or percentage
 * @property {String} [position.left] - left edge as number, pixel value or percentage
 * @property {String} [position.right] - right edge as number, pixel value or percentage
 */

export function getSampleAnnotations() {
  return [
    {
      label: {
        text: "1980",
        data: { date: new Date(Date.UTC(1980, 0, 1)) },
        dx: -20,
        style: { background: "rgba(255, 255, 255, 1" },
      },
      connectors: [
        {
          type: "threshold",
          orientation: "v",
          source: {
            data: { date: new Date(Date.UTC(1980, 0, 1)) },
          },
          style: { "stroke-dasharray": "6,4" },
        },
      ],
    },
    {
      label: {
        text: "82",
        data: { value: 82 },
        dx: 20,
        dy: -20,
      },
      connectors: [
        {
          type: "threshold",
          orientation: "h",
          source: {
            data: { value: 82 },
          },
          style: { "stroke-dasharray": "6,4", stroke: "blue" },
        },
      ],
    },
    {
      label: {
        text: "Text with swoopy arrows",
        position: {
          top: "100px",
          right: "400px",
        },
      },
      connectors: [
        {
          type: "swoopy-arrow",
          clockwise: false,
          source: {
            anchor: "left-middle",
          },
          target: {
            data: { date: new Date(Date.UTC(1960, 0, 1)), value: 76 },
          },
        },
        {
          type: "swoopy-arrow",
          source: {
            anchor: "right-bottom",
            dx: 5,
            dy: -7,
          },
          target: {
            data: { date: new Date(Date.UTC(2050, 0, 1)), value: 78 },
          },
        },
      ],
    },
    {
      label: {
        text: "Different emission scenarios start showing significant differences",
        position: {
          top: "70%",
          left: "40%",
        },
        style: {
          color: "red",
          "text-align": "right",
        },
      },
      connectors: [
        {
          type: "straight-arrow",
          clockwise: false,
          source: {
            anchor: "right-middle",
            dx: 10,
          },
          target: {
            data: { date: new Date(Date.UTC(2060, 0, 1)), value: 74 },
          },
        },
      ],
    },
    {
      label: {
        text: "⟵ Extended Drought Period (20 years) ⟶",
        position: {
          top: "5%",
          left: "50%",
        },
      },
    },
  ];
}
