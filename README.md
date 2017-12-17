# syg-simple-audio-player

Play and stop only audio player.
再生と停止だけのオーディオプレイヤー。

## Description

試聴ボタンなどで使う。<br>
「再生だけできて、アクティブ状態を持たせられればいい」というだけのオーディオプレイヤー。

ストリーミング、非ストリーミング両対応。

## Install
```sh
npm install syg-simple-audio-player
```

## Usage

### HTML

```html
<!-- 非ストリーミング -->
<button class="js-audio btn-audio" data-audio-src="foo.mp3" data-audio-type="file">Sound 1</button>
<button class="js-audio btn-audio" data-audio-src="bar.mp3" data-audio-type="file">Sound 2</button>

<!--
ストリーミング
HDS/HLS/MSE形式のストリーミングを自動判別する
下記のファイルが存在する想定。
HDS形式：http://stm.foo.bar/abcd1234.mp4/manifest.f4m
HLS形式：http://stm.foo.bar/abcd1234.mp4/playlist.m3u8
MSE形式：http://stm.foo.bar/abcd1234.mp4/manifest.mpd
-->
<button class="js-audio btn-audio" data-audio-src="stm.foo.bar/abcd1234.mp4">ストリーミング</button>

<!-- 停止ボタン -->
<p><button class="js-audio-stop">停止</button></p>
```

### CSS
```css
.btn-audio[data-audio-status = "play"]{
  background-color: #b8860b;
}
.btn-audio[data-audio-status = "pause"]{
  background-color: #73d8ff;
}
```

### Javascript
```JavaScript
import AudioPlayer from 'syg-simple-audio-player';

// .js-audio をクリックすると data-audio-src属性で指定された音声データを再生する
const audio_player = new AudioPlayer('.js-audio');

// 停止ボタン
document.querySelector('.js-audio-stop')
  .addEventListener('click', () => {
    audio_player.stop();
  });
```

## Attributes

再生する音声データのURL、音声データタイプ、ステータスなどをボタンの data属性に格納している。

### data-audio-src
再生する音声データのURL。<br>
ストリーミングの場合はURLの一部を指定する。

例：`http://stm.foo.bar/abcd1234.mp4/manifest.f4m`<br>
→ `stm.foo.bar/abcd1234.mp4`

### data-audio-type
音声データのタイプを指定する。

| 値 | 備考 |
| ---- | --- |
| file | 非ストリーミングの場合は必ず記入 |
| hls | HLS形式 |
| hds | HDS形式 |
| mse | MSE形式 |
| 無指定 | HLS / HDS / MSE を自動選択する |

### data-audio-status
再生・一時停止などの状態が格納される。

| 値 | 備考 |
| ---- | --- |
| play | 再生中 |
| pause | 一時停止 |
| stop | 停止 |
| 属性が存在しない | 停止。デフォルト状態 |

```html
<!-- foo.mp3 を再生しているので、 data-audio-status="play" になっている -->
<button data-audio-src="foo.mp3" data-audio-type="file" data-audio-status="play">foo</button>

<!-- http://stm.foo.bar/abcd1234.mp4/manifest.f4m をストリーミング再生 -->
<!-- ストリーミング形式は自動選択したいので data-audio-type は無指定 -->
<button data-audio-src="stm.foo.bar/abcd1234.mp4">ストリーミング</button>
```

## Options

```JavaScript
const audio_player = new AudioPlayer('.js-audio', {config});
```

### デフォルト設定
```JavaScript
const defaults = {
  attr_src: 'data-audio-src',
  attr_status: 'data-audio-status',
  attr_type: 'data-audio-type',
  // 以下、syg-audio-src の設定
  hds: {
    protcol: 'http://',
    playlist: '/manifest.f4m',
  },
  hls: {
    protcol: 'http://',
    playlist: '/playlist.m3u8',
  },
  mse: {
    protcol: 'http://',
    playlist: '/manifest.mpd',
    autoplay: false,
  },
};
```

| パラメータ | デフォルト | 備考 |
| ---- | ---- | ---- |
| attr_src | 'data-audio-src' | オーディオソースを指定する属性の名前 |
| attr_status | 'data-audio-status' | 状態を格納する属性の名前 |
| attr_type | 'data-audio-type' | ソースのタイプを指定する属性の名前 |
| hds / hls / mse |  | [syg-audio-src](https://github.com/sygnas/syg-audio-src) のパラメータを参照 |


## Property

### is_playing {Boolean}
再生中なら `true`。

### now_playing_btn {HTMLElement}
現在再生中のエレメント。

### targets {NodeList}
対象のエレメント

### audio_src {syg-audio-src}
ストリーミングに対応したHTML5 Audioソース管理。


## Methods

### stop()
現在再生している音声を停止する。<br>
`audio.currentTime = 0;` をしている。




## License
MIT