// Contact.js

var Vent = Vent || {};

//loading the game assets
Vent.Contact = function() {};

Vent.Contact.prototype = {
	init: function() {},
	create: function() {

		createBG(0x015095);
		createCopyright();

		var text = "Touch base with us";
		var t = this.game.add.text(this.game.width / 2, this.game.height / 2 - 190, text, h2_style);
		t.anchor.set(0.5);

		var text = "Contact one of our counsellors.";
		var t2 = this.game.add.text(this.game.width / 2, this.game.height / 2 - 150, text, h3_style);
		t2.anchor.set(0.5);

		var messageButtonH = this.game.height / 2 - 50,
			phoneButtonH = this.game.height / 2 + 10;

		// Live Chat
		if (chatOpen) {
			text = chatOpen_txt[0];			
		} else {
			text = chatClosed_txt[0];
			messageButtonH = this.game.height / 2 + 10,
			phoneButtonH = this.game.height / 2 - 50;
		}
		var MessageBt = this.game.add.sprite(this.game.width / 2, messageButtonH, "square");
		createBt(MessageBt, text, false, false, "icon-chat");
		MessageBt.events.onInputUp.add(function() {
			trackEvent("Message a Counsellor clicked", Vent.game.state.getCurrentState().key+" screen");
			message_brotalk();
		}, this);

		// Phone
		text = "Phone a counsellor";
		var PhoneBt = this.game.add.sprite(this.game.width / 2, phoneButtonH, "square");
		createBt(PhoneBt, text, false, false, "icon-phone");
		PhoneBt.events.onInputUp.add(function() {
			trackEvent("Phone a Counsellor clicked", Vent.game.state.getCurrentState().key+" screen");
			phone_brotalk();
		}, this);

		// More info
		text = counsellor_txt[0];
		var LearnBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 70, "square");
		createBt(LearnBt, text, false);
		LearnBt.events.onInputUp.add(function() {
			trackEvent("Learn About Counsellors clicked", Vent.game.state.getCurrentState().key+" screen");
			moreAbout();
		}, this);

		// Phone
		var BackBt = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 190, "square");
		createBt(BackBt, "Main menu", "MainMenu");

	},
	update: function() {}
};

function phone_brotalk() {
	var r = confirm("Are you sure you want to dial Kids Help Phone's number?");
	if (r === true) {
		trackEvent("Phone a Counsellor confirmed", Vent.game.state.getCurrentState().key+" screen");
		window.location = phone_url;
	} else {
		// do nothing if cancel is pressed
	}
}

function message_brotalk() {
	var r = confirm("Are you sure you want to leave this page?");
	if (r === true) {
		trackEvent("Message a Counsellor confirmed", Vent.game.state.getCurrentState().key+" screen");
		openInNewTab(chat_url);
	} else {
		// do nothing if cancel is pressed
	}
}

function moreAbout() {
	var r = confirm("Are you sure you want to leave this page?");
	if (r === true) {
		trackEvent("Learn About Counsellors confirmed", Vent.game.state.getCurrentState().key+" screen");
		openInNewTab(counsellor_url);
	} else {
		// do nothing if cancel is pressed
	}
}