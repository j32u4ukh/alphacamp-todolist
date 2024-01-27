module.exports = (req, res, next) => {
  // 相當於傳入 views 的參數，存入 locals 的變數可以再任意位置存取
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
};
