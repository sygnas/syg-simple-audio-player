(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sygnas/audio-src')) :
	typeof define === 'function' && define.amd ? define(['@sygnas/audio-src'], factory) :
	(global['syg-simple-audio-player'] = factory(global.AudioSrc));
}(this, (function (AudioSrc) { 'use strict';

AudioSrc = AudioSrc && AudioSrc.hasOwnProperty('default') ? AudioSrc['default'] : AudioSrc;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * オーディオ再生・停止だけを管理するボタン
 *
 * @author   Hiroshi Fukuda <info.sygnas@gmail.com>
 * @license  MIT
 */

var _class = function () {
  /**
   * コンストラクタ
   * @param {Object} config インスタンス設定。this.defaults 参照
   */
  function _class(target, audio, config) {
    _classCallCheck(this, _class);

    // ターゲットボタンの data-audio-status属性に入れる状態
    this.STATE_PLAY = 'play';
    this.STATE_PAUSE = 'pause';
    this.STATE_STOP = 'stop';

    // デフォルト設定
    var defaults = {
      // オーディオソースを指定する属性
      attr_src: 'data-audio-src',
      // 状態を格納する属性
      attr_status: 'data-audio-status',
      // ソースのタイプを指定する属性 {file / hds / hls / mse}
      attr_type: 'data-audio-type',

      // 以下、syg-audio-src の設定
      hds: {
        protcol: 'http://',
        playlist: '/manifest.f4m'
      },
      hls: {
        protcol: 'http://',
        playlist: '/playlist.m3u8'
      },
      mse: {
        protcol: 'http://',
        playlist: '/manifest.mpd',
        autoplay: false
      }
    };
    // 設定反映
    this.opt = Object.assign(defaults, config);

    // 再生中か
    this.is_playing = false;
    // 現在再生中のボタンエレメント
    this.now_playing_btn = null;
    // ボタンエレメント
    this.targets = document.querySelectorAll(target);
    // オーディオソース
    this.audio_src = new AudioSrc({
      hds: this.opt.hds,
      hls: this.opt.hls,
      mse: this.opt.mse
    });
    // イベント設定
    this.$_init_event();
  }

  /**
   * 停止
   */


  _createClass(_class, [{
    key: 'stop',
    value: function stop() {
      this.$_stop();
    }

    /**
     * private
     */

    /**
     * イベント設定
     */

  }, {
    key: '$_init_event',
    value: function $_init_event() {
      var _this = this;

      // ボタンのイベント
      get_node_array(this.targets).forEach(function (elm) {
        elm.addEventListener('click', _this.$_on_btn_click.bind(_this));
      });
      // 再生終了イベント
      this.audio_src.audio.addEventListener('ended', this.$_stop.bind(this));
    }

    /**
     * ボタンをクリックした
     * @param {Event} ev クリックイベント
     */

  }, {
    key: '$_on_btn_click',
    value: function $_on_btn_click(ev) {
      ev.preventDefault();

      // now_playing_btn とクリックされたボタンが同一なら一時停止
      if (ev.target === this.now_playing_btn) {
        this.$_pause(ev.target);
      } else {
        this.$_play_new(ev.target);
      }
    }

    /**
     * 停止
     */

  }, {
    key: '$_stop',
    value: function $_stop() {
      this.audio_src.audio.pause();
      this.audio_src.audio.currentTime = 0;
      // ステータスを変更
      this.$_change_state(this.STATE_STOP, this.now_playing_btn);
      // 再生中ボタンの変更
      this.now_playing_btn = null;
    }

    /**
     * 一時停止・再開
     * @param {HTMLElement} target クリックしたボタン
     */

  }, {
    key: '$_pause',
    value: function $_pause(target) {
      if (this.is_playing) {
        this.audio_src.audio.pause();
        this.$_change_state(this.STATE_PAUSE, target);
      } else {
        this.audio_src.audio.play();
        this.$_change_state(this.STATE_PLAY, target);
      }
    }

    /**
     * 再生
     * @param {HTMLElement} target クリックしたボタン
     */

  }, {
    key: '$_play_new',
    value: function $_play_new(target) {
      var opt = this.opt;
      var audio_src = this.audio_src;

      // 既に再生していたら止める
      if (this.now_playing_btn) {
        audio_src.audio.pause();
        this.$_change_state(this.STATE_STOP, this.now_playing_btn);
      }

      // オーディオソースURL
      var url = target.getAttribute(opt.attr_src);
      // ソースタイプ
      var type = target.getAttribute(opt.attr_type);

      // ・data-audio-type属性が file だったら非ストリーミング
      // ・上記属性が null で、サポート環境チェックが問題なければ
      //   ストリーミング種別自動判定
      // ・hds / hls / mse を指定したストリーミング
      // ・それ以外はエラー
      if (type === audio_src.TYPE_FILE) {
        audio_src.set_src(url, audio_src.TYPE_FILE);
      } else if (type === null && this.audio_src.check_support()) {
        audio_src.set_src(url);
      } else if (type === audio_src.TYPE_HDS || type === audio_src.TYPE_HLS || type === audio_src.TYPE_MSE) {
        audio_src.set_src(url, type);
      } else {
        var err = new Error();
        err.message = 'not supported type.';
        throw err;
      }

      // ソースをロードして再生
      audio_src.audio.load();
      audio_src.audio.play();

      // 再生中ボタンの変更
      this.now_playing_btn = target;
      // ステータスを変更
      this.$_change_state(this.STATE_PLAY, target);
    }

    /**
     * 任意のエレメントのステータスを変更
     * @param {String} state ステータス。this.STATE_PLAY などが入る
     * @param {HTMLElement} elm 対象となるボタン
     */

  }, {
    key: '$_change_state',
    value: function $_change_state(state, elm) {
      if (state === this.STATE_PLAY) {
        this.is_playing = true;
      } else if (state === this.STATE_PAUSE || state === this.STATE_STOP) {
        this.is_playing = false;
      }

      if (elm) {
        elm.setAttribute(this.opt.attr_status, state);
      }
    }
  }]);

  return _class;
}();

function get_node_array(node_list) {
  return Array.prototype.slice.call(node_list, 0);
}

return _class;

})));
//# sourceMappingURL=simple-audio-player.js.map
