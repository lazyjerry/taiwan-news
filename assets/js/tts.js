(function () {
  if (!window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  let utterance = null;
  let paused = false;

  const widget = document.createElement('div');
  widget.id = 'tts-bar';
  widget.innerHTML = '<button id="tts-play">&#9654; 朗讀</button><button id="tts-stop" hidden>&#9632; 停止</button>';
  document.body.appendChild(widget);

  const playBtn = document.getElementById('tts-play');
  const stopBtn = document.getElementById('tts-stop');

  function getText() {
    const el = document.querySelector('.post-content, main article, main');
    return el ? el.innerText.trim() : '';
  }

  function start() {
    const text = getText();
    if (!text) return;
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1;
    utterance.onend = reset;
    synth.speak(utterance);
    playBtn.textContent = '⏸ 暫停';
    stopBtn.hidden = false;
    paused = false;
  }

  function reset() {
    playBtn.innerHTML = '&#9654; 朗讀';
    stopBtn.hidden = true;
    paused = false;
    utterance = null;
  }

  playBtn.addEventListener('click', function () {
    if (paused) {
      synth.resume();
      playBtn.textContent = '⏸ 暫停';
      paused = false;
    } else if (synth.speaking) {
      synth.pause();
      playBtn.textContent = '&#9654; 繼續';
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
