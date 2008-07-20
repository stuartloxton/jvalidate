jQuery.validators = {
    url: /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/,
    number: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
    string: /[a-zA-Z]+/,
    email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
    ip: /\b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b/
}
jQuery.fn.validate = function() {
    i = 0;
    target = jQuery(this)[0];
    if(/input/i.test(target.nodeName)) {
        jQuery.each(jQuery.validators, function(x, y) {
            if(jQuery(target).hasClass(x) && !y.test(jQuery(target).attr('value'))) {
                i++;
            }
        });     
    } else  { i++; }
    if(jQuery(target).attr('rel') != undefined && /\[.*\]/.test(jQuery(target).attr('rel'))) {
        params = jQuery(target).attr('rel').replace(/\[/, '');
        params = params.replace(/\]/, '');
        params = params.replace(/ /, '');
        params = params.split(',');
        length = jQuery(this).attr('value').length
        if(params.length == 1 && length < params[0]) {
            i++;
        } else if(params.length == 2 && (length < params[0] || params[1] < length)) {
            i++;
        }
    }
    return (i == 0) ? true : false;
};
$.extend($.expr[':'], {
    valid: "$(a).validate();",
    invalid: "!$(a).validate();"
});