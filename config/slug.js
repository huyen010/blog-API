const slugify = require('slugify')
const {Post} = require('../model/Post');
// Slugify config options
const options = {
  replacement: '-',
  remove: undefined,
  lower: true,
  strict: false,
  locale: 'en',
  trim: true,
}
async function SlugF(title,check) {
    nb = await Post.countDocuments()+1;
    if(check == 1){
        return "Myblog.kh:/bai-viet/" + nb + "/" + slugify(title, options);
    }else{
        return "Myblog.kh:/danh-muc/" + slugify(title, options);
    }
}
module.exports = SlugF;