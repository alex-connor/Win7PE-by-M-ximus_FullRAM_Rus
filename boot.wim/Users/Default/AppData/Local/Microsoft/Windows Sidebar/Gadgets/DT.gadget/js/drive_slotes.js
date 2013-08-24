var driveSlots = function() {
	this.slotsWindow = '';
	this.slotsWindowClose = '';
	this.windowTitle = ''
	this.outSlotDrives = '';
	this.slotHint = '';
	this.slotHintText = '';
	this.slotsNum = 4;
	this.allDrives = [];
	this.allDrives['slots'] = new Array({'drive':'','driveContainer':''}, {'drive':'','driveContainer':''}, {'drive':'','driveContainer':''}, {'drive':'','driveContainer':''});
	this.allDrives['outSlotDrives'] = new Array();
	//this.actions = new Array({'action':-1, 'val':-1}, {'action':-1, 'val':-1}, {'action':-1, 'val':-1}, {'action':-1, 'val':-1});
	this.slotsTable = '';
	this.selectedSlot = -1;
	this.hintDriveSlotWidth = 75;
	this.hintArrowWidth = 10;
	this.hintArrow = '';
	this.disableEmptySlotFromNum = -1;
}
driveSlots.prototype.init = function() {
	this.slotsWindow = document.getElementById('slots_window');
	this.slotsWindowClose = document.getElementById('slots_window_close');
	this.outSlotDrives = document.getElementById('out_slot_drives');
	this.slotHint = document.getElementById('slot_hint');
	this.slotHintText = document.getElementById('slot_hint_text');
	this.hintArrow = document.getElementById('hint_arrow');
	this.windowTitle = document.getElementById('window_title');
}
driveSlots.prototype.addElement = function(obj, key) {
	this.allDrives[key][this.allDrives[key].length] = obj;
}
driveSlots.prototype.removeElement = function(num, key) {
	var tmp = Array();
	if(key != 'slots') {
		for(var i = 0; i<this.allDrives[key].length; i++) {
			if(i != num) {
				tmp[tmp.length] = this.allDrives[key][i];
			}
		}
		this.allDrives[key] = tmp;
	} else {
		this.allDrives[key][num]['drive'] = '';
	}
}
driveSlots.prototype.addElements = function(obj, key) {
	var i;
	for(i = 0; i<obj.length; i++)
		this.allDrives[key][this.allDrives[key].length] = obj[i];
}
driveSlots.prototype.setDisbleSlotNum = function(){
	var disable = false;
	this.disableEmptySlotFromNum = -1;
	for(var i = 0; i<this.allDrives['slots'].length; i++) {
		if(disable == true) {
			this.disableEmptySlotFromNum = i;
			break;
		}
		if(this.allDrives['slots'][i]['drive']=='')
			disable = true;
	}
}
driveSlots.prototype.sortDrives = function(obj) {
	for(var i = 0; i < obj.length; i++) {
		if(obj[i]['iS']!=-1) {
			if(obj[i]['iS'] < this.slotsNum){
				this.allDrives['slots'][obj[i]['iS']]['drive'] = obj[i];
			}
		} else {
			this.addElement(obj[i], 'outSlotDrives');
		}
	}
}
driveSlots.prototype.bublSort = function() {
	var N = this.allDrives['outSlotDrives'].length;
	var i;
	var f;
	var c;
	do {
		f=false;
		for (i=0; i < N-1; i++) {
				if(this.allDrives['outSlotDrives'][i]['dI'] > this.allDrives['outSlotDrives'][i+1]['dI']) {
			  	f=true;
			  	c=this.allDrives['outSlotDrives'][i];
				this.allDrives['outSlotDrives'][i]=this.allDrives['outSlotDrives'][i+1];
				this.allDrives['outSlotDrives'][i+1]=c;
				}
		}
	}
	while (f!=false)
}
driveSlots.prototype.addSlot = function(num) {
	this.allDrives['slots'][this.selectedSlot]['driveContainer'].innerHTML = '';
	this.allDrives['slots'][this.selectedSlot]['drive'] = this.allDrives['outSlotDrives'][num];
	this.refreshInSlotsDrive(this.selectedSlot);
	
}
driveSlots.prototype.removeInSlotDrive = function(num) {
	if(this.allDrives['slots'][num]['drive'] != ''){
		var tmp = this.allDrives['slots'][num]['drive'];
		removeElementByObj(this.allDrives['slots'][num]['drive']['o']);
		var n = this.allDrives['outSlotDrives'].length
		this.allDrives['outSlotDrives'][n] = tmp;
		this.allDrives['outSlotDrives'][n]['iS'] = -1;
		//this.allDrives['slots'][num]['actions']['action'] = 'remove';
		//this.allDrives['slots'][num]['actions']['val'] = '';
		this.removeElement(num, 'slots');
		this.createOutSlotDrives();
		this.sortInSlotDrives();
	}
}
driveSlots.prototype.getActions = function () {
	gSettings.actionList = new Array();
	for(var i = 0; i<this.allDrives['slots'].length; i++) {
		gSettings.actionList[i] = this.allDrives['slots'][i]['drive']['dI'];
	}
}
driveSlots.prototype.sortInSlotDrives = function() {
var n = 0;
for(var i = 0; i<this.allDrives['slots'].length; i++) {
		if(this.allDrives['slots'][i]['drive'] != '') {
			if(n!=i) {
				this.allDrives['slots'][n]['drive'] = this.allDrives['slots'][i]['drive'];
				//this.allDrives['slots'][n]['actions']['action'] = this.allDrives['slots'][i]['actions']['action'];
				//this.allDrives['slots'][n]['actions']['val'] = this.allDrives['slots'][i]['actions']['val'];
				this.allDrives['slots'][i]['drive'] = '';
				//this.allDrives['slots'][i]['actions']['action'] = 'remove';
				//this.allDrives['slots'][i]['actions']['val'] = '';
			}
			n++;
		}
	}
this.setDisbleSlotNum();
this.createInSlotsDrives();
}
driveSlots.prototype.changeDriveInSlot = function(num) {
	
	if(this.allDrives['slots'][this.selectedSlot]['drive']!='') {
		var tmp = this.allDrives['slots'][this.selectedSlot]['drive'];
		removeElementByObj(this.allDrives['slots'][this.selectedSlot]['drive']['o']);
		this.allDrives['slots'][this.selectedSlot]['drive'] = this.allDrives['outSlotDrives'][num];
		this.allDrives['outSlotDrives'][num] = tmp;
		this.allDrives['outSlotDrives'][num]['iS'] = -1;
		this.allDrives['slots'][this.selectedSlot]['drive']['iS'] = this.selectedSlot;
		this.sortInSlotDrives();
		this.createOutSlotDrives();
		//document.getElementById('drive_radio_'+this.allDrives['outSlotDrives'][i]['dI']).setAttribute('selected', 'selected');
		//this.allDrives['slots'][this.selectedSlot]['actions']['action'] = 'change';
		//this.allDrives['slots'][this.selectedSlot]['actions']['val'] = this.allDrives['slots'][this.selectedSlot]['drive']['dI'];
		this.unSelectSlot(this.selectedSlot);
	} else {
		var tmp = this.allDrives['slots'][this.selectedSlot]['driveContainer'].innerHTML = '';
		this.allDrives['slots'][this.selectedSlot]['drive'] = this.allDrives['outSlotDrives'][num];
		this.allDrives['slots'][this.selectedSlot]['drive']['iS'] = this.selectedSlot;
		this.removeElement(num, 'outSlotDrives');
		this.sortInSlotDrives();
		this.createOutSlotDrives();
		//this.allDrives['slots'][this.selectedSlot]['actions']['action'] = 'change';
		//this.allDrives['slots'][this.selectedSlot]['actions']['val'] = this.allDrives['slots'][this.selectedSlot]['drive']['dI'];
		this.unSelectSlot(this.selectedSlot);
	}
}
driveSlots.prototype.createOutSlotDrives = function() {
	this.bublSort();
	this.outSlotDrives.innerHTML = '';
	for(var i =0; i < this.allDrives['outSlotDrives'].length; i++){
		var driveDivContainer = document.createElement('div');
		driveDivContainer.className = 'driveDivContainer';
		driveDivContainer.id = 'drive_'+this.allDrives['outSlotDrives'][i]['dI'];
		var driveDiv = document.createElement('div');
		driveDiv.className = 'driveDiv';
		/*var driveRadioButt = document.createElement('input');
		driveRadioButt.className = 'driveRadioButt';
		driveRadioButt.setAttribute('type','radio');
		driveRadioButt.setAttribute('name','drives');
		driveRadioButt.id = 'drive_radio_'+this.allDrives['outSlotDrives'][i]['dI'];*/
		var driveImg = document.createElement('img');
		//driveImg.setAttribute('src', this.allDrives['outSlotDrives'][i]['dIc']);
		driveImg.setAttribute('src', this.allDrives['outSlotDrives'][i]['dIc']);
		driveImg.className = 'driveIcon';
		driveImg.setAttribute('align', 'absmiddle');
		var driveLabel = document.createElement('label');
		driveLabel.setAttribute('for', 'drive_radio_'+this.allDrives['outSlotDrives'][i]['dI']);
		driveLabel.className = 'driveTXT';
		var driveName = document.createElement('span');
		driveName.className = 'driveName';
		driveName.innerHTML = '('+this.allDrives['outSlotDrives'][i]['dN']+')&nbsp;';
		var drivePath = document.createElement('span');
		drivePath.className = 'drivePath';
    var DiskLabel = this.allDrives['outSlotDrives'][i]['dL'];
    if(DiskLabel == "") {
       DiskLabel = System.Gadget.Settings.readString("OptionsEmptyText")
    }
		drivePath.innerHTML = DiskLabel;
		driveLabel.appendChild(driveName);
		driveLabel.appendChild(drivePath);
		//driveDiv.appendChild(driveRadioButt);
		driveDiv.appendChild(driveImg);
		driveDiv.appendChild(driveLabel);
		driveDivContainer.appendChild(driveDiv);
		driveDivContainer.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName);}}(driveDivContainer, 'driveHover'));
		driveDivContainer.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName);}}(driveDivContainer, 'driveHover'));
		driveDivContainer.onclick = function(n){ return function(){dSlots.changeDriveInSlot(n)}}(i);
		this.outSlotDrives.appendChild(driveDivContainer);
		this.allDrives['outSlotDrives']['o'] = driveDivContainer;
	}
}
driveSlots.prototype.unSelectSlot = function (num) {
	this.slotsWindow.style.display = 'none';
	//removeClass(this.allDrives['slots'][num]['drive']['o'], 'slotSelected');
	this.selectedSlot = -1;
}
driveSlots.prototype.slotClick = function(num) {
  
	if(this.allDrives['outSlotDrives'].length>0){
	if(this.selectedSlot != -1) {
		this.unSelectSlot(this.selectedSlot);
	}
	this.selectedSlot = num;
	this.windowTitle.innerHTML = 'Slot '+(num+1)+':';
	this.slotsWindow.style.display = 'block';
	this.slotsWindowClose.onclick = function(t, n){ return function(){ t.unSelectSlot(n);}}(this, num);
}
}
driveSlots.prototype.showSlotHint = function(num) {
	if(this.selectedSlot == -1) {
		if(this.allDrives['slots'][num]['drive'] != '') {
			this.slotHintText.innerHTML = '('+this.allDrives['slots'][num]['drive']['dN']+')&nbsp'+this.allDrives['slots'][num]['drive']['dP'];
		} else {
			this.slotHintText.innerHTML = 'Click to add slot';
		}
		this.hintArrow.style.marginLeft = ((this.hintDriveSlotWidth*num)+((this.hintDriveSlotWidth-this.hintArrowWidth)/2))+'px';
		this.slotHint.style.display = 'block';
	}
}
driveSlots.prototype.hideSlotHint = function(num) {
	if(this.selectedSlot == -1) {
		this.slotHint.style.display = 'none';
	}
}
driveSlots.prototype.refreshInSlotsDrive = function(num) {
	
	var slot = document.createElement('div');
	slot.className = "slotBlock";
	var slotImg = document.createElement('img');
	slotImg.setAttribute('align', 'absmiddle');
	slotImg.className = "slotImg";
	/*var slotNum = document.createElement('span');
	slotNum.className = 'slotNum';
	slotNum.innerHTML = 'Slot&nbsp;'+(num+1)+':';*/
	var slotLabel = document.createElement('input');
	slotLabel.readOnly = true
	slotLabel.className = 'slotLabel';
	slotLabel.value ='('+this.allDrives['slots'][num]['drive']['dN']+') '+this.allDrives['slots'][num]['drive']['dL'];
	var slotBrowse = document.createElement('input');
	slotBrowse.setAttribute('type', 'button');
	slotBrowse.className = 'slotBrowse';
	slotBrowse.value = '...';
	/*var dellSlot = document.createElement('img');
	dellSlot.setAttribute('align', 'absmiddle');
	dellSlot.className = 'dellSlot';
	dellSlot.setAttribute('src' , 'img/1.gif');
	dellSlot.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName);}}(dellSlot, 'dellSlotHover'));
	dellSlot.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName);}}(dellSlot, 'dellSlotHover'));
	dellSlot.onclick = function(n){ return function(){ dSlots.removeInSlotDrive(n);}}(num);*/
	//slot.appendChild(slotNum);
	slot.appendChild(slotImg);
	slot.appendChild(slotLabel);
	if(this.allDrives['outSlotDrives'].length<1)
		slotBrowse.disabled = true;
	slot.appendChild(slotBrowse);
	//slot.appendChild(dellSlot);
	slotBrowse.onclick = function(n){ return function(){ dSlots.slotClick(n);}}(num);
	//slotImg.setAttribute('src' , this.allDrives['slots'][num]['drive']['dIc']);
		slotImg.setAttribute('src' , this.allDrives['slots'][i]['drive']['dIc']);
	slotImg.onclick =function(n){ return function(){ dSlots.slotClick(n);}}(num);
	this.allDrives['slots'][num]['drive']['o'] = slot;
	this.allDrives['slots'][num]['driveContainer'].appendChild(slot);
}
driveSlots.prototype.createInSlotsDrives = function() {
	document.getElementById('slots_div').innerHTML = '';
	this.slotsTable = document.createElement('div');
	var divs = Array();
	divs[0] = document.createElement('div');
	divs[0].id = 'slot_0';
	divs[1] = document.createElement('div');
	divs[1].id = 'slot_1';
	divs[2] = document.createElement('div');
	divs[2].id = 'slot_2';
	divs[3] = document.createElement('div');
	divs[3].id = 'slot_3';
	this.slotsTable.appendChild(divs[0]);
	this.slotsTable.appendChild(divs[1]);
	this.slotsTable.appendChild(divs[2]);
	this.slotsTable.appendChild(divs[3]);
	for(var i = 0; i<4; i++) {
		var slot = document.createElement('div');
		slot.className = "slotBlock";
		var slotImg = document.createElement('img');
		slotImg.setAttribute('align', 'absmiddle');
		slotImg.className = "slotImg";
		/*var slotNum = document.createElement('span');
		slotNum.className = 'slotNum';
		slotNum.innerHTML = 'Slot&nbsp;'+(i+1)+':';*/
		/*var dellSlot = document.createElement('img');
		dellSlot.setAttribute('align', 'absmiddle');
		dellSlot.className = 'dellSlot';
		dellSlot.setAttribute('src' , 'img/1.gif');*/
		var slotLabel = document.createElement('input');
		slotLabel.readOnly = true;
		slotLabel.className = 'slotLabel';
		var slotBrowse = document.createElement('input');
		slotBrowse.setAttribute('type', 'button');
		slotBrowse.className = 'slotBrowse';
		slotBrowse.value = '...';
		//slot.appendChild(slotNum);
		slot.appendChild(slotImg);
		slot.appendChild(slotLabel);
		if(this.allDrives['slots'][i]['drive']=='') {
      slotLabel.value = System.Gadget.Settings.readString("OptionsEmptyText");
			slot.appendChild(slotBrowse);
			slotLabel.disabled = true;
			//slot.appendChild(dellSlot);
			//dellSlot.className = dellSlot.className + ' dellSlotDisable';
			if(this.disableEmptySlotFromNum != -1) {
				if(i < this.disableEmptySlotFromNum) {
					slotImg.onclick = function(n){ return function(){dSlots.slotClick(n);}}(i);
					slotBrowse.onclick = function(n){ return function(){dSlots.slotClick(n);}}(i);
				} else {
					slotBrowse.disabled = true;
					slotLabel.disabled = true;
				}
			} else {
				slotImg.onclick = function(n){ return function(){dSlots.slotClick(n);}}(i);
				slotBrowse.onclick = function(n){ return function(){dSlots.slotClick(n);}}(i);
			}
			slotImg.setAttribute('src' , 'img/no_slot.png');
			slotImg.style.cursor = 'auto';
		} else {
			slot.appendChild(slotBrowse);
			//slot.appendChild(dellSlot);
			slotLabel.value ='('+this.allDrives['slots'][i]['drive']['dN']+') '+this.allDrives['slots'][i]['drive']['dL'];
			slotBrowse.onclick = function(n){ return function(){ dSlots.slotClick(n);}}(i);
			slotImg.onclick = function(n){ return function(){ dSlots.slotClick(n);}}(i);
      var ImageName =  this.allDrives['slots'][i]['drive']['dIc'].replace(new RegExp("CURR_SKIN",'g'), "skins/" + gSettings.currentSkin);
			slotImg.setAttribute('src' , ImageName);
			//dellSlot.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName);}}(dellSlot, 'dellSlotHover'));
			//dellSlot.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName);}}(dellSlot, 'dellSlotHover'));
			//dellSlot.onclick = function(n){ return function(){ dSlots.removeInSlotDrive(n);}}(i);
			this.allDrives['slots'][i]['drive']['o'] = slot;
		}
		if(this.allDrives['outSlotDrives'].length<1) {
						slotBrowse.disabled = true;
    }
		this.allDrives['slots'][i]['driveContainer'] = divs[i];
		divs[i].appendChild(slot);
	}
	document.getElementById('slots_div').appendChild(this.slotsTable);
}
dSlots = new driveSlots();
function onSettingsPageLoad () {
	dSlots.init();
	dSlots.sortDrives(gSettings.drives);
	dSlots.sortInSlotDrives();
	dSlots.createOutSlotDrives();
}
