import { HStack, Image, Show, Text } from "@chakra-ui/react";
import logo from "../../assets/images.jpg";
import ColorModeSwitch from "../ColorSwitch/ColorModeSwitch";

const NavBar = () => {
  return (
    <HStack justifyContent='space-between' padding="10px">
      <Show above="sm">
        {/* <Text>This Only For Testing Purpose</Text> */}
        <Image src={logo} width="220px" height="120px" />
      </Show>

      {/* <Text>Jafar-Loka-01 NavBar</Text> */}

      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
