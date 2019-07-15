var forever = require('hexo');
var child = forever.start([ 'hexo', 's','-p','1314'], {
  max : 1,
  silent : true
});
