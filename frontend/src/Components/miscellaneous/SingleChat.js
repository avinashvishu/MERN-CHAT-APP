import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box, Text } from "@chakra-ui/layout";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderAll } from "../../config/ChatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChat from "./UpdateGroupChat";
import axios from "axios";
import io from "socket.io-client";
import "./Style.css";
import Lottie from "react-lottie";
import ScrollableChat from "./ScrollableChat";
import animationData from "../../Animations/Typing";
const ENDPOINT = "http://localhost:8000";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const [storePendingMessage, setSstorePendingMessage] = useState("");
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const deleteIfIsPendingMessages = (selectedChat, notification) => {
    if (!notification || !selectedChat) {
      return;
    }
    setNotification(
      notification.filter((notify) => notify.chat._id !== selectedChat._id)
    );
  };

  const deletePendingMessages = async (selectedChat) => {
    if (selectedChat) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          // for some unknown reasons delete requiest is not working in axios at the moment therefore, i'm using put requiest.
          "api/message/pendingMessages/delete",
          { chatId: selectedChat._id },
          config
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    deleteIfIsPendingMessages(selectedChat, notification);
    deletePendingMessages(selectedChat);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io.connect(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", (data) => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const setNotificationForUser = async (newMessageRecieved) => {
    if (!newMessageRecieved) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      if (newMessageRecieved?.chat.isGroupChat === true) {
        let { data } = await axios.post(
          "api/message/pendingMessages/groupChat",
          {
            senderId: newMessageRecieved?.sender._id,
            chatId: newMessageRecieved?.chat._id,
          },
          config
        );
      } else {
        let { data } = await axios.post(
          "api/message/pendingMessages",
          {
            senderId: newMessageRecieved?.sender._id,
            chatId: newMessageRecieved?.chat._id,
          },
          config
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id // selectedChatCompare
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);

          setSstorePendingMessage(newMessageRecieved);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  useEffect(() => {
    setNotificationForUser(storePendingMessage);
  }, [storePendingMessage]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" || newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        /*  setNewMessage(""); */
        const { data } = await axios.post(
          "api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setNewMessage("");
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            as="div"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {" "}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                  {getSender(user, selectedChat.users)}
                </div>

                <ProfileModel
                  user={getSenderAll(user, selectedChat.users)}
                ></ProfileModel>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              /*  onKeyDown={sendMessage} */
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <>
                <Input
                  position="relative"
                  variant="filled"
                  bg="white"
                  placeholder="Enter a message.."
                  value={newMessage || ""}
                  onChange={typingHandler}
                ></Input>
                <div onClick={sendMessage}>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      position: "absolute",
                      right: "12px",
                      bottom: "8px",
                    }}
                  >
                    <LuSend />
                  </div>
                </div>
              </>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
