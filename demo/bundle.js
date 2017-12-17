/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_syg_simple_audio_player_es__ = __webpack_require__(1);



var audio_player = new __WEBPACK_IMPORTED_MODULE_0__dist_syg_simple_audio_player_es__["a" /* default */]('.js-audio');

// 停止ボタン
document.querySelector('.js-audio-stop').addEventListener('click', function () {
  audio_player.stop();
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * HDSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hds(audio) {
  return audio.canPlayType('application/f4m+xml') === 'maybe';
}

/**
 * HLSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hls(audio) {
  return audio.canPlayType('application/vnd.apple.mpegURL') === 'maybe';
}

/** ************
 * MediaSourceExtensionに対応しているか
 * @return {Boolean} true : OK / false / NG
 */
/* eslint no-void:["off"] */

function is_support_mse() {
  var hasWebKit = window.WebKitMediaSource !== null && window.WebKitMediaSource !== void 0;
  var hasMediaSource = window.MediaSource !== null && window.MediaSource !== void 0;
  return hasWebKit || hasMediaSource;
}

var _createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * ユーザー環境をチェックして、HDS / HLS / dash.js のソースを HTML5 Audio にセットする
 * MPEG-DASHを使う場合は dash.js が必要。
 *
 *
 * @author   Hiroshi Fukuda <info.sygnas@gmail.com>
 * @license  MIT
 */

/* globals dashjs */

var _class$2 = function () {
  /**
   * コンストラクタ
   * @param {Object} config インスタンス設定。this.defaults 参照
   */
  function _class(config) {
    _classCallCheck$1(this, _class);

    // オーディオソースのタイプ定数
    this.TYPE_HDS = 'hds';
    this.TYPE_HLS = 'hls';
    this.TYPE_MSE = 'mse';
    this.TYPE_FILE = 'file';

    // デフォルト設定
    var defaults = {
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

    this.audio = new Audio(); // HTML5 Audio
    this.dash_player = null; // dash.js のインスタンス
    this.is_support_hds = false; // HDSを再生できるか
    this.is_support_hls = false; // HLSを再生できるか
    this.is_support_mse = false; // MedisSourceExtensionに対応しているか
    this.now_type = null; // ソースとして設定されたタイプ。TYPE_HDS ... TYPE_FILE などが入る
  }

  /**
   * サポート環境チェック
   * @return {Boolean} true: チェック完了 / false: 対象外環境
   */

  _createClass$1(_class, [{
    key: 'check_support',
    value: function check_support() {
      try {
        this.is_support_hds = is_can_play_hds(this.audio); // HDSを再生できるか
        this.is_support_hls = is_can_play_hls(this.audio); // HLSを再生できるか
        this.is_support_mse = is_support_mse(this.audio); // MedisSourceExtensionに対応しているか
      } catch (e) {
        return false;
      }
      return true;
    }

    /**
     * オーディオソースを渡してHTML5 Audioにセットする
     * @param {String} url
     * mp3/ogg など非ストリーミングの場合はファイルのURL。
     * ストリーミングの場合は http://{この部分}//manifest.f4m をベースURLとして渡す
     * @param {String} type
     * タイプを指定したい時は TYPE_HDS などを渡す。
     * 非ストリーミングの場合は TYPE_FILE を必ず渡す。
     */

  }, {
    key: 'set_src',
    value: function set_src(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (type === this.TYPE_FILE) {
        return this.$_set_src_file(url);
      } else if (type === this.TYPE_HLS) {
        return this.$_set_src_hls(url);
      } else if (type === this.TYPE_HDS) {
        return this.$_set_src_hds(url);
      } else if (type === this.TYPE_MSE) {
        return this.$_set_src_mse(url);
      } else if (this.is_support_hls) {
        return this.$_set_src_hls(url);
      } else if (this.is_support_hds) {
        return this.$_set_src_hds(url);
      } else if (this.is_support_mse) {
        return this.$_set_src_mse(url);
      }
      return false;
    }

    /**
     * private
     */

    /**
     * 非ストリーミングでセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_file',
    value: function $_set_src_file(url) {
      this.audio.src = url;
      this.now_type = this.TYPE_FILE;
      return true;
    }
    /**
     * HLS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hls',
    value: function $_set_src_hls(url) {
      if (!this.is_support_hls) return false;

      this.audio.src = this.opt.hls.protcol + url + this.opt.hls.playlist;
      this.now_type = this.TYPE_HLS;
      return true;
    }
    /**
     * HDS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hds',
    value: function $_set_src_hds(url) {
      if (!this.is_support_hds) return false;

      this.audio.src = this.opt.hds.protcol + url + this.opt.hds.playlist;
      this.now_type = this.TYPE_HDS;
      return true;
    }
    /**
     * MSE形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_mse',
    value: function $_set_src_mse(url) {
      if (!this.is_support_mse) return false;

      // dash.js を使う
      this.now_type = this.TYPE_MSE;
      var src = this.opt.mse.protcol + url + this.opt.mse.playlist;

      if (this.dash_player === null) {
        this.dash_player = dashjs.MediaPlayer().create();
        this.dash_player.initialize(this.audio, src, this.opt.mse.autoplay);
      } else {
        this.dash_player.attachSource(src);
      }
      return true;
    }
  }]);

  return _class;
}();

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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
    this.audio_src = new _class$2({
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

/* harmony default export */ __webpack_exports__["a"] = (_class);
//# sourceMappingURL=syg-simple-audio-player.es.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);