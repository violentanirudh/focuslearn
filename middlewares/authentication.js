const { validateToken } = require("../services/authentication");

const checkAuthentication = () => {
  return async (req, res, next) => {
      const token = req.cookies?.user
      if ( !token ) return next()
      
      const user = await validateToken(token)
      if ( !user) return next()

      req.user = user
      res.locals.user = user
      return next()
  }
}

const checkAuthorization = (roles) => {
  return (req, res, next) => {
      if (!req.user) return res.status(401).redirect('/signin')
      if (!roles.includes(req.user.role)) return res.status(401).redirect('/')
      return next()
  }
}

module.exports = {
  checkAuthentication,
  checkAuthorization
};
