import { Request, Response } from "express";
import { createMessage, getMessages, getAllConversations } from "./repository";
import { IMessage } from "./model";

export const sendMessage = async (req: Request, res: Response) => {
	try {
		const { sender, receiver, message } = req.body;
		if(!sender || !receiver || !message) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const newMessage: IMessage = await createMessage({
			sender,
			receiver,
			message,
			timestamp: new Date()
		} as IMessage)

		res.status(201).json(newMessage);
	}
	catch(error) {
		res.status(500).json({ error: "An error occurred while sending the message" });
	}
};

export const fetchMessages = async (req: Request, res: Response) => {
  try {
		const { user1, user2 } = req.query;
		if(!user1 || !user2) {
			return res.status(400).json({ error: "Both user1 and user2 are required" });
		}

		const messages = await getMessages(user1 as string, user2 as string);
		res.status(200).json(messages);
  }
	catch(error) {
    res.status(500).json({ error: "An error occurred while fetching messages" });
  }
};

export const fetchConversations = async (req: Request, res: Response) => {
  try {
		const { userId } = req.params;
		if(!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}

		const conversations = await getAllConversations(userId);
		res.status(200).json(conversations);
  }
	catch(error) {
  	res.status(500).json({ error: "An error occurred while fetching conversations" });
  }
};
