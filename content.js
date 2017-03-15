
//container for the list of links on the page
var links;

//containers for the existing settings and notifications links which we'll move around
var settingsAElement;
var notificationsAElement;

//container for the top left Support link which we'll use to place the other links
var supportAElement;

//remeber if the init script was run
initialRun = false;

function initExtension(){
  //we get a list of links on the page
  links = document.getElementsByTagName('a');
  for (var i = 0, l = links.length; i < l; i++) {
    console.log("links["+i+"].innerHTML:"+links[i].innerHTML);
    console.log("links["+i+"].href:"+links[i].href);
    
    if (links[i].innerHTML.trim()=="Notifications" && links[i].href.indexOf("/notifications")!=-1){
      //if this is the  Notification link in the left side area on the Settings page
      //this link leads to an "E-mail subscriptions" page so let's make that clear
      links[i].innerHTML="E-mail subscriptions";
    } else if (links[i].innerHTML.indexOf("Notifications<")==0 && links[i].href.indexOf("/notifications")!=-1){
      //if this is the Notifications link in the top right drop down menu
      //we'll move it to the top left menu where all account related links are
      notificationsAElement=links[i];
      links[i].parentNode.parentNode.removeChild(links[i].parentNode);
      l--;
      i--;
    } else if (links[i].innerHTML.trim().indexOf("Settings")==0 && links[i].href.indexOf("/settings/")!=-1){
      //if this is the Settings link in the top right drop down menu 
      //we'll move it to the top left menu where all account related links are
      settingsAElement=links[i];
      links[i].parentNode.parentNode.removeChild(links[i].parentNode);
      l--;
      i--;
    }else if (links[i].innerHTML.trim().indexOf("Support")==0 && links[i].href.indexOf("/support")!=-1){
      //remember the Support link in the top left menu, we'll use it to insert the other 2 links
      supportAElement=links[i];
    }
  }

  if (settingsAElement != undefined){
    //move the account level Settings link from the drop down
    supportAElement.parentNode.insertBefore(settingsAElement,supportAElement.nextSibling);

    //set the CSS Style for the top left menu
    settingsAElement.className="navLink ember-view"

    //we might be on a Settings page though in which case the link needs to be "active"
    if (window.location.href.indexOf("settings")!=-1 && window.location.href.indexOf("api")==-1 ){
        settingsAElement.className="navLink active ember-view"
    }

  }

  if (notificationsAElement != undefined){
    //move the account level Notifications link from the drop down
    supportAElement.parentNode.insertBefore(notificationsAElement,supportAElement.nextSibling);

    //set the CSS Style for the top left menu
    notificationsAElement.className="navLink ember-view"

    //we might be on a Notifications page though in which case the link needs to be "active"
    if (window.location.href.indexOf("notifications")!=-1 && window.location.href.indexOf("settings")==-1 ){
        notificationsAElement.className="navLink active ember-view"
    }

  }

  //we listen to clicks on page to make sure the 2 top links have the correct CSS styles
  document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement
    //console.log("click:"+target)
    if (target==settingsAElement){
      settingsAElement.className="navLink active ember-view"
      notificationsAElement.className="navLink ember-view"
    } else if (target==notificationsAElement){
      settingsAElement.className="navLink ember-view"
      notificationsAElement.className="navLink active ember-view"
    }
  }, false);

  //detect new page content changes
  var x = new MutationObserver(function(mutations) {
    //Content could have changed to a settings page which includes the misleading Notifications link which needs to be corrected
    if (window.location.href.indexOf("settings")!=-1 && window.location.href.indexOf("api")==-1 ){
      links = document.getElementsByTagName('a');
      for (var i = 0, l = links.length; i < l; i++) {
        if (links[i].innerHTML.trim()=="Notifications" && links[i].href.indexOf("/notifications")!=-1){
          //if this is the  Notification link in the left side menu from the Settings page
          //this link leads to an "E-mail subscriptions" page so let's rename it
          links[i].innerHTML="E-mail subscriptions";
        }
      }
    }
  });
  
  var elements = document.getElementsByClassName('aurora-body');
  var auroraBody = elements[0];
  x.observe(auroraBody, { childList: true });

}

//we're detecting when the main content is loaded onto the page through MutationObserver
var y = new MutationObserver(function(mutations) {
  /*mutations.forEach(function(mutation) {
    console.log(mutation.type);
    console.log(mutation.target);
    console.log(mutation.addedNodes.length);
  });*/

  //if elements were added to the #aurora-container go ahead and repalce the initial links
  if(mutations[0].addedNodes.length>=1 && initialRun == false){
    initialRun=true;
    initExtension();
  }  
});
y.observe(document.getElementById("aurora-container"), { childList: true });

//we're now using MutationObserver instead of setTimeout
//setTimeout( initExtension, 4000 );

/*
  Cases when settings link should be highlighted/active:
    https://cloud.digitalocean.com/settings/profile?i=xxx
    https://cloud.digitalocean.com/settings/billing?i=xxx
    https://cloud.digitalocean.com/settings/referrals?i=xxx
    https://cloud.digitalocean.com/settings/security?i=xxx
    https://cloud.digitalocean.com/settings/notifications?i=xxx

    https://cloud.digitalocean.com/settings/team?i=team
    https://cloud.digitalocean.com/settings/billing?i=team
    https://cloud.digitalocean.com/settings/security?i=team

  Cases when settings link should NOT be highlighted
    https://cloud.digitalocean.com/settings/api/tokens?i=xxx (API link is in the top left menu)

*/

/*
  Cases when the top Notifications link should be highlighted/active:
    https://cloud.digitalocean.com/notifications?i=xyz
  
  Cases when the top Notifications link should NOT be active:
    https://cloud.digitalocean.com/settings/notifications?i=xyz (E-mail subscriptions link is in the Settings area)
*/

