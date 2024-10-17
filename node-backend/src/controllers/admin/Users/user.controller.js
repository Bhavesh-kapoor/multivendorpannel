const index = (req, res) => {
  return res.render("users/list");
};


const create = (req, res) => {
  return res.render("users/add");

}
export { index ,create};
