import { Request, Response } from "express";
import { Comment, commentSchema } from "./model";
import commentRepository from "./repository";

export async function getComments(req: Request, res: Response) {
  try {
    const comments = await commentRepository.getAll();
    return res.status(200).json({ comments });
  } 
  catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCommentById(req: Request, res: Response) {
  try {
    const comment = await commentRepository.get(req.params.id);
    if(!comment) {
        return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json({ comment });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const { error, value } = commentSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const commentData: Comment = value;
    await commentRepository.add(commentData);
    return res.status(201).json({ comment: commentData });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const { error, value } = commentSchema.validate(req.body);
    if(error){
        return res.status(400).json({ error: error.details[0].message });
    }

    const updatedComment = await commentRepository.put(req.params.id, value);
    return res.status(200).json({ comment: updatedComment });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    await commentRepository.deleteOne(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully" });
  }
  catch(err) {
    res.status(404).json({ error: "Comment not found" });
  }
}
