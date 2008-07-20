jQuery.validators = {
    url: /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/,
    number: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
    string: /[a-zA-Z]+/,
    email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
    ip: /\b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b/
}
jQuery.fn.isValid = function() {
    target = this[0];
    if(/input/i.test(target.nodeName)) {
        i = 0;
        jQuery.each(jQuery.validators, function(x, y) {
           if(jQuery(target).hasClass(x) && !y.test(jQuery(target).attr('value'))) {
            i++;
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
        if(i == 0) {
            return true;
        } else {
            return false;
        }
    }
}
jQuery.fn.validate = function() {
    jQuery.each(this, function() {
        if(/form/i.test(this.nodeName)) {
            jQuery(this).find('input').validate();
        } else if(/input/i.test(this.nodeName) && !/submit/i.test(this.type)) {
            if(jQuery(this).isValid()) {
                jQuery(this).removeClass('invalid');
                jQuery(this).addClass('valid');
            } else {
                jQuery(this).removeClass('valid');
                jQuery(this).addClass('invalid');
            }
        } else if(/select/i.test(this.nodeName)) {
            return true;
        }
    });
};
$.extend($.expr[':'], {
    valid: "$(a).isValid();",
    invalid: "!$(a).isValid();"
});