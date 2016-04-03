$(function() {
  var flask = new CodeFlask;
  var flaskLang = '';
  flask.run('#code-wrapper', {language: flaskLang});
  flask.onUpdate(function(code) {
    console.log("User's input code: " + code);
  });
  $('#languageSelect').on('change', function() {
    var flaskLang = this.value;
    var foo = $('#code-wrapper code').text();
    flask.run('#code-wrapper', {language: flaskLang});
    flask.update(foo);
  });
  $('#themeSelect').on('change', function() {
    var theme = this.value;
    if (theme == 'default') {
      $('#prism-css').html('<link rel="stylesheet" href="/css/themes/prism.css" />');
    } else {
      $('#prism-css').html('<link rel="stylesheet" href="/css/themes/prism-' + theme + '.css" />');
    }
  });
});
