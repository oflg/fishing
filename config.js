//加载一个包含单词以及模板的全局config对象
//日语
//资源根路径 http://ecator.github.io/anki-theme-hjbasic/
var config={
	tpl:{
		front:"<div onclick=\"window.event.cancelBubble = true\" class=\"word front\">{{word}}</div>",
		back:"<div class=\"transition\"></div><div class=\"adjuster\"></div><div class=\"word back\" id=\"word\">{{word}}</div><div class=\"phonetic\">{{phonetic}}</div><img id=\"playButton\"><div class=\"trans\">{{trans}}</div>"
	},
	//语言设置
	//日语
	jp:{
		words:new Array("暗記","日本語","こんにちは"),
		phonetics:new Array("あんき","にほんご","こんにちは"),
		trans:new Array("背诵","日语","你好")
	},
	//德语
	de:{
		words:new Array("Deutsch","Hallo"),
		phonetics:new Array("",""),
		trans:new Array("德语","你好")
	},
	//英语
	en:{
		words:new Array("english","hello"),
		phonetics:new Array("ɪŋɡlɪʃ","hə'ləʊ"),
		trans:new Array("英语","你好")
	},
	//法语
	fra:{
		words:new Array("française","Bonjour"),
		phonetics:new Array("frɑ̃sɛ","bɔ̃ʒu:r"),
		trans:new Array("法语","你好")
	},
	//韩语
	kor:{
		words:new Array("한국어","오빠"),
		phonetics:new Array("",""),
		trans:new Array("韩语","你好")
	},
	//西班牙语
	spa:{
		words:new Array("España","testigo"),
		phonetics:new Array("",""),
		trans:new Array("西班牙语","你好")
	},
	//阿拉伯语
	ara:{
		words:new Array("عربي","مرحبا"),
		phonetics:new Array("",""),
		trans:new Array("阿拉伯语","你好")
	},
	//俄语
	ru:{
		words:new Array("русский","Привет"),
		phonetics:new Array("",""),
		trans:new Array("俄语","你好")
	},
	//葡萄牙语
	pt:{
		words:new Array("Português","Olá"),
		phonetics:new Array("",""),
		trans:new Array("葡萄牙语","你好")
	},
	//泰语
	th:{
		words:new Array("ภาษาไทย","สวัสดี"),
		phonetics:new Array("",""),
		trans:new Array("泰语","你好")
	},
	//粤语
	cte:{
		words:new Array("广东话","你好"),
		phonetics:new Array("",""),
		trans:new Array("粤语","你好")
	}
}