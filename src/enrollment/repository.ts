import { Enrollment, EnrollmentStatus } from "./model";
import mongoose from "mongoose";

const ProgressionSchema = new mongoose.Schema({
  lessonsFinish: { type: Array<String>, default: [] },
  exercicesSuccess: { type: Array<String>, default: [] },
  attempts: { type: Number, default: 0 }
});

const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  enrolledDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(EnrollmentStatus), required: true },
  progression: { type: ProgressionSchema, required: true }
});

EnrollmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

EnrollmentSchema.set("toJSON", {
  virtuals: true,
});

EnrollmentSchema.set("toObject", {
  virtuals: true,
});

const EnrollmentModel = mongoose.model<Enrollment & mongoose.Document>("enrollments", EnrollmentSchema);

async function getAll(): Promise<Enrollment[]> {
  const enrollments = await EnrollmentModel.find()
  return enrollments.map((enrollment) => enrollment.toObject());
}

async function getAllByStudentId(studentId: string): Promise<Enrollment[]> {
  const enrollments = await EnrollmentModel.find({ studentId: new mongoose.Types.ObjectId(studentId) });
  return enrollments.map((enrollment) => enrollment.toObject());
}

async function get(id: string): Promise<Enrollment> {
  const enrollment = await EnrollmentModel.findById(id);
  if(!enrollment) {
    throw new Error("Enrollment not found");
  }
  return enrollment.toObject();
}

async function add(attributes: Enrollment): Promise<Enrollment> {
  const enrollment = await new EnrollmentModel(attributes).save();
  return enrollment.toObject();
}

async function deleteOne(id: string): Promise<void> {
  const result = await EnrollmentModel.findByIdAndDelete(id);
  if(!result) {
    throw new Error("Enrollment not found");
  }
}

async function deleteManyByCourseId(courseId: string): Promise<void> {
  await EnrollmentModel.deleteMany({ courseId: courseId });
}

async function deleteManyByStudentId(studentId: string): Promise<void> {
  await EnrollmentModel.deleteMany({ studentId: studentId });
}

async function put(id: string, attributes: Enrollment): Promise<Enrollment> {
  const newEnrollment = await EnrollmentModel.findByIdAndUpdate(id, attributes, { new: true });
  if(!newEnrollment) {
    throw new Error("Enrollment not found");
  }
  return newEnrollment.toObject();
}

async function addLessonFinish(enrollmentId: string, lessonId: string): Promise<Enrollment> {
  const enrollment = await EnrollmentModel.findById(enrollmentId);
  if(!enrollment) {
    throw new Error("Enrollment not found");
  }
  if(!enrollment.progression) {
    enrollment.progression = { lessonsFinish: [], exercicesSuccess: [], attempts: 0 };
  }
  if(!Array.isArray(enrollment.progression.lessonsFinish)) {
    enrollment.progression.lessonsFinish = [];
  }

  enrollment.progression.lessonsFinish.push(lessonId);
  await enrollment.save();
  return enrollment.toObject();
}

async function setExercisesSucess(enrollmentId: string, exercisesId: String[]): Promise<Enrollment> {
  const enrollment = await EnrollmentModel.findById(enrollmentId);
  if(!enrollment) {
    throw new Error("Enrollment not found");
  }
  
  enrollment.progression.exercicesSuccess = exercisesId;
  enrollment.progression.attempts = (enrollment.progression.attempts || 0) + 1;
  await enrollment.save();
  return enrollment.toObject();
}

async function getByCourseIdAndStudentId(courseId: string, studentId: string): Promise<Enrollment | null> {
  const enrollment = await EnrollmentModel.findOne({ courseId: courseId, studentId: studentId });
  if(!enrollment) {
    return null;
  }
  return enrollment.toObject();
}

async function getLessonsIdOfAnProgressionEnrollment(enrollmentId: string): Promise<String[]> {
  const enrollment = await EnrollmentModel.findById(enrollmentId);
  if(!enrollment) {
    throw new Error("Enrollment not found");
  }
  return enrollment.progression.lessonsFinish
}

export interface IEnrollmentRepository {
  getAll: () => Promise<Enrollment[]>;
  getAllByStudentId: (studentId: string) => Promise<Enrollment[]>;
  get: (id: string) => Promise<Enrollment>;
  add: (attributes: Enrollment) => Promise<Enrollment>;
  addLessonFinish: (enrollmentId: string, lessonId: string) => Promise<Enrollment>;
  setExercisesSucess: (enrollmentId: string, exercisesId: string[]) => Promise<Enrollment>;
  deleteOne: (id: string) => Promise<void>;
  deleteManyByCourseId: (courseId: string) => Promise<void>;
  deleteManyByStudentId: (studentId: string) => Promise<void>;
  put: (id: string, attributes: Enrollment) => Promise<Enrollment>;
  getByCourseIdAndStudentId: (courseId: string, studentId: string) => Promise<Enrollment | null>;
  getLessonsIdOfAnProgressionEnrollment: (enrollmentId: string) => Promise<String[]>;
}

const enrollmentRepository: IEnrollmentRepository = {
  getAll,
  getAllByStudentId,
  get,
  add,
  addLessonFinish,
  setExercisesSucess,
  deleteOne,
  deleteManyByCourseId,
  deleteManyByStudentId,
  put,
  getByCourseIdAndStudentId,
  getLessonsIdOfAnProgressionEnrollment
};

export default enrollmentRepository;
