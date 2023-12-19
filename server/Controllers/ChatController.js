const asyncHandler = require('express-async-handler');
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const accessChat = asyncHandler(async (req, res) => {

  // 1. check if userId is present or not in request
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ success: false, message: "Please send UserId param request." });
  }

  // 2. check chat exists with this user if exist then get the complete information of users and messages

  var isChatExistsWithUser = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ]
  }).populate("users", "-password").populate("latestMessage");

  isChatExistsWithUser = await User.populate(isChatExistsWithUser, {
    path: 'latestMessage.sender',
    select: "name email pic"
  });

  if (isChatExistsWithUser.length > 0) {
    res.send(isChatExistsWithUser[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId]
    }

    try {
      const createChat = await Chat.create(chatData);
      const Fullchat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
      res.status(200).send(Fullchat);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }

});



const fetchChats = asyncHandler(async (req, resp) => {
  try {

    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email pic"
    });
    resp.status(200);
    resp.send(chats);
  } catch (err) {
    resp.status(500);
    throw new Error(err.message);
  }
});



const createGroupChat = asyncHandler(async (req, resp) => {
  // check if request has user and and also has name
  if (!req.body.users || !req.body.name) {
    resp.status(401).json({ success: false, message: "Please send users and name of the group" });
    return;
  }

  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    resp.status(401).json({ success: false, message: "At least 2 users are required toi crate a group chat" });
    return;
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    });

    console.log("Group Chat is :", groupChat);

    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    resp.status(200).json(fullGroupChat);

  } catch (err) {
    resp.status(401).json({ success: false, message: err.message });
  }
})


const renameGroup = asyncHandler(async (req, resp) => {
  const { chatId, chatName } = req.body;
  const updatedName = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedName) {
    resp.status(400);
    throw new Error("Error while updating group name");
  } else {
    resp.status(200);
    resp.json(updatedName);
  }

});


const addToGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;

  try {
    const addedUser = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addedUser) {
      resp.status(400);
      throw new Error("No chat found");
    } else {
      resp.status(200);
      resp.json(addedUser);
    }
  } catch (err) {
    resp.status(401).json({ success: false, message: err.message });
  }

}


);

const removeFromGroup = asyncHandler(async (req, resp) => {
  const { chatId, userId } = req.body;

  try {
    const addedUser = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!addedUser) {
      resp.status(400);
      throw new Error("No chat found");
    } else {
      resp.status(200);
      resp.json(addedUser);
    }
  } catch (err) {
    resp.status(401).json({ success: false, message: err.message });
  }

}


)


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup };