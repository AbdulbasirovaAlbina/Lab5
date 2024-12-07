// Запросы
const getCooperator = "SELECT * FROM cooperator";
const getCooperatorById = "SELECT * FROM cooperator WHERE cooperator_id = $1";
const addCooperator =
  "INSERT INTO cooperator (last_name, name, birthday, city, dept_id, phone_number, passport_num, passport_ser, passport_data, salary, category, start_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
const updateCooperator =
  "UPDATE cooperator SET last_name = $1 WHERE cooperator_id = $2";
const removeCooperator = "DELETE FROM cooperator WHERE cooperator_id = $1";

const checkLastnameCooperator =
  "SELECT * FROM cooperator WHERE last_name = $1";
//Вызов хранимой процедуры БД
const procAddCooperator = "call proc_insert_cop($1, $2, $3, $4, $5, $6)"; //процедура добавления сотрудника с проверкой (по фамилии и имени), если уже есть такой сотрудник, тогда запись не добавляется
const procUpdateSalary = "call proc_increase_salary($1)"; //процедура процедуру, которая увеличит зарплату у сотрудников в таблице cooperator. При вызове процедура передается значение % на который будет увеличена зарплата. Условие увеличения зарплаты для каждого сотрудника, если у него среднее значение аттестации больше 4 и последняя оценка равна 5
const procRemoveCooperator = "call proc_delete_cooperator()"; //процедура, которая будет удалять сотрудника из отдела, если у него есть две оценки со значением 2. Процедура без входных параметров
module.exports = {
  getCooperator,
  getCooperatorById,
  addCooperator,
  updateCooperator,
  removeCooperator,
  checkLastnameCooperator,

  procAddCooperator,
  procUpdateSalary,
  procRemoveCooperator
}

