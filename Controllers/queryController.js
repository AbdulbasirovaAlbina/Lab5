//имопрт пула БД
const pool = require("../db");
const queries = require("../queries");

//выборка всех записей из таблицы Cooperator
const getCooperator = (req, res) => {
  pool.query(queries.getCooperator, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
  });
};

//поиск записи по значению id
const getCooperatorById = (req, res) => {
  const id = parseInt(req.params.id); //получение значения Id
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    // запрос к БД по полученному Id
    if (error) throw error;
    res.status(200).json(results.rows); //если статус вернулся 200 тогда получить результат в формате json
  });
};

//добавление записи в таблицу Cooperator
const addCooperator = (req, res) => {
  const { last_name, name, birthday, city, dept_id, phone_number, passport_num, passport_ser, passport_data, salary, category, start_date } = req.body; // извлекаем данные из тела объекта

  // перед добавлением новой записи проверим есть ли такой сотрудник уже в БД
  pool.query(queries.checkLastnameCooperator, [last_name], (error, results) => {
    if (results.rows.length) {
      res.send("Last name already exists");
    } else {
      //если такого сотрудника нет в БД тогда выполняем следующее:
      pool.query(
        queries.addCooperator,
        [last_name, name, birthday, city, dept_id, phone_number, passport_num, passport_ser, passport_data, salary, category, start_date],
        (error, results) => {
          if (error) throw error; //если есть ошибка, то вывести сообщение об ошибке
          res.status(201).send("Cooperator inserted");
          console.log("Cooperator inserted");
        }
      );
    }
  });
};

//изменение фамилии сотрудника по значению id
const updateCooperator = (req, res) => {
  const id = parseInt(req.params.id);
  const { last_name } = req.body;

  //добавим проверку существует ли заданный по id сотрудник в таблице Cooperator
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    const noCooperatorFound = !results.rows.length;
    if (noCooperatorFound) {
      res.send("Cooperator does not exist in the DB");
    } else {
      // если сотрудник с заданным значением id существует, тогда выполняем следующие действия
      pool.query(queries.updateCooperator, [last_name, id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Cooperator updated successfully");
      });
    }
  });
};

//удаление записи по значению id
const removeCooperator = (req, res) => {
  const id = parseInt(req.params.id);

  //обработаем случай, когда в БД нет сотрудника, которого нужно удалить
  //проверка по id с использованием ранее созданного метода getCooperatorById
  pool.query(queries.getCooperatorById, [id], (error, results) => {
    const noCooperatorFound = !results.rows.length;
    if (noCooperatorFound) {
      res.send("Cooperator does not exist in the DB");
    } else {
      // если id сотрудника есть в таблице, тогда удалем этого сотрудника
      pool.query(queries.removeCooperator, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Cooperator removed successfully");
      });
    }
  });
};

// экспортируем модуль как объект, в котором будет несколько функций
module.exports = {
  getCooperator,
  getCooperatorById,
  addCooperator,
  updateCooperator,
  removeCooperator,
};
