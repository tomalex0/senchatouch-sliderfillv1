
Ext.plugins.SliderFill = Ext.extend(Ext.util.Observable, {
    init: function(slider) {
	var me = this;
	this.slider = slider;
	Ext.DomHelper.append('cssdiv',{tag: 'style', id: 'dynamic-'+this.slider.id});
	
	this.mon(slider, 'afterrender',function(slider){
	    this.onSliderRender(slider);
	}, this);
	
	this.mon(slider, 'change',function(slider,thumb,newvalue,oldvalue){
	    this.fillSlider(newvalue);
	}, this);
	
	this.mon(slider, 'drag',function(slider,thumb,newvalue){
	    this.fillSlider(newvalue);
	}, this);
	
	this.mon(slider,'orientationchange',function(slider){
	    Ext.defer(function(){
			me.fillSlider(slider.getValue())
	    },100);
	},this);
	
	
	
    },
    fillSlider:function(value){
	if (this.slider.disabled) {
	    return false;
	}
	var newpixel = parseFloat(this.getSlidePixelValue(this.slider.constrain(value), this.slider.getThumb()));
	Ext.get('dynamic-'+this.slider.id).dom.innerText = '#'+this.slider.id+' .x-input-slider::after{ width: '+Math.round(newpixel)+'px;}';
	this.updateSliderSize(this.slider);
	
    },
    getSlidePixelValue: function(value, thumb) {
	var slider = this.slider;
	var trackWidth = thumb.dragObj.offsetBoundary.right ,
	    range = slider.maxValue - slider.minValue,
	    ratio;
	   
	slider.trackWidth = (trackWidth > 0) ? trackWidth : slider.trackWidth;
	ratio = slider.trackWidth / range;
	return (ratio * (value - slider.minValue));
    },
    onSliderRender : function(slider){
	this.slider = slider;
	console.log(slider);
	this.slider_fill_id = Ext.id(),
	    slidermaxwidth =  this.getSlidePixelValue(this.slider.maxValue, this.slider.getThumb());
	this.slider.addCls('x-slider-fill-comp');
	Ext.DomHelper.append(this.slider.fieldEl, {tag: 'div', id: this.slider_fill_id, cls: 'x-slider-fill' , style : 'width:'+slidermaxwidth+'px;'});
    },
    updateSliderSize : function(slider){
	var slidermaxwidth =  this.getSlidePixelValue(slider.maxValue, slider.getThumb());
	if(Ext.get(this.slider_fill_id)){
	    Ext.get(this.slider_fill_id).setStyle({width : slidermaxwidth+'px'});
	}
	
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