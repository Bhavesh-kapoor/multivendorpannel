import ApiResponse from "../../../utils/apiResponse.js";

const index = (req, res) => {
  return res.render("users/list");
};


const create = (req, res) => {

  return res.render("users/add");

}

const logout = (req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  }
  // Clear the 'useraccesstoken' cookie and return a success message
  res.status(200)
    .clearCookie('useraccesstoken', options);
  res.redirect('/auth/login');

}
export { index, create, logout };
