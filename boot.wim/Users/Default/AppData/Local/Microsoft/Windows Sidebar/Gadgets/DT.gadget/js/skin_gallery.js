var gGallery = function(id) {
	this.id = id;
	this.gallery = '';
	this.slectedSkin = '';
	this.currentSkin = 0;
	this.butLeft = '';
	this.butLeftDisable = '';
	this.butRight = '';
	this.butRightDisable = '';
	this.skinImg = '';
	this.currentSkinNum = '';
	this.muxSkinNum = '';
}
gGallery.prototype.refreshButtons = function() {
	if(this.currentSkin<1) {
		if(!hasClass(this.butLeft, 'displayNone'))
			addClass(this.butLeft, 'displayNone');
		removeClass(this.butLeftDisable, 'displayNone');
	} else {
		if(!hasClass(this.butLeftDisable, 'displayNone'))
			addClass(this.butLeftDisable, 'displayNone');
		removeClass(this.butLeft, 'displayNone');
	}
	if(this.currentSkin >= (gSettings.skins.length -1)) {
		if(!hasClass(this.butRight, 'displayNone'))
			addClass(this.butRight, 'displayNone');
		removeClass(this.butRightDisable, 'displayNone');
	} else {
		if(!hasClass(this.butRightDisable, 'displayNone'))
			addClass(this.butRightDisable, 'displayNone');
		removeClass(this.butRight, 'displayNone');
	}
}
gGallery.prototype.initGallery = function() {
	if(this.currentSkin >= gSettings.skins.length) this.currentSkin = 0;
	this.gallery = document.getElementById(this.id);
	this.butLeft = document.getElementById('skin_prev');
	this.butRight = document.getElementById('skin_next');
	this.butLeftDisable = document.getElementById('skin_prev_disable');
	this.butRightDisable = document.getElementById('skin_next_disable');
	this.skinImg = document.getElementById('current_skin');
	this.skinImg.setAttribute('src', gSettings.skins[this.currentSkin]['skinScreen']);
	this.refreshButtons();
	this.currentSkinNum = document.getElementById('current_skin_num');
	this.maxSkinNum = document.getElementById('max_skin_num');
	this.currentSkinNum.innerHTML = this.currentSkin+1;
	this.maxSkinNum.innerHTML = gSettings.skins.length;
}
gGallery.prototype.showCurrentSkin = function() {
	this.currentSkin = gSettings.currentSkinNumber;
	if(this.currentSkin >= gSettings.skins.length) this.currentSkin = 0;
	this.refreshButtons();
	this.currentSkinNum.innerHTML = this.currentSkin+1;
	this.skinImg.setAttribute('src', gSettings.skins[this.currentSkin]['skinScreen']);
}
gGallery.prototype.showNext = function() {
	this.currentSkin++;
	if(this.currentSkin >= gSettings.skins.length) this.currentSkin = 0;
	this.refreshButtons();
	this.currentSkinNum.innerHTML = this.currentSkin+1;
	this.skinImg.setAttribute('src', gSettings.skins[this.currentSkin]['skinScreen']);
	gSettings.currentSkin = gSettings.skins[this.currentSkin]['skinName'];
	gSettings.currentSkinNumber = this.currentSkin;
}
gGallery.prototype.showPrev = function() {
	this.currentSkin--;
	if(this.currentSkin >= gSettings.skins.length || this.currentSkin < 0) this.currentSkin = 0;
	this.refreshButtons();
	this.currentSkinNum.innerHTML = this.currentSkin+1;
	this.skinImg.setAttribute('src', gSettings.skins[this.currentSkin]['skinScreen']);
	gSettings.currentSkin = gSettings.skins[this.currentSkin]['skinName'];
	gSettings.currentSkinNumber = this.currentSkin;
}

