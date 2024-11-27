// UserProfile.js

class UserProfile extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.user = {
        name: 'John Doe',
        email: 'john@example.com'
      };
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .user-profile {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 8px;
            background-color: #fafafa;
            max-width: 300px;
            text-align: center;
          }
          .user-profile h3 {
            margin-top: 0;
            color: #333333;
          }
          .user-profile p {
            color: #555555;
          }
          jtml-button {
            margin-top: 10px;
          }
        </style>
        <div class="user-profile">
          <h3>${this.user.name}</h3>
          <p>Email: ${this.user.email}</p>
          <jtml-button action="logout">Logout</jtml-button>
        </div>
      `;
    }
  }
  
  customElements.define('user-profile', UserProfile);
  