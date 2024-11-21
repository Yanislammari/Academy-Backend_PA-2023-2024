import Message, { IMessage } from './model';

export const createMessage = async (messageData: IMessage): Promise<IMessage> => {
	const message = new Message(messageData);
	return await message.save();
};

export const getMessages = async (user1: string, user2: string): Promise<IMessage[]> => {
	return await Message.find({
		$or: [
			{ sender: user1, receiver: user2 },
			{ sender: user2, receiver: user1 }
		]
	}).sort({ timestamp: 1 });
};

export const getAllConversations = async (userId: string): Promise<{ user: string, lastMessage: IMessage }[]> => {
  return await Message.aggregate([
		{
			$match: {
				$or: [
					{ sender: userId },
					{ receiver: userId }
				]
			}
    },
		{
      $sort: { timestamp: 1 }
    },
		{
      $group: {
				_id: {
					$cond: {
						if: { $eq: ["$sender", userId] },
						then: "$receiver",
						else: "$sender"
					}
				},
				lastMessage: { $last: "$$ROOT" }
      }
    },
		{
			$project: {
				_id: 0,
				user: "$_id",
				lastMessage: 1
			}
		}
	]);
};
