// Запросы
const getCooperator = "SELECT * FROM cooperator";
const getCooperatorById = "SELECT * FROM cooperator WHERE cooperator_id = $1";
const addCooperator =
  "INSERT INTO cooperator (surname, name, birthday, city, dept_id) VALUES ($1, $2, $3, $4, $5)";
const updateCooperator =
  "UPDATE cooperator SET surname = $1 WHERE cooperator_id = $2";
const removeCooperator = "DELETE FROM cooperator WHERE cooperator_id = $1";

const checkLastnameCooperator =
  "SELECT c FROM cooperator c WHERE c.surname = $1";

module.exports = {
  getCooperator,
  getCooperatorById,
  addCooperator,
  updateCooperator,
  removeCooperator,
  checkLastnameCooperator
};
