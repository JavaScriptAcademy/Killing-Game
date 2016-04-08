Router.configure({
  layoutTemplate: 'Body',
});

Router.route('home',{
  path:'/',
  action: function() {
    this.render('DialogShow');
  }
});

Router.route('vote',{
  path:'/vote',
  action: function() {
    this.render('Vote');
  }
})