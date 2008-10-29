/*********************************
 * Settings
*********************************/

jQuery.validators = {
    url: /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/,
    number: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
    string: /[a-zA-Z]+/,
    email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
    ip: /\b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b/,
	permanent: function(val) {
		return !/(mallinator|trashymail|maileater|spamhole|pookmail)\.com$/.test(val);
	}
}
jQuery.jValidateSettings = {
    addClassToParent: true,
    addClassToForm: true,
    addClassToInput: true,
    validClass: 'valid',
    invalidClass: 'invalid',
    invalidFunction: false,
    validFunction: false,
	cancelFormSubmit: true
}

/*********************************
 * Functions
*********************************/

jQuery.fn.isValid = function() {
    target = this[0];
    if(/input/i.test(target.nodeName)) {
        i = 0;
        jQuery.each(jQuery.validators, function(x, y) {
           if(jQuery(target).hasClass(x)) {
	 			if(jQuery.isFunction(y)) {
					if(!y(target.value)) i++;
				} else if(!y.test(target.value)) i++;
           }
        });
        if(jQuery(target).attr('rel') != undefined && /\[.*\]/.test(jQuery(target).attr('rel'))) {
            params = jQuery(target).attr('rel').replace(/\[/, '');
            params = params.replace(/\]/, '');
            params = params.replace(/ /, '');
            params = params.split(',');
            length = jQuery(target).attr('value').length;
            if(params.length == 1 && length < params[0]) {
                i++;
            } else if(params.length == 2 && (length < params[0] || params[1] < length)) {
                i++;
            }
        }
		return (i == 0) ? true : false;
    } else if(/form/i.test(target.nodeName)) {
		form = target;
		jQuery(target).find('input').each(function() {
			if(!jQuery(this).isValid()) {
				ar = jQuery(this).parents('form');
				tar = ar[0];
				i = $(tar).attr('rel');
				if(i == undefined) i = 0;
				i = parseInt(i) + 1;
				$(tar).attr('rel', i);
			}
		});
		i = jQuery(form).attr('rel');
		return (i == undefined) ? true : false;
	} else {
        return true;
    }
}

jQuery.fn.validate = function() {
    jQuery.each(this, function() {
        if(/form/i.test(this.nodeName)) {
			if(jQuery(this).isValid()) {
				return true;
			} else {
				return false;
			}
        } else if(/input/i.test(this.nodeName) && !/submit/i.test(this.type)) {
            addClass = (jQuery(this).isValid()) ? jQuery.jValidateSettings.validClass : jQuery.jValidateSettings.invalidClass;
            removeClass = (!jQuery(this).isValid()) ? jQuery.jValidateSettings.validClass : jQuery.jValidateSettings.invalidClass;
            if(jQuery.jValidateSettings.addClassToInput) {
                jQuery(this).removeClass(removeClass);
                jQuery(this).addClass(addClass);
            }
            if(jQuery.jValidateSettings.addClassToParent) {
                jQuery(this).parent().removeClass(removeClass);
                jQuery(this).parent().addClass(addClass);
            }
            if(jQuery.jValidateSettings.addClassToForm) {
                jQuery(this).parents('form').removeClass(removeClass);
                jQuery(this).parents('form').addClass(addClass);
            }
            if(jQuery.isFunction(jQuery.jValidateSettings.validFunction) && jQuery(this).isValid()) {
                jQuery.jValidateSettings.validFunction(this);
            }
            if(jQuery.isFunction(jQuery.jValidateSettings.invalidFunction) && !jQuery(this).isValid()) {
                jQuery.jValidateSettings.invalidFunction(this);
            }
        } else if(/select/i.test(this.nodeName)) {
            return true;
        }
    });
};

jQuery.fn.validateOnChange = function () {
    jQuery.each(this, function() {
       if(/form/i.test(this.nodeName)) {
            jQuery(this).find('input').validateOnChange();
			if(jQuery.jValidateSettings.cancelFormSubmit) {
				jQuery(this).submit(function() {
					if(!jQuery(this).isValid) {
						return false;
					}
				});
			}
       } else if(/input/i.test(this.nodeName) && !/submit/i.test(this.type)) {
            jQuery(this).blur(function() {
                jQuery(this).validate();
            });
       }
    });
}

/*********************************
 * Selectors
*********************************/

jQuery.extend(jQuery.expr[':'], {
    valid: "jQuery(a).isValid();",
    invalid: "!jQuery(a).isValid();"
});