from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample stock data (you would normally fetch this from a database)
stock_database = {
    'AAPL': [
        {"date": "2025-01-15", "close": 152},
        {"date": "2025-01-16", "close": 157},
        {"date": "2025-01-17", "close": 159},
        {"date": "2025-01-18", "close": 161},
        {"date": "2025-01-19", "close": 164},
    ],
    'GOOGL': [
        {"date": "2025-01-15", "close": 1015},
        {"date": "2025-01-16", "close": 1025},
        {"date": "2025-01-17", "close": 1035},
        {"date": "2025-01-18", "close": 1040},
        {"date": "2025-01-19", "close": 1050},
    ]
}

@app.route('/')
def home():
    return 'Welcome to the Zerodha Clone!'

@app.route("/update_chart", methods=["GET"])
def update_chart():
    # Get the symbol from the query parameters
    symbol = request.args.get("symbol", "").upper()
    print(f"Received symbol: {symbol}")  # Debug print
    
    # Check if the symbol exists in the stock database
    if symbol in stock_database:
        stock_data = stock_database[symbol]
        
        # Convert date to ISO format (for easy parsing on the frontend)
        for entry in stock_data:
            entry['date'] = datetime.strptime(entry['date'], "%Y-%m-%d").isoformat()
        
        return jsonify(stock_data)
    else:
        print(f"Symbol {symbol} not found.")  # Debugging
        return jsonify([]), 404

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico')

if __name__ == "__main__":
    app.run(debug=True)
