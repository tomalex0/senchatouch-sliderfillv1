/**
 * Form slider over ride to implement background fill feature.
 */
Ext.override(Ext.form.Slider,{
    additionalWidth : 8,
    initComponent: function() {
	this.tabIndex = -1;
	if (this.increment == 0) {
	    this.increment = 1;
	}
	this.increment = Math.abs(this.increment);
	//TODO: This will be removed once multi-thumb support is in place - at that point a 'values' config will be accepted
	//to create the multiple thumbs
	this.values = [this.value];
	
	Ext.form.Slider.superclass.initComponent.apply(this, arguments);
	if (this.thumbs == undefined) {
	    var thumbs = [],
		values = this.values,
		length = values.length,
		i,
		Thumb = this.getThumbClass();
	    for (i = 0; i < length; i++) {
		thumbs[thumbs.length] = new Thumb({
		    value: values[i],
		    slider: this,
		    listeners: {
			scope  : this,
			drag   : this.onDrag,
			dragend: this.onThumbDragEnd
		    }
		});
	    }
	    this.thumbs = thumbs;
	}
	Ext.DomHelper.append('cssdiv',{tag: 'style', id: 'dynamic-'+this.id});
    },
    /**
    * @private
    * Fires drag events so the user can interact.
    */
    onDrag: function(draggable){
       
       var value = this.getThumbValue(draggable);
       this.fillSlider(value);
       this.fireEvent('drag', this, draggable.thumb, this.constrain(value));
    },
    fillSlider:function(value){
	if (this.disabled) {
	    return false;
	}
	var newpixel = parseFloat(this.getPixelValue(this.constrain(value), this.getThumb())) + this.additionalWidth;
	Ext.get('dynamic-'+this.id).dom.innerText = '#'+this.id+' .x-input-slider::after{ width: '+Math.round(newpixel)+'px;}';
    },
    setValue: function(value, animationDuration, moveThumb) {
	if (typeof moveThumb == 'undefined') {
	    moveThumb = true;
	}

	moveThumb = !!moveThumb;

	//TODO: this should accept a second argument referencing which thumb to move
	var thumb    = this.getThumb(),
	    oldValue = thumb.getValue(),
	    newValue = this.constrain(value);
	if (this.fireEvent('beforechange', this, thumb, newValue, oldValue) !== false) {
	    if (moveThumb) {
		this.moveThumb(thumb, this.getPixelValue(newValue, thumb), animationDuration);
	    }
	    thumb.setValue(newValue);
	    this.doComponentLayout();
	    this.fireEvent('change', this, thumb, newValue, oldValue);
	    this.fillSlider(value);
	}
	return this;
    },
    getPixelValue: function(value, thumb) {
	var trackWidth = thumb.dragObj.offsetBoundary.right + this.additionalWidth,
	    range = this.maxValue - this.minValue,
	    ratio;
	this.trackWidth = (trackWidth > 0) ? trackWidth : this.trackWidth;
	ratio = this.trackWidth / range;
	return (ratio * (value - this.minValue));
    }
});

Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        var form;
        
        Ext.regModel('User', {
            fields: [
                {name: 'name',     type: 'string'},
                {name: 'password', type: 'password'},
                {name: 'email',    type: 'string'},
                {name: 'url',      type: 'string'},
                {name: 'rank',     type: 'string'},
                {name: 'enable',   type: 'boolean'},
                {name: 'cool',     type: 'boolean'},
                {name: 'color',    type: 'string'},
                {name: 'team',     type: 'string'},
                {name: 'secret',   type: 'boolean'}
            ]
        });
        
         Ext.regModel('Ranks', {
            fields: [
                {name: 'rank',     type: 'string'},
                {name: 'title',    type: 'stringExt.DataView.override({'}
            ]
         });
        
        var ranksStore = new Ext.data.JsonStore({
           data : [
                { rank : 'master',  title : 'Master'},
                { rank : 'padawan', title : 'Student'},
                { rank : 'teacher', title : 'Instructor'},
                { rank : 'aid',     title : 'Assistant'}
           ],
           model : 'Ranks',
           autoLoad : true,
           autoDestroy : true
        });
        
        var formBase = {
            scroll: 'vertical',
            url   : 'postUser.php',
            standardSubmit : false,
            items: [{
                    xtype: 'fieldset',
                    title: 'Personal Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        required: true,
                        labelAlign: 'left',
                        labelWidth: '40%'
                    },
                    items: [{
                        xtype: 'sliderfield',
                        name : 'height',
                        label: 'Height'
                    }]
                },{
                    xtype: 'fieldset',
                    title: 'Single Slider (in fieldset)',
                    items: [{
                        xtype: 'sliderfield',
                        name: 'single_slider',
                        value : 100
                    }]
                }
            ],
            listeners : {
                submit : function(form, result){
                    console.log('success', Ext.toArray(arguments));
                },
                exception : function(form, result){
                    console.log('failure', Ext.toArray(arguments));
                }
            },
        
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            text: 'Load Model',
                            ui: 'round',
                            handler: function() {
                                formBase.user = Ext.ModelMgr.create({
                                    'name'    : 'Akura',
                                    'password': 'secret',
                                    'email'   : 'saru@sencha.com',
                                    'url'     : 'http://sencha.com',
                                    'single_slider': 20,
                                    'enable'  : 1,
                                    'cool'    : true,
                                    'team'    : 'redteam',
                                    'color'   : 'blue',
                                    'rank'    : 'padawan',
                                    'secret'  : true,
                                    'bio'     : 'Learned the hard way !'
                                }, 'User');
        
                                form.loadModel(formBase.user);
                            }
                        },
                        {
			    xtype: 'spacer'
			},
                        {
                            text: 'Reset',
                            handler: function() {
                                form.reset();
                            }
                        }
                    ]
                }
            ]
        };
        
        if (Ext.is.Phone) {
            formBase.fullscreen = true;
        } else {
            Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false,
                height: 385,
                width: 480
            });
        }
        
        form = new Ext.form.FormPanel(formBase);
        form.show();
    }
});