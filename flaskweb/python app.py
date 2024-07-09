from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    symbol = request.json['symbol']
    stock_data = fetch_stock_data(symbol)
    predictions = predict_stock_prices_with_gpt3(symbol, stock_data)
    return jsonify({'stockData': stock_data, 'predictions': predictions})

def fetch_stock_data(symbol):
    api_key = 'YOUR_ALPHA_VANTAGE_API_KEY'
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
    
    try:
        response = requests.get(url)
        data = response.json()
        return data['Time Series (Daily)']
    except Exception as e:
        print('Error fetching stock data:', e)
        return None

def predict_stock_prices_with_gpt3(symbol, historical_data):
    api_key = 'YOUR_GPT_3_API_KEY'
    api_url = 'https://api.openai.com/v1/engines/davinci-codex/completions'

    closing_prices = [float(day['4. close']) for day in historical_data.values()]
    prompt = f"Given the following closing prices for stock {symbol}: {', '.join(map(str, closing_prices))}, predict the next 7 days of closing prices."

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    payload = {
        'prompt': prompt,
        'max_tokens': 50,
        'n': 1,
        'stop': None,
        'temperature': 0.5
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload)
        data = response.json()
        prediction_text = data['choices'][0]['text'].strip()
        predictions = [float(price.strip()) for price in prediction_text.split(',')]
        return predictions
    except Exception as e:
        print('Error predicting stock prices with GPT-3:', e)
        return [None] * 7

if __name__ == '__main__':
    # Set up SSL context with your generated certificates
    ssl_context = ('cert.pem', 'key.pem')
    app.run(debug=True, ssl_context=ssl_context)
