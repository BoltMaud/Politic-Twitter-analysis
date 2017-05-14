
$("#menu").load("html/menu.html");
$("#container").load("html/acceuil.html");


// -------------------------------------------------------------------------------
// onclick menu followers_communs
function followers_communs(){
    $("#button-menu").sideNav('hide');
    $("#container").load("html/followers_50first.html");
    initialisation_graph();
}

// -------------------------------------------------------------------------------
// onclick menu themes des tweets
function tropes_tweets(file){
    $("#button-menu").sideNav('hide');
    $("#container").load("html/tropes_tweets.html");
    load_data(file);
}


// -------------------------------------------------------------------------------
// onclick menu hashtags
function hashtags(){
    $("#button-menu").sideNav('hide');
    $("#container").load("html/visuhashtags.html");

}
// -------------------------------------------------------------------------------
// onclick menu emm
function emm(){
    $("#button-menu").sideNav('hide');
    $("#container").load("html/emm.html");
}

//--------------------------------------------------------------------------------
function lda_cote(){
    $("#button-menu").sideNav('hide');
    $("#container").load("html/lda_side.html");
}
//-----------------------------------------------------------------------------------
//couleurs des partis
var colors={
    "PS":"#FF6347",
    "PCD":"#4169E1",
    "LR":"#87CEEB",
    "FN":"#191970",
    "PG":"#E51F1F",
    "EE-LV":"#228B22",
    "PRG":"#FFD700",
    "NPA":"#FF4500",
    "FED":"#C0C0C0",
    "MoDem":"#FFA500",
    "PR":"#800080",
    "EM":"#FFFFFF"
};

//-------------------------------------------------------
//---- wait for 
function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name]) {
            callback(window[name]);
        } else {
            window.setTimeout(arguments.callee, interval);
        }
    }, interval);
}

