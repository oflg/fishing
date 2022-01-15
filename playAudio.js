//播放音频函数，需要传入音频地址
function playAudio(audioSrc) {
	// alert(audioSrc)
	//尝试获取语速
	var spd = document.getElementById('spd')
	// console.log(spd)
	spd = spd ? spd.value : '3'
	audioSrc += "&spd=" + spd
	var player = new Audio(audioSrc)
	player.play()
}