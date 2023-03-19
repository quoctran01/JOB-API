const notFound = (req, res) => {
  return res.status(404).send("Router does not exist");
};
module.exports = notFound;
