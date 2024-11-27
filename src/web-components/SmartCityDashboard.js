// SmartCityDashboard.js

class SmartCityDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.trafficData = [];
    this.energyData = [];
  }

  static get observedAttributes() {
    return ['traffic-data', 'energy-data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'traffic-data') {
      this.trafficData = JSON.parse(newValue);
      this.updateTrafficVisual();
    }
    if (name === 'energy-data') {
      this.energyData = JSON.parse(newValue);
      this.updateEnergyMonitor();
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .dashboard {
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px 0;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h2 {
          margin-top: 0;
          color: #333333;
        }
      </style>
      <div class="dashboard">
        <h2>Smart City Infrastructure Monitoring</h2>
        <prime-traffic-visual id="traffic-visual"></prime-traffic-visual>
        <prime-energy-monitor id="energy-monitor"></prime-energy-monitor>
      </div>
    `;
  }

  updateTrafficVisual() {
    const trafficVisual = this.shadowRoot.getElementById('traffic-visual');
    if (trafficVisual) {
      trafficVisual.setAttribute('data-bind', JSON.stringify(this.trafficData));
    }
  }

  updateEnergyMonitor() {
    const energyMonitor = this.shadowRoot.getElementById('energy-monitor');
    if (energyMonitor) {
      energyMonitor.setAttribute('data-bind', JSON.stringify(this.energyData));
    }
  }
}

customElements.define('smart-city-dashboard', SmartCityDashboard);
