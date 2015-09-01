// Finish.js

var Vent = Vent || {};

//loading the game assets
Vent.Finish = function() {};

Vent.Finish.prototype = {
	create: function() {

		createBG(0x015095);
		createCopyright();

		// start game text
		var text = "Doin' a little better?";
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 170, text, h2_style);
		t.anchor.set(0.5);

		// bt "Yeah, thanks"
		var YesBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2-70, "square");
		createBt(YesBt, "Yeah, thanks", "Success", false, "emoji4");

		// bt "A little, play again"
		var aLittleBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 - 10, "square");
		createBt(aLittleBt, "A little, play again", "Pick", false, "emoji1");
		aLittleBt.events.onInputUp.add(function(){
			trackEvent("Play Again clicked", Vent.game.state.getCurrentState().key+" screen");
		}, this);

		// bt "No, I need something else"
		var somethingElseBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 50, "square");
		createBt(somethingElseBt, "No, I need something else", false, false, "emoji3");
		somethingElseBt.events.onInputUp.add(function() {
			goToHomepage();
		}, this);

		// bt "I'd like to chat with a counsellor"
		var contactBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 170, "square");
		createBt(contactBt, "Chat with a counsellor", "Contact", false, "emoji2");	
		contactBt.events.onInputUp.add(function(){
			trackEvent("Chat with a Counsellor clicked", Vent.game.state.getCurrentState().key+" screen");
		}, this);	

	},
	update: function() {}
};

function goToHomepage() {
	var r = confirm("Are you sure you want to leave this page?");
	if (r === true) {
		openInNewTab(home_url);
	} else {
		// do nothing if cancel is pressed
	}
}