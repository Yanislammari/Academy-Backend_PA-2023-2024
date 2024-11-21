import mongoose from "mongoose";
import { Comment } from "./model";

const CommentSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	courseId: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model<Comment & mongoose.Document>("comments", CommentSchema);

async function getAll(): Promise<Comment[]> {
	const comments = await CommentModel.find();
	return comments.map(comment => comment.toObject());
}

async function get(id: string): Promise<Comment> {
	const comment = await CommentModel.findById(id);
	if(!comment) {
			throw new Error("Comment not found");
	}
	return comment.toObject();
}

async function add(attributes: Comment): Promise<Comment> {
	const comment = await new CommentModel(attributes).save();
	return comment.toObject();
}

async function deleteOne(id: string): Promise<void> {
	const result = await CommentModel.findByIdAndDelete(id);
	if(!result) {
			throw new Error("Comment not found");
	}
}

async function put(id: string, attributes: Comment): Promise<Comment> {
	const updatedComment = await CommentModel.findByIdAndUpdate(id, attributes, { new: true });
	if(!updatedComment) {
			throw new Error("Comment not found");
	}
	return updatedComment.toObject();
}

async function deleteByUserId(userId: string): Promise<void> {
	await CommentModel.deleteMany({ userId });
}

async function deleteByCourseId(courseId: string): Promise<void> {
  await CommentModel.deleteMany({ courseId });
}

export interface ICommentRepository {
	getAll: () => Promise<Comment[]>;
	get: (id: string) => Promise<Comment>;
	add: (attributes: Comment) => Promise<Comment>;
	deleteOne: (id: string) => Promise<void>;
	put: (id: string, attributes: Comment) => Promise<Comment>;
	deleteByUserId: (userId: string) => Promise<void>;
	deleteByCourseId: (courseId: string) => Promise<void>;
}

const commentRepository: ICommentRepository = {
	getAll,
	get,
	add,
	deleteOne,
	put,
	deleteByUserId,
	deleteByCourseId
};

export default commentRepository;
