"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
// utils
const convertHoursToMinutes_1 = __importDefault(require("../utils/convertHoursToMinutes"));
const ClassController = {
    // criacao de aulas
    async create(request, response) {
        const { name, avatar, whatsapp, bio, materia, custo, schedule, } = request.body;
        const trx = await connection_1.default.transaction();
        try {
            const insertedUsersIds = await trx("teachers").insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
            const teacher_id = insertedUsersIds[0];
            const insertedClassesIds = await trx("classes").insert({
                materia,
                custo,
                teacher_id,
            });
            const class_id = insertedClassesIds[0];
            const classSchedule = schedule.map((c) => {
                return {
                    class_id,
                    week_day: c.week_day,
                    from: convertHoursToMinutes_1.default(c.from),
                    to: convertHoursToMinutes_1.default(c.to),
                };
            });
            await trx("class_schedule").insert(classSchedule);
            await trx.commit();
            return response.json({ name });
        }
        catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: "Unexpected error while creating new class",
            });
        }
    },
    /////////////////
    // listagem
    async index(request, response) {
        const filters = request.query;
        const materia = filters.materia;
        const week_day = filters.week_day;
        const time = filters.time;
        if (!filters.week_day || !filters.materia || !filters.time) {
            return response.status(400).json({
                error: "Missing filters to serach classes",
            });
        }
        const timeInMinutes = convertHoursToMinutes_1.default(time);
        const classes = await connection_1.default("classes")
            .whereExists(function () {
            this.select("class_schedule.*")
                .from("class_schedule")
                .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
                .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
                .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
                .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
        })
            .where("classes.materia", "=", materia)
            .join("teachers", "classes.teacher_id", "=", "teachers.id")
            .select(["classes.*", "teachers.*"]);
        return response.json(classes);
    },
};
exports.default = ClassController;
