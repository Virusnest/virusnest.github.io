class SpellElement {
  static _idCounter = 0;
  static SPIN_DURATION = "60s"; // fixed speed for every element

  constructor(rotation, color, offset, rotoffset) {
    this.rotation = rotation; // boolean: true = clockwise, false = counter-clockwise
    this.rotoffset = rotoffset;
    this.color = color;
    this.offset = offset;
    this.id = `spell-el-${SpellElement._idCounter++}`;
  }

  shapeEl(center) {
    return svgEl("g"); // empty fallback
  }

  animateEl(center) {
    const to = this.rotation ? 360 : -360;
    return svgEl("animateTransform", {
      attributeName: "transform",
      type: "rotate",
      from: `${this.rotoffset} ${center} ${center}`,
      to: `${to + this.rotoffset} ${center} ${center}`,
      dur: SpellElement.SPIN_DURATION,
      repeatCount: "indefinite",
    });
  }

  svgTag(center) {
    const g = svgEl("g");
    g.appendChild(this.shapeEl(center));
    g.appendChild(this.animateEl(center));
    return g;
  }

  strokeAttrs() {
    return {
      fill: "none",
      stroke: this.color,
      "stroke-width": this.thickness,
      "stroke-dasharray": this.dasharray || undefined,
    };
  }
}

class Ring extends SpellElement {
  constructor(
    rotation,
    color,
    offset,
    rotoffset,
    dasharray,
    thickness,
    radius,
  ) {
    super(rotation, color, offset, rotoffset);
    this.radius = radius;
    this.dasharray = dasharray;
    this.thickness = thickness;
  }
  shapeEl(center) {
    return svgEl("circle", {
      cx: center,
      cy: center + this.offset,
      r: this.radius,
      ...this.strokeAttrs(),
    });
  }
}

class TextRing extends SpellElement {
  constructor(rotation, color, offset, rotoffset, text, radius) {
    super(rotation, color, offset, rotoffset);
    this.text = text;
    this.radius = radius;
  }
  shapeEl(center) {
    const path = svgEl("path", {
      d: `M ${center - this.radius} ${center}
          a ${this.radius},${this.radius} 0 1,0 ${this.radius * 2},0
          a ${this.radius},${this.radius} 0 1,0 ${-(this.radius * 2)},0`,
      id: this.id,
      fill: "none",
    });

    const textPath = svgEl("textPath", {
      href: `#${this.id}`,
      startOffset: this.rotoffset,
    });
    textPath.textContent = this.text; // DOM escapes this automatically — no XSS/malformed markup risk

    const text = svgEl("text", { fill: this.color });
    text.appendChild(textPath);

    const group = svgEl("g");
    group.appendChild(path);
    group.appendChild(text);
    return group;
  }
}

class SimplePolygon extends SpellElement {
  constructor(
    rotation,
    color,
    offset,
    rotoffset,
    dasharray,
    thickness,
    radius,
    sides,
  ) {
    super(rotation, color, offset, rotoffset);
    this.radius = radius;
    this.sides = sides;
    this.dasharray = dasharray;
    this.thickness = thickness;
    this.rotoffset = rotoffset; // starting angle offset, in degrees
  }

  // computes vertices centered at (cx, cy)
  getPoints(cx, cy) {
    const points = [];
    const angleStep = (2 * Math.PI) / this.sides;
    const startAngle = (this.rotoffset * Math.PI) / 180 - Math.PI / 2; // -90° so a vertex points "up" by default

    for (let i = 0; i < this.sides; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + this.radius * Math.cos(angle);
      const y = cy + this.radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }

  shapeEl(center) {
    return svgEl("polygon", {
      points: this.getPoints(center, center + this.offset),
      ...this.strokeAttrs(),
    });
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (val !== undefined && val !== null && val !== false) {
      el.setAttribute(key, val);
    }
  }
  for (const child of children) {
    el.appendChild(child);
  }
  return el;
}

function CreateSvg(elems, size = 500) {
  const center = size / 2;
  const svg = svgEl("svg", {
    xmlns: SVG_NS,
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
  });
  for (const elem of elems) {
    svg.appendChild(elem.svgTag(center));
  }
  return svg;
}

const PRIMARY = "white";
const SECONDARY = "white";

const elements = [
  // Outer ambient layer
  new Ring(0, PRIMARY, 0, 0, "3,9", 0.75, 230, {
    opacity: 0.3,
    duration: "75s",
  }),
  new Ring(0, PRIMARY, 0, 0, "", 1, 220, { opacity: 0.3, duration: "75s" }),

  // Outer ring + sigils
  new Ring(1, PRIMARY, 0, 0, "", 1.5, 200, { opacity: 0.6, duration: "90s" }),
  new Ring(1, PRIMARY, 0, 0, "2,6", 0.75, 192, {
    opacity: 0.6,
    duration: "90s",
  }),
  new Ring(1, PRIMARY, 0, 0, "", 1, 184, { opacity: 0.6, duration: "90s" }),

  // Mid-outer geometric layer (two overlapping triangles)
  new Ring(0, SECONDARY, 0, 0, "8,4,2,4", 1, 160, {
    opacity: 0.5,
    duration: "75s",
  }),
  new SimplePolygon(0, PRIMARY, 0, 0, "", 1, 150, 3, {
    opacity: 0.5,
    duration: "75s",
  }),
  new SimplePolygon(0, PRIMARY, 0, 180, "", 1, 150, 3, {
    opacity: 0.5,
    duration: "75s",
  }),

  // Mid layer (two overlapping squares)
  new Ring(1, PRIMARY, 0, 0, "", 1.25, 125, { opacity: 0.55, duration: "90s" }),
  new Ring(1, PRIMARY, 0, 0, "6,4", 0.75, 110, {
    opacity: 0.55,
    duration: "90s",
  }),
  new SimplePolygon(1, SECONDARY, 0, 0, "", 1, 109.87, 4, {
    opacity: 0.55,
    duration: "90s",
  }),
  new SimplePolygon(1, PRIMARY, 0, 45, "", 1, 109.87, 4, {
    opacity: 0.55,
    duration: "90s",
  }),

  new Ring(0, PRIMARY, 0, 0, "", 0.75, 80, { opacity: 0.65, duration: "75s" }),
  new Ring(0, SECONDARY, 0, 0, "4,4", 1, 50, {
    opacity: 0.65,
    duration: "75s",
  }),
  new Ring(0, PRIMARY, 0, 0, "", 1, 35, { opacity: 0.65, duration: "75s" }),

  // Absolute center details
  new Ring(1, PRIMARY, 0, 0, "", 1, 4, { opacity: 0.5, duration: "120s" }),
];

document.getElementById("canvas").appendChild(CreateSvg(elements));
let list = document.getElementById("list");
for (const elem of elements) {
  li = document.createElement(`li`);
  li.textContent = elem.constructor.name;
  list.appendChild(li);
}
