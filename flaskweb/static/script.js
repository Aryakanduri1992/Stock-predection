document.getElementById('predictButton').addEventListener('click', () => {
    const symbol = document.getElementById('stockSymbol').value;
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol: symbol })
    })
    .then(response => response.json())
    .then(data => {
        displayChart(data.stockData, data.predictions);
    })
    .catch(error => {
        console.error('Error predicting stock prices:', error);
    });
});

function displayChart(stockData, predictions) {
    const closingPrices = Object.values(stockData).map(day => parseFloat(day['4. close'])).reverse();
    const dates = Object.keys(stockData).reverse();
    
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...dates, ...Array(7).fill('').map((_, i) => `Day ${i + 1}`)],
            datasets: [
                {
                    label: 'Historical Prices',
                    data: closingPrices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Predicted Prices',
                    data: [...Array(closingPrices.length).fill(null), ...predictions],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });
}
