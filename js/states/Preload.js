// Preload.js

var Vent = Vent || {};

var h1_style, h2_style, h3_style, p_style, p_style_center, buttonStyle;
var audioData = new Object;

// constant colours
var noColour = 0xffffff,
	isDownColour = 0xf6d809,
	defaultColour = noColour, // 0xfc6744;
	groundColour = 0x646A11;

//loading the game assets
Vent.Preload = function() {};

Vent.Preload.prototype = {
	preload: function() {

		createBG(0x000000);

		// show logo in loading screen
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		this.splash.scale.set(0.5);

		// add preloader
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		// Images
		// fpo
		this.load.image('fpo-square', 'assets/img/fpo-square.gif');
		this.load.image('fpo-circle', 'assets/img/fpo-circle.png');
		this.load.image('square', 'assets/img/white-square.gif');
		this.load.image('circle', 'assets/img/white-circle.png');

		// wordmark
		this.load.image('wordmark', 'assets/img/wordmark.png');

		// animations
		this.load.spritesheet('pitcher', 'assets/img/pitcher.png', 131, 150, 14);

		// sprites			
		// particles
		this.load.image('smoke1', 'assets/img/particles/smoke-1.png');
		this.load.image('smoke2', 'assets/img/particles/smoke-2.png');
		this.load.image('smoke3', 'assets/img/particles/smoke-3.png');
		this.load.image('wood1', 'assets/img/particles/splinter1.png');
		this.load.image('wood2', 'assets/img/particles/splinter2.png');
		this.load.image('wood3', 'assets/img/particles/splinter3.png');
		this.load.image('wood4', 'assets/img/particles/splinter4.png');
		this.load.image('dirt', 'assets/img/particles/dirt.png');
		this.load.image('dirt2', 'assets/img/particles/dirt2.png');

		this.load.image('ball', 'assets/img/baseball.png');
		this.load.image('bat', 'assets/img/bat.png');
		this.load.image('field', 'assets/img/bg-field2.jpg');
		this.load.image('wave', 'assets/img/touchwave.png');

		// icons & emojis
		this.load.image('emoji1', 'assets/img/i/emoji1.png');
		this.load.image('emoji2', 'assets/img/i/emoji2.png');
		this.load.image('emoji3', 'assets/img/i/emoji3.png');
		this.load.image('emoji4', 'assets/img/i/emoji4.png');
		this.load.image('icon-phone', 'assets/img/i/phone.png');
		this.load.image('icon-chat', 'assets/img/i/chat.png');
		this.load.image('icon-baseball', 'assets/img/i/baseball.png');
		this.load.image('icon-x', 'assets/img/i/x.png');
		this.load.image('icon-note', 'assets/img/i/note.png');
		this.load.image('icon-speaker', 'assets/img/i/speaker.png');
		this.load.image('icon-expand', 'assets/img/i/expand.png');
		this.load.image('icon-contract', 'assets/img/i/contract.png');

		// Audio        
		// Firefox doesn't support mp3 files, so use ogg
		this.load.audio('hit1', ['assets/audio/bat_hit_ball.mp3', 'assets/audio/bat_hit_ball.ogg']);
		this.load.audio('hit2', ['assets/audio/Homerun Baseball Hit.mp3', 'assets/audio/Homerun Baseball Hit.ogg']);
		this.load.audio('hit3', ['assets/audio/hitting-3.mp3', 'assets/audio/hitting-3.ogg']);
		this.load.audio('hit4', ['assets/audio/hitting-2.mp3', 'assets/audio/hitting-2.ogg']);
		this.load.audio('hit5', ['assets/audio/hitting-1.mp3', 'assets/audio/hitting-1.ogg']);
		this.load.audio('cheer', ['assets/audio/cheer-1.mp3', 'assets/audio/cheer-1.ogg']);
		this.load.audio('swing', ['assets/audio/swing.mp3', 'assets/audio/swing.ogg']);

		// Webfonts
		// The Google WebFont Loader will look for this object, so create it before loading the script.
		WebFontConfig = {
			//  'active' means all requested fonts have finished loading
			//  We set a 1 second delay before calling 'createText'.
			//  For some reason if we don't the browser cannot render the text the first time it's created.
			active: function() {
				Vent.game.time.events.add(Phaser.Timer.SECOND, createText, this);
			},
			//  The Google Fonts we want to load (specify as many as you like in the array)
			google: {
				families: ['Open+Sans:300,400,700:latin']
			}
		};
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		createStyles(); // set Title, body styles for project
	},
	create: function() {

		this.state.start('MainMenu');
	}
};

function createText() {
	// do nothing
}

function createStyles() {

	var black = "#000";
	var white = "#fff";

	h1_style = {
		font: "700 50px Open Sans",
		fill: white,
		align: "center"
	};
	h2_style = {
		font: "300 40px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style = {
		font: "300 25px Open Sans",
		fill: white,
		align: "center"
	};
	h3_style_blue = {
		font: "300 25px Open Sans",
		fill: "#4ac7eb",
		align: "center"
	};
	h3_style_bold = {
		font: "700 25px Open Sans",
		fill: white,
		align: "center"
	};
	p_style = {
		font: "300 20px Open Sans",
		fill: white
	};
	p_style_center = {
		font: "300 20px Open Sans",
		fill: white,
		align: "center"
	};
	copyright_style = {
		font: "300 10px Open Sans",
		fill: "#938884",
		align: "right"
	};
	button_style = {
		font: "400 16px Open Sans",
		fill: white,
		align: "center"
	};
	touch_button_style = {
		font: "400 22px Open Sans",
		fill: black,
		align: "center"
	};
}