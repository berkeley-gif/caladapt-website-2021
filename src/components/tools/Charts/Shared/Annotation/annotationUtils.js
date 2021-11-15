// Helper functions for creating swoopy arrows

/* --------------------------------------------
 * parseCssValue
 *
 * Parse various inputs and return then as a number
 * Can be a number, which will return the input value
 * A percentage, which will take the percent of the appropriate dimentions
 * A pixel value, which will parse as a number
 *
 */
export function parseCssValue(d, i, width, height) {
  if (!d) return 0;
  if (typeof d === "number") {
    return d;
  }
  if (d.indexOf("%") > -1) {
    return (+d.replace("%", "") / 100) * (i ? height : width);
  }
  return +d.replace("px", "");
}

/* --------------------------------------------
 * getElPosition
 *
 * Constract a bounding box relative in our coordinate space
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

    /*
    SECOND, compose the corresponding SVG arc.
      read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
      example: <path d = "M 200,50 a 50,50 0 0,1 100,0"/>
                          M 200,50                          Moves pen to (200,50);
                                   a                        draws elliptical arc;
                                     50,50                  following a degenerate ellipse, r1 == r2 == 50;
                                                            i.e. a circle of radius 50;
                                           0                with no x-axis-rotation (irrelevant for circles);
                                             0,1            with large-axis-flag=0 and sweep-flag=1 (clockwise);
                                                 100,0      to a point +100 in x and +0 in y, i.e. (300,50).
    */
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
 * straightLine
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

/* --------------------------------------------
 * create some sample annotations
 *
 *
 */
export function getSampleAnnotations() {
  return [
    {
      label: {
        text: "1980",
        position: {
          top: "10%",
          left: "20%",
        },
      },
      connectors: [
        {
          type: "threshold",
          orientation: "v",
          source: {
            anchor: "left-middle",
            dx: 0,
            dy: 10,
          },
          target: {},
          style: { "stroke-dasharray": "6,4" },
        },
      ],
    },
    {
      label: {
        text: "Text with swoopy arrows",
        data: { date: new Date(Date.UTC(2020, 0, 1)), value: 78 },
      },
      connectors: [
        {
          type: "swoopy-arrow",
          clockwise: false,
          source: {
            anchor: "left-middle",
          },
          target: {
            x: "10%",
            y: "55%",
          },
          style: {},
        },
        {
          type: "swoopy-arrow",
          source: {
            anchor: "right-bottom",
            dy: -7,
            dx: 5,
          },
          target: {
            x: "68%",
            y: "48%",
          },
          style: {},
        },
      ],
    },
    {
      label: {
        text: "Different emission scenarios start showing significant differences",
        position: {
          top: "60%",
          left: "10%",
        },
      },
      connectors: [
        {
          type: "straight-arrow",
          clockwise: false,
          source: {
            anchor: "left-bottom",
            dx: "10",
          },
          target: {
            x: "10%",
            y: "85%",
          },
          style: {},
        },
      ],
    },
  ];
}
