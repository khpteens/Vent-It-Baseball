// Finish.js

var hitGoal = null;

var Vent = Vent || {};

//loading the game assets
Vent.Pick = function() {};

Vent.Pick.prototype = {
	create: function() {

		createBG(0x938884);
		createCopyright();

		// "How stressed are you?"
		var text = "Blow off steam by\nhitting some baseballs.";
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 175, text, h3_style);
		t.anchor.set(0.5);

		// "How many baseballs do you need to hit?"
		text = "Choose how many balls\nyou want to hit.";
		var t2 = this.game.add.text(this.game.width / 2, this.game.height / 2 - 65, text, h2_style);
		t2.anchor.set(0.5);

		// bt "Just a few"
		text = "Just a few";
		var aFewBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 60, "square");
		createBt(aFewBt, text, false, false, "emoji1");
		aFewBt.events.onInputUp.add(function() {
			hitGoal = 10;
			if (!hasTouch) {
				Vent.game.stateTransition.to("Game");
			} else {
				Vent.game.state.start("Game");
			}
		}, this);

		// bt "A lot"
		text = "A lot";
		var aLotBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 120, "square");
		createBt(aLotBt, text, false, false, "emoji2");
		aLotBt.events.onInputUp.add(function() {
			hitGoal = 50;
			if (!hasTouch) {
				Vent.game.stateTransition.to("Game");
			} else {
				Vent.game.state.start("Game");
			}
		}, this);

		// bt "A lot"
		var MillionsBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 180, "square");
		createBt(MillionsBt, "Hundreds", false, false, "emoji3");
		MillionsBt.events.onInputUp.add(function() {
			hitGoal = 500;
			if (!hasTouch) {
				Vent.game.stateTransition.to("Game");
			} else {
				Vent.game.state.start("Game");
			}
		}, this);
	},
	update: function() {

	}
};