
function saveData () {
	var inputs = document.querySelectorAll('input'),
		tip = document.getElementById('tip'),
		len = inputs.length,
		val,
		listener = {};
	// console.log('clicked...');
	while (len--) {
		val = inputs[len].value || 0;
		val = +val;
		if (isNaN(val)) {
			setTip(inputs[len].name + '错误');
			return;
		}
		listener[ inputs[len].name ] = val;
	}
	// console.log('save %o',listener);
	localStorage.listener = JSON.stringify(listener);
	setTip('保存成功');
}

function setTip (msg) {
	var tip = document.getElementById('tip');
	clearTimeout(setTip.timeId);
	tip.innerText = msg;
	setTip.timeId = setTimeout(function() {
		tip.innerText = '';
	}, 2000);
}

function setValues (data) {
	var inputs = document.querySelectorAll('input'),
		len = inputs.length,
		val;
	while (len--) {
		inputs[len].value = data[ inputs[len].name ] || 0;
	}
}

document.getElementById('save').addEventListener('click',saveData,false);
(function () {
	setValues( JSON.parse(localStorage.listener || '{}') );
	$.ajax({
		url: 'http://www.okcoin.com/api/ticker.do?symbol=ltc_cny',
		dataType: 'json',
		success: function (res) {
			document.getElementById('price').innerText = ' ￥' + res.ticker.last;
		},
		error: function () {
			document.getElementById('price').innerText = '网络出错';
		}
	});
})();
