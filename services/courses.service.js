const faker = require('faker');
const boom = require('@hapi/boom');
const CourseModel = require('./../models/courses.model');

class CoursesService {

  constructor() {
    this.courses = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++)
      this.courses.push({
        idCourse: faker.datatype.uuid(),
        title: faker.random.words(),
        image: faker.image.imageUrl(),
        description: faker.random.words(),
        price: faker.datatype.number(),
        school: faker.name.findName()
      });

  }

  find(size) {
    const courses = this.courses.filter((item, index) => item && index < size);
    if (!courses || courses.length < 1)
      throw boom.notFound('No hay cursos aún');
    return courses;
  }

  create(data) {
    const newCourse = {
      idCourse: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.courses.push(newCourse);
    return newCourse;
  }

  findOne(idCourse) {
    const course = this.courses.find((item) => item.idCourse === idCourse)
    if (!course)
      throw boom.notFound('Id Curso no encontrado');
    return course;
  }

  update(idCourse, changes) {
    const index = this.courses.findIndex(item => item.idCourse === idCourse);
    if (index === -1)
      throw boom.notFound('No existe ese curso');

    var currentCourses = this.courses[index];
    this.courses[index] = {
      ...currentCourses,
      ...changes
    };
    return {
      old: currentCourses,
      changed: this.courses[index]
    }
  }

  delete(idCourse) {
    const index = this.courses.findIndex(item => item.idCourse === idCourse);
    if (index === -1)
      throw boom.notFound('Curso no encontrado para eliminar');
    var currentCourses = this.courses[index];
    this.courses.splice(index, 1);
    return currentCourses;
  }

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let coursesDB = await CourseModel.find(filter);

    if (!coursesDB || coursesDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    coursesDB = limit ? coursesDB.filter((item, index) => item && index < limit) : coursesDB;
    return coursesDB;
  }

  async createDB(data) {
    const model = new CourseModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const course = await CourseModel.findOne({
        _id: id
      });
      if (!course)
        throw boom.notFound('No se ha encontrado coincidencia');
      return course;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let course = await CourseModel.findOne({
      _id: id
    });
    if (!course)
      throw boom.notFound('No se ha encontrado coincidencia');

    let courseOrigin = {
      title: course.title,
      image: course.image,
      description: course.description,
      price: course.price,
      school: course.school
    };

    const { title, image, description, price, school } = changes;
    course.title = title;
    course.image = image;
    course.description = description;
    course.price = price;
    course.school = school;
    course.save();

    return {
      old: courseOrigin,
      changed: course
    }
  }

  async deleteDB(id) {
    let course = await CourseModel.findOne({
      _id: id
    });
    const { deletedCount } = await CourseModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return course;
  }

}

module.exports = CoursesService;
