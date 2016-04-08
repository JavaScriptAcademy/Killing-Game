Router.configure({
 layoutTemplate: 'Body'
});

Router.route('/', function () {
  this.render('Body');
});