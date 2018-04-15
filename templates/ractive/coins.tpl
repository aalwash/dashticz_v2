{{#if coin.amount && parseFloat(coin.amount) > 0}}
    <div class="col-xs-6 col-data">{{ coinCurrency }}<br /><strong class="title">{{ symbol }} {{ portfolioPrice }}</strong><br>
        <span class="state">{{ coin.amount }}</span>
    </div>
    <div class="col-xs-6 col-data col-currency">{{ symbol }} {{ price }}</div>
{{else}}
    <div class="col-xs-12 col-data">{{ coinCurrency }}<br /><strong class="title">{{ symbol }} {{ price }}</strong><br>
    </div>
{{/if}}