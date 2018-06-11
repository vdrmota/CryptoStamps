global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;


// append default actions to menu for OSX
var initMenu = function () {
  try {
    var nativeMenuBar = new Menu();
    if (process.platform == "darwin") {
      nativeMenuBar.createMacBuiltin && nativeMenuBar.createMacBuiltin("CryptoStamps");
    }
  } catch (error) {
    console.error(error);
    setTimeout(function () { throw error }, 1);
  }
};

var aboutWindow = null;
var App = {

  // show external window
  about: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 600, width: 800};
    aboutWindow = new BrowserWindow(params);
    aboutWindow.loadURL('http://stamps.vojtadrmota.com');
  },

  explorer: function () {
      remote.shell.openExternal("http://stamps.vojtadrmota.com");
  },

  // change sidebar links
  cd: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

  }

};

$(document).ready(function() {

  initMenu();

  // var window = remote.getCurrentWindow();
  // window.toggleDevTools(); 

  $('[nw-path]').bind('click', function (event) {

    switch (this.name)
    {
      case "keys":
        $("#content").load("keys.html")
        break;
      case "collection":
        $("#content").load("collection.html");
        break;
     
    }

    event.preventDefault();
    App.cd(this);
  });

});
