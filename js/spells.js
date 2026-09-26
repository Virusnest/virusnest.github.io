class Ring extends SpellElement {
  constructor(rotation, color, offset, dasharray, thickness, radius) {
    super(rotation, color, offset);
    this.radius = radius;
    this.dasharray = dasharray;
    this.thickness = thickness;
  }
  svgTag(center) {
    return `<circle cx="${center}" cy="${center + offset}" r="${this.radius}" fill="transparent" stroke="${this.color}" stroke-width="${this.thickness}"/>`
  }
}

class TextRing extends SpellElement {
  constructor(rotation, color, offset, text, rotoffset, radius) {
    supre(rotation, color, offset);
    this.text = text;
    this.rotoffset = rotoffset;
    this.radius = radius;
  }
  svgTag(center) {
    `
    <path
        d="
        M ${center} ${center}
        m ${radius}, 0
        a ${radius},${radius} 0 1,0 -(${radius} * 2),0
        a ${radius},${radius} 0 1,0  (${radius} * 2),0
        "
        id="path"
    />
    <text fill="${color}">
    <textPath href="#path" >${this.text}<textPath/>
    </text>
`
  }
}

class Polygon extends SpellElement {
  constructor(rotation, color, offset, dasharray, thickness, points, rotoffset) {
    super(rotation, color, offset);
    this.points = points;
    this.dasharray = dasharray;
    this.thickness = thickness;
  }
  svgTag() {

  }

}

class SpellElement {
  constructor(rotation, color, offset) {
    this.rotation = rotation;
    this.color = color;
    this.offset = offset;
  }
  svgTag() {
    return "";
  }

  animateTag() {

  }
}


let svgstring = "";

let elements = [];

function CreateSvg(elems) {
  for (elem in elems) {

  }
}
