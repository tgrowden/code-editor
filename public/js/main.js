$(function() {
  function setLang(lang) {
    $('#lang').html('<script src="/components/codemirror/mode/' + lang + '/' + lang + '.js"></script>');
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
      lineNumbers: true,
      language: 'javascript'
    });
  }
//  setLang('javascript');
});
