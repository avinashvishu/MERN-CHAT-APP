const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Model/chat");
const Message = require("../Model/message");
const User = require("../Model/user");
const PendingMessage = require("../Model/pendingMesage");
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    /* console.log("Invalid data passed into request"); */
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addPendingMessage = expressAsyncHandler(async (req, res) => {
  const { chatId, senderId } = req.body;

  if (!chatId || !senderId) {
    res.status(400).send("All required feilds are mandetory!");
  }

  try {
    let allReadyPendingMessage = await PendingMessage.find({
      $and: [{ sender: { $eq: senderId } }, { reciver: { $eq: req.user._id } }],
    });

    if (!allReadyPendingMessage.length) {
      let pendingMessages = await new PendingMessage({
        reciver: req.user._id,
        sender: senderId,
        chat: chatId,
      });
      await pendingMessages.save();
      let allPendingMessagesDocs = await PendingMessage.findById(
        pendingMessages._id
      )
        .populate("chat", "users")
        .populate("sender");

      res.status(201).json(allPendingMessagesDocs);
    } else {
      let allPendingMessagesDocs = await PendingMessage.findOne({
        _id: allReadyPendingMessage._id,
      })
        .populate("chat")
        .populate("sender");

      res.status(200).json(allPendingMessagesDocs);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

const addPendingMessageForGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatId, senderId } = req.body;

  if (!chatId || !senderId) {
    res.status(400).send("All required feilds are mandetory!");
  }
  try {
    let allReadyPendingMessageForGroupExists = await PendingMessage.find({
      isGroupChat: true,
      chat: chatId,
      reciver: { $eq: req.user._id },
    });

    if (!allReadyPendingMessageForGroupExists.length) {
      let pendingMessageForGroup = await new PendingMessage({
        isGroupChat: true,
        reciver: req.user._id,
        sender: senderId,
        chat: chatId,
      });
      await pendingMessageForGroup.save();
      res.status(201).json(pendingMessageForGroup);
    } else {
      let findAlredayExistedMessagesForGroup = await PendingMessage.findById(
        allReadyPendingMessageForGroupExists._id
      );
      res.status(200).json(findAlredayExistedMessagesForGroup);
    }
  } catch (error) {
    res.status(401).json(error);
  }
});
const fetchPendingMessage = expressAsyncHandler(async (req, res) => {
  let pendingMessages = await PendingMessage.find({ reciver: req.user._id });

  try {
    if (pendingMessages.length) {
      console.log("found");
      let allPendingMessagesDocs = await PendingMessage.find({
        reciver: req.user._id,
      })
        .populate("chat")
        .populate("sender");
      allPendingMessagesDocs = await User.populate(allPendingMessagesDocs, {
        path: "chat.users",
        select: "name picture email",
      });

      res.status(200).json(allPendingMessagesDocs);
    } else {
      console.log("not found");
      res.status(200);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});
const deletePendingMessage = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  let pendingMessagesExist = await PendingMessage.findOne({
    $and: [{ chat: { $eq: chatId } }, { reciver: { $eq: req.user._id } }],
  });

  try {
    if (pendingMessagesExist) {
      let pendingMessages = await PendingMessage.findByIdAndDelete(
        pendingMessagesExist._id
      )
        .populate("chat")
        .populate("sender");
      pendingMessages = await User.populate(pendingMessages, {
        path: "chat.users",
        select: "name picture email",
      });

      res.status(201).json(pendingMessages);
    } else {
      res.status(200);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = {
  sendMessage,
  allMessages,
  addPendingMessage,
  fetchPendingMessage,
  deletePendingMessage,
  addPendingMessageForGroupChat,
};
