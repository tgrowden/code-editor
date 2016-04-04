$(function() {
  window.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true
  });
  window.setLang = function(lang) {
    $('#lang').html('<script src="/components/codemirror/mode/' + lang + '/' + lang + '.js"></script>');
    editor.setOption("mode", lang);
  };
  setLang('javascript');
});
