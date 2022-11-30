const AccessControl = require("accesscontrol");
const ac = new AccessControl();
exports.roles = (function() {
    ac.grant('Editor').createAny('Category').deleteAny('Category').readAny('Category')
    .updateAny('Category').createAny('Post').deleteAny('Post').readAny('Post').updateAny('Post')
    .readOwn('User').updateOwn('User').deleteAny('Comment').readAny('Comment')
    ac.grant('Admin').extend('Editor').readAny('User').updateAny('User').createAny('User').deleteAny('User').createAny('Role')
    return ac;
 })();

