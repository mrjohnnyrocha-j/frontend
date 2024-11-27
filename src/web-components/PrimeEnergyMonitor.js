// PrimeEnergyMonitor.js

class PrimeEnergyMonitor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.energyData = [];
    }
  
    static get observedAttributes() {
      return ['data-bind'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data-bind') {
        this.energyData = JSON.parse(newValue);
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const energyUsage = this.energyData?.energyUsage || 0;
      const energyTime = this.energyData?.time || 'N/A';
  
      this.shadowRoot.innerHTML = `
        <style>
          .energy-monitor {
            height: 200px;
            background-color: #fff3e0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            color: #e65100;
            flex-direction: column;
          }
          .energy-monitor p {
            margin: 5px 0;
          }
        </style>
        <div class="energy-monitor">
          <p><strong>Energy Usage:</strong> ${energyUsage} kWh</p>
          <p><strong>Time:</strong> ${energyTime}</p>
        </div>
      `;
    }
  }
  
  customElements.define('prime-energy-monitor', PrimeEnergyMonitor);
  