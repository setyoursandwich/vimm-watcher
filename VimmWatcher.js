"use strict";

/**
* vimm watcher object to track the viewers in vimmchat how many seconds they are watching the channel and call a customcallback
* written by @foreveraverage
* steemit: @foreveraverage
* twitter: @foreverxaverage
* youtube: https://www.youtube.com/channel/UCkDrEwI5Pzq2s5nSJ-xqejg
**/

let VimmWatcher = function(){   
    let channel;
    let viewers = [];
    let customCallBack = undefined;
    
    /**
    * Set the parameters for the global object
    * @param {string} channelName the name of the channel to watch
    */
    let initialize = function( channelName ){
        channel = channelName;
    }
    
    /**
    * start counting how long the viewers are in chat
    * @param {int} seconds after how many seconds we make a new call, leave empty for default 1 second
    */
    let start = function( seconds = 1 ){
        let count = setInterval(function(){ 
        getVimmViewers( channel, function(e){
            for(let i = 0; i < e.length; i++){
                let viewerName = e[i].fields.chatter;
                if( viewers[viewerName] === undefined ){
                    viewers[viewerName] = 0;
                }else{
                viewers[viewerName]+=seconds;
                }
            }
            //if a custom callback is set, trigger it
            if( customCallBack !== undefined ){
                customCallBack();
            }
         }); 
      }, seconds*1000);
    }

    /**
    * Make an api call to the vimm api to find out who's in chatter
    * When done trigger the callback function given
    * @param {string} channel the channel name from which we want to know the viewers
    * @param {function} callback the callback function which we want to trigger and pass the data once the server replied
    */
    function getVimmViewers( channel, callback ){
        let url = 'https://www.vimm.tv/presence/'+channel;
        let xhr  = new XMLHttpRequest();
    
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            callback( data );
        }
        };
        xhr.send();
    }
    
    /**
    * set a custom callback to call whenever viewers is updated
    */
    
    function setCustomCallBack( callback ){
        customCallBack = callback;
    }
    
    return {
        viewers: viewers,
        initialize: initialize,
        start: start,
        setCustomCallBack: setCustomCallBack
    }
}