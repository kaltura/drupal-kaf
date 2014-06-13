

kalturakaf = {
    load: function(target, url, removeTitle)
    {
        if(removeTitle)
        {
            jQuery('#page-title').hide();
            jQuery('h1.page-header').hide();
        }
        // build frame object
        var frame = document.createElement("iframe");
        frame.src = url;
        
        // convert to jQuery variable to add more attributes easily
        var jFrame = jQuery(frame)
                .attr('frameBorder', "0")
                .width("100%")
                .height("600px");
        // place HTML
        jQuery('#'+target).html(jFrame);
    },
    
    setFieldValue: function(element, val, thumb)
    {
        console.log('called with '+val+' on element '+element);
        console.log(jQuery('#'+element));
        var parts = element.split('-');
        var count = parts[parts.length-1];
        jQuery("#"+element).val(val);
        var a = jQuery('.ui-dialog-titlebar-close');
        var img = document.createElement('img');
        var jImg = jQuery(img).css('width', '120px').css('height', '90px').attr('src', thumb).addClass('kalturakaf-thumbnail');
        jQuery('img.kalturakaf-thumbnail-'+count).remove();
        jQuery('#kalturakaf-selector-'+count).after(jImg);
        a.click();
    }
}

/*
jQuery(document).ready(function(){
    alert(1);
});*/

Drupal.behaviors.simpleDialogLoaded = {
  attach: function (context, settings) {
      var id = jQuery(context).attr('id');
      if('simple-dialog-container' == id)
      {
          var mydiv = jQuery('#bse');
          if(mydiv != 'undefined' && mydiv != undefined)
          {
              var url = jQuery('#kaf_url').val();
              kalturakaf.load('bse', url, false);
          }
      }
  }
};
