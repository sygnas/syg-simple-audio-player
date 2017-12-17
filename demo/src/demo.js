
import AudioPlayer from '../../dist/syg-simple-audio-player.es';

const audio_player = new AudioPlayer('.js-audio');

// 停止ボタン
document.querySelector('.js-audio-stop')
  .addEventListener('click', () => {
    audio_player.stop();
  });
