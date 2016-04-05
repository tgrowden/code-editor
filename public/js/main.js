var uid = Date.now();
$(function() {
  var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    tabSize: 2
  });
  var setLang = function(lang) {
    $('#lang').html('<script src="/components/codemirror/mode/' + lang + '/' + lang + '.js"></script>');
    editor.setOption("mode", lang);
  };
  var setTheme = function(theme) {
    if (theme == "default"){
      $('#theme').empty();
    } else {
      $('#theme').html('<link rel="stylesheet" href="/components/codemirror/theme/' + theme + '.css" />');
    }
    editor.setOption("theme", theme);
  };
  setLang('javascript');
  $('#languageSelect').change(function() {
    setLang($(this).val());
  });
  $('#themeSelect').change(function() {
    setTheme($(this).val());
  });
  // Web Sockets
  var socket = io();
  socket.on('connection', function(data) {
    console.log(data);
  });
  editor.on("changes", function(change) {
    //console.log("change=", change);
    var code = editor.getValue();
    socket.emit('code-update', {
      uid: uid,
      code: code
    });
  });
  socket.on('code-update', function(data) {
    if (data.uid !== uid && data.code !== editor.getValue()) {
      editor.setValue(data.code);
    }
  });
});
