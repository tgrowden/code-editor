var uid = Date.now();
function Notify(msg, type) {
  $.notify({
    message: msg
  }, {
    type: type
  });
}
$(function() {
  window.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    tabSize: 2,
    language: 'markdown'
  });
  var editor = window.editor;
  var setLang = function(lang) {
    $('#lang').html('<script src="/components/codemirror/mode/' + lang + '/' + lang + '.js"></script>');
    //handling for c-like languages
    if (lang == "c++" || name == "c" || name == "c#") {
      editor.setOption("mode", "clike");
    } else {
      editor.setOption("mode", lang);
    }
    if (lang == 'markdown') {
      $('#md-code').show();
    } else {
      $('#md-code').hide();
    }
  };
  var setTheme = function(theme) {
    if (theme == "default") {
      $('#theme').empty();
    } else {
      $('#theme').html('<link rel="stylesheet" href="/components/codemirror/theme/' + theme + '.css" />');
    }
    editor.setOption("theme", theme);
  };
  $('#languageSelect').change(function() {
    var lang = $(this).val();
    setLang(lang);
    var data = {
      language: lang,
      uid: uid
    };
    socket.emit('changeLanguage', data);
  });
  $('#themeSelect').change(function() {
    var theme = $(this).val();
    setTheme(theme);
  });
  var cursor;
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
    //send data that new user has connected
    socket.emit('new-user', uid);

    //@TODO create 'updateRequired' handling for sending existing data to newly connected user
  });
  editor.on("change", function(instance, change) {
    $('#md-code').html((marked(editor.getValue())));
    if (change.origin != "setValue") {
      socket.emit('code-update', {
        uid: uid,
        change: change,
        code: editor.getValue()
      });
    }
  });
  //handle notifications of new user
  socket.on('new-user', function(data) {
    if (data != uid) {
      Notify("A new user has connected", "success");
    }
  });
  socket.on('code-update', function(data) {
    if (data.uid != uid) {
      editor.setValue(data.code);
      editor.setCursor(cursor.line, cursor.ch);
    }
  });
  socket.on('changeLanguage', function(data) {
    var getName = function(user) {
      if (user == uid) {
        return "You";
      } else {
        return "Someone else";
      }
    };
    if (data.uid != uid) {
      $('#languageSelect').val(data.language);
      console.log(data.uid + " updated language to " + data.language);
    }
    Notify(getName(data.uid) + " updated language to <strong>" + $('#languageSelect option:selected').text() + "</strong>", "success");
  });

  function getCodeData() {
    var data = {
      code: editor.getValue(),
      language: $('#languageSelect').val(),
      uid: uid
    };
    return data;
  }
  editor.on("beforeChange", function() {
    cursor = editor.getCursor();
    console.log("this is before change");
  });
});
