# Prime Chain Quantum Neural Trading

This project implements a chatbot-driven portfolio management system using quantum neural networks inspired by the Prime Chain framework. The project includes a backend (Flask) for handling market data and portfolio optimization, and a frontend (React) that interacts with the user via a chatbot.

## Features

- Fetches real-time financial data using Yahoo Finance API (`yfinance`).
- Uses Quantum Neural Networks to make portfolio recommendations.
- Websocket-based chatbot for real-time interaction with the user.
- Frontend built with React and Socket.IO.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js
- npm

### Installing Backend Dependencies

Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the necessary dependencies:

```bash
pip install -r requirements.txt
```

Installing Frontend Dependencies
Go to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Running the Application
Backend: Start the Flask server by running the following command:
```bash
python3 backend/app.py
```

Frontend: In the frontend folder, run the following to start the React development server:
```bash
npm start
```

Navigate to http://localhost:3000 to interact with the chatbot.

Testing
Run unit tests:

```bash
python3 -m unittest discover tests
```
