// Utility.js holds utility functions

// Common.js holds utility functions & settings

// VARIABLES ***********************************************

var settings = {
	"NAME": "Vent It Baseball",

	"WIDTH": 500,
	"HEIGHT": undefined,
	"RATIO": window.outerHeight / window.outerWidth,
	"RATIO_MIN": 1.1,
	"RATIO_MAX": 1.4,

	"PAUSED": false,

	"GA_CODE": "UA-66839321-1",
	"ANALYTICS_ON": false,

	"SOUND_ON": true,
	"VOLUME": 1,

	"FULLSCREEN": false,

	"CONTAINER": "game",
	"FRAME": document.getElementById("game"),
	"ELEMENT": document.querySelector('#game'),
	"FRAME_WIDTH": Number(window.getComputedStyle(document.querySelector('#game')).width.replace(/\D/g, '')),
	"FRAME_HEIGHT": Number(window.getComputedStyle(document.querySelector('#game')).height.replace(/\D/g, ''))
};

if (settings.RATIO <= settings.RATIO_MIN) {
	settings.RATIO = settings.RATIO_MIN; // shortest is 550px
}else if(settings.RATIO > settings.RATIO_MAX){
	settings.RATIO = settings.RATIO_MAX; // tallest is 800px, 
}

settings.HEIGHT = settings.RATIO * settings.WIDTH;

var copyright_txt = "© BroTalk",
	release_txt = "Release Candidate | Sept.1.2015";

trace(settings.NAME + " | " + release_txt);


// FUNCTIONS ***********************************************

function trace(s, c, bg) {
	var style;
	if (bg === undefined) bg = 'WhiteSmoke';
	if (c !== undefined) {
		style = 'background: ' + bg + '; color: ' + c + '; border-left: 7px solid ' + c + ';';
	} else {
		c = '#333';
		style = 'background: ' + bg + '; color: ' + c + ';';
	}
	console.log('%c ' + s + ' ', style);
}

function createBG(color, bg) {
	bg_group = Vent.game.add.group();

	if (!bg) {
		var bg = Vent.game.add.graphics(0, 0);
	}
	bg.inputEnabled = true;
	bg.beginFill(color, 1);
	bg.boundsPadding = 0;
	bg.drawRect(0, 0, Vent.game.width, Vent.game.height);
	bg_group.add(bg);

	var st = Vent.game.state.getCurrentState().key;

	if (st != "Preload" /*&& st != "MainMenu"*/ ) {
		var bg_image = Vent.game.add.sprite(0, 0, "field");
		bg_image.width = Vent.game.width;
		bg_image.height = Vent.game.height;
		// bg_image.tint = color;
		bg_image.alpha = 0.4;
	}
}

function createBt(button, label_text, target_state, shape, iconImage) {

	if (!label_text) label_text = "";	
	if (!shape) shape = "default";

	// sprite parameters	
	if (shape == "circle") {
		button.height = button.h = 60;
		button.width = button.w = 60;
	}else if(shape == "square-small"){
		button.height = button.h = 30;
		button.width = button.w = 30;
	} else {
		button.height = button.h = 60;
		button.width = button.w = 350;
	}

	button.anchor.set(0.5);
	button.inputEnabled = true;
	button.input.useHandCursor = true;
	button.tint = 0xffffff;
	button.bringToTop();
	button.alpha = 0;

	// add border
	var border = Vent.game.add.graphics(0, 0);	
	border.lineStyle(2, 0xffffff, 1);
	if (shape == "circle") {
		// border.drawCircle(button.x, button.y, button.width, button.height);
		border.drawRect(button.x - button.width / 2, button.y - button.height / 2, button.width, button.height);
	} else {
		border.drawRect(button.x - button.width / 2, button.y - button.height / 2, button.width, button.height);
	}
	border.boundsPadding = 0;
	button.border = border;	
	border.alpha = 1;
	if(shape == "square-small") border.alpha = 0;	

	// add label
	var label;
	if (label_text.indexOf("icon") == -1){
		label = Vent.game.add.text(button.x, button.y + 3, label_text.toUpperCase(), button_style);
		label.lineSpacing = -5;
	}else{
		label = Vent.game.add.sprite(button.x, button.y, label_text);

		var labelSize = 25;
		if(shape == "square-small"){
			labelSize = 18;
		}
		label.width = labelSize;
		label.height = labelSize;
	}
	label.anchor.set(0.5);
	button.label = label; //  save reference to letter

	var icon;
	var iconMod = 30;
	if (iconImage) {
		icon = Vent.game.add.sprite(button.x - button.width / 2 + iconMod, button.y, iconImage);
		icon.anchor.set(0.5);
		icon.height = button.height - iconMod;
		icon.width = button.height - iconMod;
		button.icon = icon;		
	}

	if (target_state != false && target_state != undefined) {
		button.events.onInputUp.add(function() {

			if (!hasTouch) {
				Vent.game.stateTransition.to(target_state);
			} else {
				Vent.game.state.start(target_state);
			}
			
		}, this);
	}
	button.events.onInputOver.add(function() {
		// button.tint = isDownColour;		
		Vent.game.add.tween(button).to({
			// width: button.w + 10,
			// height: button.h + 10,
			alpha: 1
		}, 200, Phaser.Easing.Quadratic.Out, true);
		//button.alpha = 1;
		button.label.tint = 0x000000;
		// if(button.icon) button.icon.tint = 0x000000;
		
	}, this);
	button.events.onInputOut.add(function() {
		// button.tint = noColour;
		Vent.game.add.tween(button).to({
			// width: button.w,
			// height: button.h,
			alpha: 0
		}, 200, Phaser.Easing.Quadratic.In, true);
		// button.alpha = 0;
		button.label.tint = 0xffffff;
		// if(button.icon) button.icon.tint = 0xffffff;
	}, this);
	button.events.onInputDown.add(function() {
		button.tint = 0x4ac7eb;
	});
	button.events.onInputUp.add(function() {		
		button.tint = 0xffffff;		
	});	

	// to address all button elements use group 
	btGroup = Vent.game.add.group();	

	btGroup.add(button);
	btGroup.add(border);
	btGroup.add(label);
	// if (iconImage) btGroup.add(icon);

	button.group = btGroup; // save a reference for later usage
}

function createCopyright() {

	// add copyright text	
	var c = Vent.game.add.text(10, Vent.game.height-3, copyright_txt, copyright_style);
	c.anchor.set(0, 1);

	// release	
	// var release = Vent.game.add.text(10, Vent.game.height-3, release_txt, copyright_style);
	// release.anchor.set(0, 1);	

	createSoundScreenToggles();	
}

function createSoundScreenToggles(){

	// soundBt
	var soundBt = Vent.game.add.sprite(Vent.game.width - 45, Vent.game.height - 15, "square");
	createBt(soundBt, "icon-note", false, "square-small");	
	soundBt.events.onInputUp.add(function() {
		soundToggle();
	});

	// fullscreenBt
	var fullscreenBt = Vent.game.add.sprite(Vent.game.width - 15, Vent.game.height - 15, "square");
	createBt(fullscreenBt, "icon-expand", false, "square-small");	
	fullscreenBt.events.onInputUp.add(function() {
		fullscreenToggle();
	});
}

function openInNewTab(url) {
	var win = window.top.open(url, '_blank');
	win.focus();
}

function commaSeparateNumber(val) {
	val = Number(val).toLocaleString('en');
	return val;
}

function playAudio(mysound) {

	if (settings.SOUND_ON && settings.VOLUME > 0) {
		var rand = Math.random() * 0.25;
		mysound.volume = settings.VOLUME + rand;
		mysound.play();
		mysound.frame = 0;

		playing.push(mysound);
	}
}

function soundToggle() {

	if (!settings.SOUND_ON) {
		settings.SOUND_ON = true;
		settings.VOLUME = 0.5;
	} else {
		settings.SOUND_ON = false;
		settings.VOLUME = 0;
	}
}

function fullscreenToggle() {

	if (!settings.FULLSCREEN) {

		settings.FULLSCREEN = true;
		settings.FRAME_WIDTH = settings.FRAME.style.width;
		settings.FRAME_HEIGHT = settings.FRAME.style.height;

		settings.FRAME.style.zindex = 500;
		settings.FRAME.style.position = "absolute";
		settings.FRAME.style.width = window.innerWidth + "px";
		settings.FRAME.style.height = window.innerHeight + "px";

	} else {
		settings.FULLSCREEN = false;

		settings.FRAME.style.zindex = 1;
		settings.FRAME.style.position = "relative";
		settings.FRAME.style.width = settings.FRAME_WIDTH;
		settings.FRAME.style.height = settings.FRAME_HEIGHT;
	}
}