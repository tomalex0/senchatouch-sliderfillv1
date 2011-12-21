
Ext.plugins.SliderFill = Ext.extend(Ext.util.Observable, {
    init: function(slider) {
	var me = this;
	this.slider = slider;
	
	me.mon(slider, 'afterrender',function(slider){
	    me.onSliderRender(slider);
	});
	
	me.mon(slider, 'drag',function(slider,thumb,newvalue){
	    me.fillSlider(newvalue);
	});
	
	me.mon(slider,'orientationchange',function(slider){
	    Ext.defer(function(){
		me.fillSlider(slider.getValue());
	    },100);
	});
	
    },
    fillSlider:function(value){
	if (this.slider.disabled) {
	    return false;
	}
	var newpixel = parseFloat(this.slider.getPixelValue(this.slider.constrain(value), this.slider.getThumb()));
	Ext.get(this.slider_fill_id).setStyle({width : Math.round(newpixel)+'px'});
    },
    onSliderRender : function(slider){
	this.slider = slider;
	this.slider_fill_id = Ext.id();
	Ext.DomHelper.append(this.slider.fieldEl, {tag: 'div', id: this.slider_fill_id, cls: 'x-slider-fill' });
	this.fillSlider(slider.getValue());
	this.mon(slider, 'change',function(slider,thumb,newvalue,oldvalue){
	    this.fillSlider(newvalue);
	}, this);
    }
});
Ext.preg('sliderfill', Ext.plugins.SliderFill);

Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        var form;
        
       Ext.regModel('User', {
            fields: [
                {name: 'height',     type: 'int'},
                {name: 'weight', type: 'int'},
                {name: 'single_slider',    type: 'int'}
            ]
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
			plugins : [{
			    ptype: 'sliderfill'
			}],
                        name : 'height',
                        label: 'Height'
                    },{
                        xtype: 'sliderfield',
			name : 'weight',
                        label: 'Weight'
                    }]
                },{
                    xtype: 'fieldset',
                    title: 'Single Slider (in fieldset)',
		    
		    
                    items: [{
                        xtype: 'sliderfield',
			name: 'single_slider',
			cls : 'hotred',
			id : 'hotred',
			plugins : [{
			    ptype: 'sliderfill'
			}],
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
                                    'height'    : 50,
                                    'weight': 20,
                                    'single_slider'   : 80
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
                fullscreen:true,
            });
        }
        
        form = new Ext.form.FormPanel(formBase);
        form.show();
    }
});