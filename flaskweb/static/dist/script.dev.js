"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.getElementById('predictButton').addEventListener('click', function () {
  var symbol = document.getElementById('stockSymbol').value;
  fetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      symbol: symbol
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    displayChart(data.stockData, data.predictions);
  })["catch"](function (error) {
    console.error('Error predicting stock prices:', error);
  });
});

function displayChart(stockData, predictions) {
  var closingPrices = Object.values(stockData).map(function (day) {
    return parseFloat(day['4. close']);
  }).reverse();
  var dates = Object.keys(stockData).reverse();
  var ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [].concat(_toConsumableArray(dates), _toConsumableArray(Array(7).fill('').map(function (_, i) {
        return "Day ".concat(i + 1);
      }))),
      datasets: [{
        label: 'Historical Prices',
        data: closingPrices,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
      }, {
        label: 'Predicted Prices',
        data: [].concat(_toConsumableArray(Array(closingPrices.length).fill(null)), _toConsumableArray(predictions)),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: false
      }]
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
//# sourceMappingURL=script.dev.js.map
