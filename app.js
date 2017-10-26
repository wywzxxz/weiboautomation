function sleep(time)
{
	return new Promise(
		function (resolve,reject)
		{
			setTimeout(()=>resolve(),time);
		}
	);
}

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({headless:false});
	const page = await browser.newPage();
	await page.goto('https://web.wechat.com/');
	await sleep(10000);
	//等待登陆
	do
	{
		await sleep(10000);
		var find=await page.evaluate(function(){
			var a=document.evaluate("//a[text()='发送']",document,null,XPathResult.ANY_TYPE,null).iterateNext();
			console.log(a);
			return a!=null;
		});
		if (find) break;
	}while (true);
	
	console.log("loged in");
	//获取姓名
	var me=await page.$eval(".display_name",(div)=>div.innerHTML);
	console.log("ME:",me);
	//监听消息
	while (true)
	{
		await sleep(1000);
		var msg=await page.evaluate(function(){
			var ret=[];
			var dd=$(".message");
			for (var i=0;i<dd.length;++i)
			{
				var msg=dd[i];
				ret.push({
					who:$(msg).find(".avatar").attr("title")
					,text:$(msg).find(".js_message_plain").text()
				})
				
			}
			dd.remove();
			return ret;
		});
		msg.forEach(async function(msg)
		{
			//if (msg.who==me) return;
			//发送消息
			if (msg.text=="小Q")
			{
				var ea=await page.$("#editArea");
				ea.focus();
				await page.keyboard.type("略略略,小Q会复述以'小Q'开头的话.   ---本周五晚8点理工陪二楼，微信机器人专场哦",50);
				await sleep(1000);
				await page.keyboard.press("Enter");
				await page.click(".btn_send");
			}else
			if (msg.text.indexOf("小Q")==0)
			{
				var ea=await page.$("#editArea");
				ea.focus();
				await page.keyboard.type("_小Q:略略略,"+msg.text,50);
				await sleep(1000);
				await page.keyboard.press("Enter");
				await page.click(".btn_send");
			}
		});
		console.log(msg);
	}
  //await browser.close();
})();