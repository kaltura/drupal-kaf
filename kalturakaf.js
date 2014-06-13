kalturakaf = {
    // function used to place a KAF iframe in the page
    load: function(target, url, removeTitle)
    {
        // hack for removing the "drupal title" in the page, so we don't have duplicate titles (for example, in my-media page)
        if(removeTitle)
        {
            jQuery('#page-title').hide();
            jQuery('h1.page-header').hide();
        }
        
        // build iframe object
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
    
    // function used to place the returned value from BSE into the form in node-edit page
    setFieldValue: function(element, val, thumb)
    {
        // playing with the element ID to support multiple fields in the same node type.
        var parts = element.split('-');
        var count = parts[parts.length-1];
        jQuery("#"+element).val(val);
        
        var a = jQuery('.ui-dialog-titlebar-close');
        
        // adding thumbnail of the selected video to the edit page
        var img = document.createElement('img');
        var jImg = jQuery(img).css('width', '120px').css('height', '90px').attr('src', thumb).addClass('kalturakaf-thumbnail');
        
        // remove previous thumbnail in case the user is "replacing" the video
        jQuery('img.kalturakaf-thumbnail-'+count).remove();
        jQuery('#kalturakaf-selector-'+count).after(jImg);
        
        // closing the modal
        a.click();
    }
}

/**
 * register behavior so we can place the BSE iframe in the modal once the modal is ready
 * @type type
 */
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
