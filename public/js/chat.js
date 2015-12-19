

var default_config = {
    chat_url: "http://reverbim.com/chatserver",
    base_css: "http://reverbim.com/static/chat/css/chat.css",
    extra_css: null,
    developer_id: '00000000', // TODO
    channel_name: 'Chat',
    titlebar_text: '',
    default_display_name: '',
    ticket: null,
    container_selector: 'body',
    theme_id: 0,
    widget_id: null,
    callback: null
};

function setupReverb(config) {
    // Merge the specified config with the default (don't change either)
    var merged_config = $.extend({}, default_config, config);
    // Add the stylesheet(s).
    $('head').append("<link rel=\"stylesheet\" href=\"" + merged_config.base_css + "\" type=\"text/css\" />");
    if(merged_config.extra_css)
        $('head').append("<link rel=\"stylesheet\" href=\"" + merged_config.extra_css + "\" type=\"text/css\" />");
    if(merged_config.theme_id > 0 && merged_config.widget_id)
        $('head').append("<link rel=\"stylesheet\" href=\"http://reverbim.com/themer/get_css/"  + merged_config.theme_id +"/widget_"+ merged_config.widget_id + ".css\" type=\"text/css\" />");
    if(merged_config.theme_id > 0 && !merged_config.widget_id)
        $('head').append("<link rel=\"stylesheet\" href=\"http://reverbim.com/themer/get_css/"  + merged_config.theme_id +"/custom.css\" type=\"text/css\" />");

    // Figure out the width of any widgets already on the page.
    var width = 0;
    $.each($(merged_config.container_selector + ' .reverb-widget'), function(index, widget){
        width += $(widget).width() + 10;
    });


    $(merged_config.container_selector).append("<div class=\"reverb\"><div class=\"reverb-widget\"><div class=\"title-bar\"><div class=\"title-bar-text\"><span class=\"channel-name\"></span></div><span class=\"num-users\"></span><div class=\"title-bar-controls\"><div class=\"pop-out\"></div><div class=\"minimize\"></div></div></div><iframe scrolling=\"no\"></iframe></div></div>");
    var widget = $(merged_config.container_selector + ' .reverb-widget:last');

    
        $('.reverb').css('visibility','hidden');
    

    // Set the widget-id id in the parent element (should be .reverb)
    if(merged_config.widget_id != null)
        widget.parent().attr('id', 'widget-'+ merged_config.widget_id);

    // If a container for the widget has been explicitly passed in, change the position of the widget from fixed to relative.
    if(merged_config.container_selector != default_config.container_selector) {
        widget.css('position', 'relative');
    }

    function positionWidgets() {
        var w=0;
        $.each($(merged_config.container_selector + ' .reverb-widget'), function(index, widget){
            $(widget).css('right', w + 'px');
            w += $(widget).width() + 10;

            $(widget).parents('.reverb').css('visibility','visible');
        });

        // callback executes after load finishes
        if (merged_config.callback)
            merged_config.callback();
    }
    // If more than one widget, set position according to combined width of previous widget(s)
    if(merged_config.widget_id != null) {
        $('#widget-' + merged_config.widget_id + ' iframe').load(positionWidgets);
    }
    else {
        // If only one widget, set to right edge
        $(widget).css('right', '0px');
        $('.reverb').css('visibility','visible');
    }
    // Update the title of the chat widget.
    if(merged_config.titlebar_text)
        widget.find('.channel-name').html(merged_config.titlebar_text);
    else
        widget.find('.channel-name').html(merged_config.channel_name);


    // Setup a handler for the minimize button.
    var cookie_name = "reverb-"+(merged_config.developer_id)+"-"+(merged_config.channel_name)+"-minimized";
    var theIframe = widget.find('iframe');
    
        widget.find('.minimize').click(minimize);
        function minimize(){
            // Setting position to fixed hides the widget without interfering with the CSS heights being set
            if(theIframe.css('position') == 'fixed'){
                theIframe.css('position','relative');

                loadIframe(widget, merged_config);
            }
            else {
                theIframe.css('position','fixed');
            }

            setCookie(cookie_name, theIframe.css('position') == 'fixed');

        }
        widget.find('.pop-out').click(function(){
            popout_location = getIframeSrc(widget, merged_config);
            wopen(popout_location, merged_config.channel_name, 640, 480);
            // Minimize if not already
            if(theIframe.css('position') != 'fixed')
                minimize();
        });

        
        if (getCookie(cookie_name) != "true") {
            loadIframe(widget, merged_config);
            }
        if (getCookie(cookie_name) == "true") {
                theIframe.css('position','fixed');
                positionWidgets();
        }
    

}
function loadIframe(widget, merged_config) {
    var iframe_src = getIframeSrc(widget, merged_config)
    widget.find('iframe').attr('src', iframe_src);
}
function getIframeSrc(widget, merged_config) {
    // Work out the correct iframe source, and set it.
    var iframe_src = [merged_config.chat_url, 'chat/widget', merged_config.developer_id, merged_config.channel_name, merged_config.widget_id].join("/");
    // Create a mapping of parameters for the iframe.
    iframe_params = {}
    if(merged_config.extra_css) {
        iframe_params.extra_css = merged_config.extra_css;
    }
    if(merged_config.theme_id > 0) {
        iframe_params.theme_id = merged_config.theme_id;
    }
    if(merged_config.default_display_name) {
        iframe_params.default_display_name = merged_config.default_display_name;
    }
    if(merged_config.ticket) {
        iframe_params.ticket = merged_config.ticket;
    }
    // Append the extra css as URL params.
    iframe_src = iframe_src + '?' + $.param(iframe_params);
    return iframe_src;
}

function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}

function wopen(url, name, w, h)
{
    var win = window.open(url,
        name,
        'location=no, menubar=no, ' +
        'width=' + w + ', height=' + h + ', ' +
        'status=no, toolbar=no, scrollbars=no');
    win.resizeTo(w, h);
    win.focus();
}