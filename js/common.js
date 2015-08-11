// Utility.js holds utility functions

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

	// add label
	var label;
	if (label_text.indexOf("icon") == -1){
		label = Vent.game.add.text(button.x, button.y + 3, label_text.toUpperCase(), button_style);
		label.lineSpacing = -5;
	}else{
		label = Vent.game.add.sprite(button.x, button.y, label_text);
		label.width = 25;
		label.height = 25;
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
			Vent.game.stateTransition.to(target_state);
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
}

function createCopyright() {

	// add copyright text
	var text = "© Brotalk";
	var c = Vent.game.add.text(Vent.game.width - 10, Vent.game.height, text, copyright_style);
	c.anchor.set(1, 1);

	// release
	text = "BETA"; // .July.30.2015";
	var release = Vent.game.add.text(10, Vent.game.height, text, copyright_style);
	release.anchor.set(0, 1);
}

function openInNewTab(url) {
	var win = window.top.open(url, '_blank');
	win.focus();
}

function commaSeparateNumber(val) {
	val = Number(val).toLocaleString('en');
	return val;
}