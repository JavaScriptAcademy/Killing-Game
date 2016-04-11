$(function () {
  $('[data-toggle="popover"]').popover();
  $('[data-spy="scroll"]').each(function () {
  debugger;
  var $spy = $(this).scrollspy('refresh')
});
})
