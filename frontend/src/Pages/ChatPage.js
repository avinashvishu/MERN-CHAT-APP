import { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SlideDrawer from "../Components/miscellaneous/SlideDrawer";
import Mychats from "../Components/miscellaneous/Mychats";
import ChatBox from "../Components/miscellaneous/ChatBox";

import axios from "axios";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setNotification } = ChatState();
  const fetchAllPendingMesages = async () => {
    if (!user) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "api/message/pendingMessages/user",
        config
      );

      setNotification(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllPendingMesages();
  }, [user]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SlideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <Mychats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
