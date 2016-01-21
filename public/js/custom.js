$(document).ready(function(){
    
/* JS Snippet for Tabs (not sure where else to put it?) */
    $('body').on('click','.egtab-handler',function(){
        $('.egtab-handler').removeClass('active');
        var tabcontID = $(this).attr('data-egtabtarget');
        $('.egtab-content').hide();
        $('#'+tabcontID).show();
        $(this).addClass('active');
    });
    
});