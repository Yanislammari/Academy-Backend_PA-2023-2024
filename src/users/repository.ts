import mongoose from "mongoose"
import IRepository from "../../repository"
import { User, UserRole } from "./model"

const UserMongoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: {
    hash: String,
    salt: String,
  },
  role: { type: String, enum: Object.keys(UserRole) },
}, { strict: false });

UserMongoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserMongoSchema.set("toJSON", {
  virtuals: true,
});

UserMongoSchema.set("toObject", {
  virtuals: true,
});

const User = mongoose.model("users", UserMongoSchema);

async function getAll(): Promise<User[]> {
	const users = await User.find();
	return users.map((user) => user.toObject());
}

async function get(id: string): Promise<User> {
	const user = await User.findById(id);
	if(!user) {
		throw new Error("User not found");
	}
	return user?.toObject();
}

async function getByEmail(email: string): Promise<User | null> {
	const user = await User.findOne({ email });
	return user ? user.toObject() : null;
}

async function getByPseudo(pseudo: string): Promise<User | null> {
	const user = await User.findOne({ pseudo });
	return user ? user.toObject() : null;
}

async function getByRole(role: UserRole): Promise<User | null> {
	const user = await User.findOne({ role });
	return user ? user.toObject() : null;
}

async function add(attributes: User): Promise<User> {
	const user = await new User(attributes).save();
	return user.toObject();
}

async function deleteOne(id: string): Promise<void> {
	const result = await User.findByIdAndDelete(id);
	if(!result) {
		throw new Error("User not found");
	}
}

async function put(id: string, attributes: User): Promise<User> {
	const newUser = await User.findByIdAndUpdate(id, attributes);
	if(!newUser) {
		throw new Error("User not found");
	}
	return newUser?.toObject();
}

export interface IUserRepository extends IRepository<User> {
	getByEmail: (email: string) => Promise<User | null>;
	getByPseudo: (pseudo: string) => Promise<User | null>;
	getByRole: (role: UserRole) => Promise<User | null>;
}

const repository: IUserRepository = {
	add,
	get,
	getByEmail,
	getByPseudo,
	getByRole,
	put,
	deleteOne,
	getAll
};

export default repository;
