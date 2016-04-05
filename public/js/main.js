var uid = Date.now();
$(function() {
  var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    tabSize: 2,
    language: 'markdown'
  });
  window.editor = editor;
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
  $('#languageSelect').change(function() {
    setLang($(this).val());
  });
  $('#themeSelect').change(function() {
    setTheme($(this).val());
  });
  // handle changing Options ====================
  var toggleOption = function(opt) {
    if (editor.getOption(opt) === true) {
      editor.setOption(opt, false);
    } else if (editor.getOption(opt) === false) {
      editor.setOption(opt, true);
    }
  };
  $('li.codeOptions').click(function() {
    $(this).toggleClass('active');
    if ($(this).attr('data-type') == "boolean") {
      var opt = $(this).attr('data-value');
      toggleOption(opt);
    }
  });
  //end option handling =========================
  // Web Sockets
  var socket = io();
  socket.on('connection', function(data) {
    console.log(data);
  });
  editor.on("change", function(instance, change) {
    console.log("change=", change.from, "\n", change.text);
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
