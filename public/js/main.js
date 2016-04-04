var uid = Date.now();
$(function() {
  var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    tabSize: 2
  });
  window.editor = editor;
  window.setLang = function(lang) {
    $('#lang').html('<script src="/components/codemirror/mode/' + lang + '/' + lang + '.js"></script>');
    window.editor.setOption("mode", lang);
  };
  window.setLang('javascript');
// Web Sockets
  var socket = io.connect('http://localhost:3000');
  socket.on('connection', function (data) {
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
  socket.on('code-update', function(data){
    if (data.uid !== uid) {
      while (data.code !== editor.getValue()) {
        editor.setValue(data.code);
      }
    }
  });

});
