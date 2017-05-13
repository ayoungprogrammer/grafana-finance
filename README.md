## Grafana Finance Datasource

Fetches data from the Quandl API and maps the data to a timeseries. This is all done in the browser without needing an additional backend.

The query format follows the QUANDL naming conventions: DATASET/CODE. For example, for the commodity price of gold, use the dateset LBMA with code GOLD: LBMA/GOLD.

You can obtain a Quandl API key [here](https://www.quandl.com/?modal=register).

You can see explore Quandl's datasets [here](https://www.quandl.com/search?query=).

If you are looking for stock/equity prices, use the [Yahoo dataset](https://www.quandl.com/data/YAHOO-YFinance?keyword=).

![](https://raw.githubusercontent.com/ayoungprogrammer/grafana-finance/master/src/img/economy.png)

![](https://raw.githubusercontent.com/ayoungprogrammer/grafana-finance/master/src/img/finance.png)

### Dev setup

This plugin requires node 6.10.0

```
npm install -g yarn
yarn install
npm run build
```
