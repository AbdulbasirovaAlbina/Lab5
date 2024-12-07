const { Router } = require("express");
const controller = require("../Controllers/procedureController");

// создаем объект маршрутизатор
const router = Router();

// добавляем маршруты для хранимых процедур
router.post("/", controller.procAddCooperator);
router.put("/:percent", controller.procUpdateSalary);
router.delete("/", controller.procRemoveCooperator);

// экспортируем маршрутизатор на server
module.exports = router;
