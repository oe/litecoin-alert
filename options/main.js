function submitLTC(tradeAmount,price,pwd,isBuy){
	// if(check == 2){
	// 	return;
	// }
	// var tradeCnyPrice =document.getElementById("tradeCnyPrice").value;
	// var tradePwd = trim(document.getElementById("tradePwd").value);
	// var tradeType = document.getElementById("tradeType").value;
	// var symbol = document.getElementById("symbol").value;
	// tradeType: 0 买, 1卖
	// symbol: 0 btc,1 ltc
	var url = "https://www.okcoin.com";
	if(isBuy){
		url += "/trade/buyBtcSubmit.do?random="+Math.round(Math.random()*100);
	}else{
		url += "/trade/sellBtcSubmit.do?random="+Math.round(Math.random()*100);
	}
	var param={tradeAmount:tradeAmount,tradeCnyPrice:price,tradePwd:pwd,symbol:1};
	jQuery.post( url, {
			tradeAmount: tradeAmount,
			tradeCnyPrice: price,
			tradePwd: pwd,
			symbol: 1
		},
		function(data){
			var result = eval('(' + data + ')');
			if(result!=null){
				if(result.resultCode == 0){
					alert('交易提交成功!');
				}else if(result.resultCode == -1){
					 if(isBuy){
						 if(symbol==1) alert("最小购买数量为：0.1LTC！");
						 else alert("最小购买数量为：0.01BTC！");
					 }else{
						 if(symbol==1) alert("最小卖出数量为：0.1LTC！");
						 else alert("最小卖出数量为：0.01BTC！");
					 }
				 }else if(result.resultCode == -2){
					 if(result.errorNum == 0){
						 alert("交易密码错误五次，请2小时后再试！");
					 }else{
						 alert("交易密码不正确！您还有"+result.errorNum+"次机会");
					 }
				 }else if(result.resultCode == -3){
					 alert("出价不能为0！");
				 }else if(result.resultCode == -4){
					 alert("余额不足！");
				 }else if(result.resultCode == -5){
					 alert("您未设置交易密码，请设置交易密码。");
				 }else if(result.resultCode == -6){
					 alert("您输入的价格与最新成交价相差太大，请检查是否输错");
				 }else if(result.resultCode == -7){
					 alert("交易密码免输超时，请刷新页面输入交易密码后重新激活。");
				 }else if(result.resultCode == -8){
					 alert("请输入交易密码");
				 }else if(result.resultCode == 2){
					 alert("账户出现安全隐患已被冻结，请尽快联系客服。");
				 }
			}
		}
	);
}