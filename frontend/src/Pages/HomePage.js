import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Signup from "../Components/Authentication/Signup";
import Login from "../Components/Authentication/Login";
import { useNavigate, Link } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chatPage");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="grid"
        justifyContent="center"
        p={1}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        pb={3}>
        <Text textAlign="center" fontSize="4xl" fontFamily="Work sans">
          ZODEX
        </Text>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            fontSize: "15px",
            fontFamily: "Times New Roman",
          }}>
          Owned & governed by{" "}
          <Link
            to="https://www.linkedin.com/in/v-avinash-22b4741b0/"
            style={{
              paddingLeft: "5px",
              color: "brown",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              textDecorationLine: "underline",
            }}>
            V Avinash
          </Link>
        </div>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width={"50%"}>LogIn</Tab>
            <Tab width={"50%"}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
