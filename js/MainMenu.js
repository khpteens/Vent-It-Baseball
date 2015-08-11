// MainMenu.js

Vent.MainMenu = function() {};

Vent.MainMenu.prototype = {
	create: function() {

		createBG(0x262524);

		createCopyright();

		var wordmark = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 50, "wordmark");
		wordmark.anchor.set(0.5);
		wordmark.scale.set(0.8);

		// // "Play Something"
		// var text = "VENT IT:";
		// var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 60, text, h1_style);
		// t.anchor.set(0.5);

		// // "Play Something"
		// text = "BASEBALL";
		// var t2 = this.game.add.text(this.game.width / 2, this.game.height / 2, text, h1_style);
		// t2.anchor.set(0.5);

		// Continue prompt
		text = "Click to continue";
		if (hasTouch) text = "Tap to continue";

		var c = this.game.add.text(this.game.width / 2, this.game.height / 2 + 100, text, p_style_center);
		c.anchor.set(0.5);

		// add continue click
		this.game.input.onUp.add(function() {
			this.game.stateTransition.to("Pick");
		}, this);
		
	},
	update: function() {}
};