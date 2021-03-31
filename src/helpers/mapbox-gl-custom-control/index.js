/**
 * A custom control
 * @param {Object} options
 */
export default class CustomControl {
  constructor(options = {}) {
    this.options = {
      className: 'toggle-layers',
      title: 'Layers',
      // style: 'width:60px;font-size:0.9rem;',
      iconPath: `M32 10l-16-8-16 8 16 8 16-8zM16 4.655l10.689 5.345-10.689 
      5.345-10.689-5.345 10.689-5.345zM28.795 14.398l3.205 1.602-16 8-16-8 
      3.205-1.602 12.795 6.398zM28.795 20.398l3.205 1.602-16 8-16-8 
      3.205-1.602 12.795 6.398z`,
      groupContainer: null,
      eventHandler: null,
    };
    this.options = Object.assign(this.options, options);
  }

  onAdd(map) {
    if (map && typeof map !== 'string') {
      this.map = map;
    }

    if (!this.options.groupContainer) {
      this.container = document.createElement('div');
      this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    } else {
      this.container = this.options.groupContainer;
    }

    this.button = document.createElement('button');
    this.button.className = `mapboxgl-ctrl-${this.options.className}`;
    this.button.title = this.options.title;
    this.button.onclick = this.options.eventHandler;
    // this.button.innerHTML = this.options.title;
    this.button.style = this.options.style;
    const icon = this.createIcon(`<path d="${this.options.iconPath}"></path>`);
    this.button.appendChild(icon);
    this.container.appendChild(this.button);
    return this.container;
  }

  onRemove() {
    if (!this.options.groupContainer) {
      this.container.parentNode.removeChild(this.container);
    } else {
      this.button.parentNode.removeChild(this.button);
    }
    this.map = undefined;
  }

  createIcon(path) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 32 32');
    icon.setAttribute('xml:space', 'preserve');
    icon.setAttribute('width', 18);
    icon.setAttribute('height', 18);
    icon.innerHTML = path;
    return icon;
  }
}
