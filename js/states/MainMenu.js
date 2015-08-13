// MainMenu.js

Vent.MainMenu = function() {};

Vent.MainMenu.prototype = {
	create: function() {

		createBG(0x262524);

		createCopyright();

		var wordmark = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 50, "wordmark");
		wordmark.anchor.set(0.5);
		wordmark.scale.set(0.8);		

		// Play now 
		var PlayBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 110, "square");
		createBt(PlayBt, "Start", "Pick");
		
	},
	update: function() {}
};