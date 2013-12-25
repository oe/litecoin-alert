var priceArr = [],
	MAXLEN = 20,
	MAXGAP = 5;
	listener = JSON.parse( localStorage.listener || '{"rate": 0.04,"high": 234,"low": 200}' );
	if (!localStorage.listener) {
		localStorage.listener = JSON.stringify(listener);
	}

function showNotice (content) {
	var notification = webkitNotifications.createNotification(
                '/img/icon48.png',
                '提醒!!',
                content
        );
    notification.show();
}

function getPrice () {
	$.ajax({
		url: 'http://www.okcoin.com/api/ticker.do?symbol=ltc_cny',
		dataType: 'json',
		success: function (res) {
			var price = +res.ticker.last,
				old,tmp,
				max = Math.max.apply(null,priceArr),
				min = Math.min.apply(null,priceArr);
			if (Math.abs(price - min) > Math.abs(price - max)) {
				tmp = price - min;
			} else {
				tmp = price - max;
			}
			tmp = tmp.toFixed(2);
			priceArr.push(price);
			if (priceArr.length > MAXLEN) {
				priceArr.shift();
			}
			if (isFinite(tmp) && listener.rate && (Math.abs(tmp / old) >= listener.rate) ) {
				if (tmp > 0) {
					showNotice('2分钟内莱特币涨幅达到警戒了,上涨￥' + tmp + ',最新成交价￥' + price + ';2分钟内最高价为￥' +
						max + ',最低价为￥' + min );
					listener.high = price + 4;
					if (listener.high - listener.low >= MAXGAP) {
						listener.low = listener.high - MAXGAP;
					}
				} else {
					showNotice('2分钟内莱特币跌幅达到警戒了,下跌￥' + tmp + ',最新成交价￥' + price + ';2分钟内最高价为￥' +
						max + ',最低价为￥' + min );
					listener.low = price - 4;
					if (listener.high - listener.low >= MAXGAP) {
						listener.high = listener.low + MAXGAP;
					}
				}
			} else if (listener.high && (price >= listener.high) ) {
				showNotice('莱特币价格涨到' + price + '了!');
				listener.high = price + 2;
				if (listener.high - listener.low >= MAXGAP) {
					listener.low = listener.high - MAXGAP;
				}
			} else if (listener.low && (price <= listener.low) ) {
				showNotice('莱特币价格跌倒' + price + '了!');
				listener.low = price - 2;
				if (listener.high - listener.low >= MAXGAP) {
					listener.high = listener.low + MAXGAP;
				}
			}
			localStorage.listener = JSON.stringify(listener);
		},
		error: function (res) {
			if ( !getPrice.noticed ) {
				getPrice.noticed = true;
				showNotice('OKCOIN宕了,无法获取最新价格!');
			}
		}
	})
}

setInterval(getPrice, 5000);

window.addEventListener("storage", function  (event){
	if (event.key == 'listener') {
		listener = JSON.parse(event.newValue || '{}');
		getPrice.noticed = false;
	}
});