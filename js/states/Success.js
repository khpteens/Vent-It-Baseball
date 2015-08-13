// Contact.js

var Vent = Vent || {};

//loading the game assets
Vent.Success = function() {};

Vent.Success.prototype = {
	init: function() {
	},
	create: function() {

		createBG(0x4ac7eb);
		createCopyright();

		var text = "Was it a\nhome run?";
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 80, text, h1_style);
		t.lineSpacing = -15;
		t.anchor.set(0.5);

		text = "It might make sense to\nsave a link to this tool.";
		var t2 = this.game.add.text(this.game.width / 2, this.game.height / 2 + 40, text, h3_style);
		t2.anchor.set(0.5);		

		// Phone
		var BackBt = this.game.add.sprite(this.game.width/2, this.game.height/2+160, "square");
		createBt(BackBt, "Main menu", "MainMenu");		
		
	},
	update: function() {
	}
};