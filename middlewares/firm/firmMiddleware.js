const onlyFirmCanAccess = async(req, res, next) => {
    console.log('OnlyAdminCanAccess middleware running...');
    console.log('req.user:', req.user);
    try {

        if (req.user.user.role != 2) { // Not Equal to Firm (Access only when the user role is 2)
            console.log("User Detail :" , req.user.user.role)
            
            return res.status(400).json({
                success: false,
                msg: 'Access denied. Only Admin have permission for this operation.'
            });

        }
    

        
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: 'Oops! Something went wrong. Please try again later.'
        });
    }

    return next();

};

module.exports = {
    onlyFirmCanAccess
}