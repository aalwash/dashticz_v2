var coinsvalue = [];

var dashticzJS = new Dashticz();

function getCoin(coin) {
    if (coin['source'] === 'litebit') {
        appendLiteBit(coin);
    } else {
        appendCoinMarketCap(coin);
    }
    setTimeout(function () {
        getCoin(coin);
    }, 15000);
}

function appendLiteBit(coin) {
    $.getJSON(_CORS_PATH + 'https://www.litebit.eu/system/live-updates', function (data) {

        var symbol = '€';
        var varname = coin['key'] + 'RateBuyRound';

        if (typeof(coin['amount']) !== 'undefined' && parseFloat(coin['amount']) > 0) {
            var html = '<div class="col-xs-6 col-data">' + coin['key'].toUpperCase() + '<br /><strong class="title">' + symbol + number_format(data[varname], 2) + '</strong><br>';
            html += '<span class="state">' + coin['amount'] + '</span>';
            html += '</div>';
            html += '<div class="col-xs-6 col-data col-currency">' + symbol + number_format(data[coin['key'] + 'RateSellRound'] * coin['amount'], 2) + '</div>';
        } else {
            var html = '<div class="col-xs-12 col-data">' + coin['key'].toUpperCase() + '<br /><strong class="title">' + symbol + number_format(data[varname], 2) + '</strong><br>';
            html += '</div>';
        }

        dashticzJS.Template().injectTemplateToElementById('coins.tpl', 'coins-' + data[0]['id'], {
            coin: coin,
            data: data,
            varname: varname,
            symbol: symbol,
            number_format: number_format
        });
        coinsvalue[coin['key']] = data[varname];
        // $('.coins-' + coin['key']).html(html);
    });
}

function appendCoinMarketCap(coin) {
    $.getJSON('https://api.coinmarketcap.com/v1/ticker/' + coin['key'] + '/?convert=' + coin['currency'], function (responseData) {
        var data = {};

        data.symbol = '$';
        data.varname = 'price_usd';

        switch (coin['currency'].toUpperCase()) {
            case 'EUR':
                data.symbol = '€';
                data.varname = 'price_eur';
                break;
            case 'GBP':
                data.symbol = '£';
                data.varname = 'price_gbp';
                break;
        }

        var coinId = responseData[0].id;

        data.coinCurrency = responseData[0].symbol;
        data.portfolioPrice = false;
        data.rawPrice = responseData[0][data.varname];
        data.price = number_format(data.rawPrice, 2);
        data.coin = coin;

        if(typeof coin.amount !== undefined && parseFloat(coin.amount) > 0) {
            data.portfolioPrice = number_format(coin.amount * data.rawPrice, 2);
        }

        dashticzJS.Template().injectTemplateToElementById('coins.tpl', 'coins-' + coinId, data)
            .done(function(ractive) {
                console.log('Done injecting');
            });

        coinsvalue[coin['key']] = responseData[0][data.varname];
    });
}
