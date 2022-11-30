
async function setKey(key,time, value){
  await redisClient.setEx(key,time,value);
}
async function getKey(key){
    // return async (req,res,next)=>{
    const data = await redisClient.get(key);
    // console.log(data);
    redisClient.keys('*', function (err, keys) {
      // console.log('1');
      if (err) console.log(err);
       
      for(var i = 0, len = keys.length; i < len; i++) {
        console.log(keys[i]);
      }
    });      
    return data;
      // if(data) return res.send(data);
      // else next();
      // await redisClient.get(key, (error, data) => {
      //   if (error) res.status(400).send(error); 
      //   if (data !== null) res.status(200).send(data);
      //   else next();
      //  });
    // next();
}

// exports.setKey = setKey;
exports.getKey = getKey;
exports.setKey = setKey