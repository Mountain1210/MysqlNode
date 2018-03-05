
/*
 * GET home page.
 */

exports.index = function(req, res){
   // return "5555"
  res.render('index.jade', { title: 'Express' });
};

exports.numsecond = function(req, res){
   // return "5555"
  res.render('index.jade', { title: 'Express--second' });
};