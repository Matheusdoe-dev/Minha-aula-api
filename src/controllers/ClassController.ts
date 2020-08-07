import { Request, Response } from "express";
import database from "../database/connection";
// utils
import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface Schedule {
  week_day: number;
  from: string;
  to: string;
}

const ClassController = {
  // criacao de aulas
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      materia,
      custo,
      schedule,
    } = request.body;

    const trx = await database.transaction();

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

      const classSchedule = schedule.map((c: Schedule) => {
        return {
          class_id,
          week_day: c.week_day,
          from: convertHoursToMinutes(c.from),
          to: convertHoursToMinutes(c.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit();

      return response.json({ name });
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: "Unexpected error while creating new class",
      });
    }
  },

  /////////////////
  // listagem
  async index(request: Request, response: Response) {
    const filters = request.query;

    const materia = filters.materia as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.materia || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to serach classes",
      });
    }

    const timeInMinutes = convertHoursToMinutes(time);

    const classes = await database("classes")
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

export default ClassController;
