const { roles } = require('../config/role');
const { Role } = require('../model/Role');
 

function CheckRole(action,resource) {
    return async (req,res,next)=>{
        try {
            const role = await Role.findById(req.user.role);
            console.log(role.name)
            const permission = roles.can(role.name)[action](resource);
            if (!permission.granted) {
             return res.status(401).json({
              error: "You don't have enough permission to perform this action"
             });
            }
            next()
           } 
        catch (error) {
            next(error)
        }
    }
}
module.exports = CheckRole;