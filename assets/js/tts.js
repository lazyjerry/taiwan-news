(function () {
  var widget = document.createElement('div');
  widget.id = 'tts-bar';
  widget.innerHTML = '<button id="tts-play">&#9654; 朗讀</button><button id="tts-stop" hidden>&#9632; 停止</button>';
  document.body.appendChild(widget);

  var playBtn = document.getElementById('tts-play');
  var stopBtn = document.getElementById('tts-stop');

  var synth = window.speechSynthesis;
  if (!synth) {
    playBtn.disabled = true;
    playBtn.style.opacity = '0.4';
    playBtn.title = '此瀏覽器不支援語音朗讀';
    return;
  }

  var utterance = null;
  var paused = false;

  function getText() {
    var el = document.querySelector('.post-content') ||
             document.querySelector('main article') ||
             document.querySelector('main');
    return el ? el.innerText.trim() : '';
  }

  function reset() {
    playBtn.innerHTML = '&#9654; 朗讀';
    stopBtn.hidden = true;
    paused = false;
    utterance = null;
  }

  function start() {
    var text = getText();
    if (!text) return;
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1;
    utterance.onend = reset;
    synth.speak(utterance);
    playBtn.innerHTML = '&#9646;&#9646; 暫停';
    stopBtn.hidden = false;
    paused = false;
  }

  playBtn.addEventListener('click', function () {
    if (paused) {
      synth.resume();
      playBtn.innerHTML = '&#9646;&#9646; 暫停';
      paused = false;
    } else if (synth.speaking) {
      synth.pause();
      playBtn.innerHTML = '&#9654; 繼續';
      paused = true;
    } else {
      start();
    }
  });

  stopBtn.addEventListener('click', function () {
    synth.cancel();
    reset();
  });

  window.addEventListener('beforeunload', function () {
    synth.cancel();
  });
})();
