//页面加载完毕后加载本文件
showFront()
//自动填充标题和h1为模板名称
var titleMap={
	"en":"BaiduPlay-en：英语",
	"jp":"BaiduPlay-jp：日语",
	"fra":"BaiduPlay-fra：法语",
	"kor":"BaiduPlay-kor：韩语",
	"de":"BaiduPlay-de：德语",
	"spa":"BaiduPlay-spa：西班牙语",
	"ara":"BaiduPlay-ara：阿拉伯语",
	"ru":"BaiduPlay-ru：俄语",
	"pt":"BaiduPlay-pt：葡萄牙语",
	"th":"BaiduPlay-th：泰语",
	"cte":"BaiduPlay-cte：粤语"
}
document.title=titleMap[language]
document.getElementsByTagName("h1")[0].innerText=document.title