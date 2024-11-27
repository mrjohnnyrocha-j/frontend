// PrimeTrafficVisual.js

class PrimeTrafficVisual extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.trafficData = [];
    }
  
    static get observedAttributes() {
      return ['data-bind'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data-bind') {
        this.trafficData = JSON.parse(newValue);
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const trafficVolume = this.trafficData?.trafficVolume || 0;
      const trafficTime = this.trafficData?.time || 'N/A';
  
      this.shadowRoot.innerHTML = `
        <style>
          .traffic-visual {
            height: 300px;
            background-color: var(--random-item-bg, #e0f7fa);
            margin-bottom: 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            color: var(--text-color, #006064);
            flex-direction: column;
          }
          .traffic-visual p {
            margin: 5px 0;
          }
        </style>
        <div class="traffic-visual">
          <p><strong>Traffic Volume:</strong> ${trafficVolume}</p>
          <p><strong>Time:</strong> ${trafficTime}</p>
        </div>
      `;
    }
  }
  
  customElements.define('prime-traffic-visual', PrimeTrafficVisual);
  