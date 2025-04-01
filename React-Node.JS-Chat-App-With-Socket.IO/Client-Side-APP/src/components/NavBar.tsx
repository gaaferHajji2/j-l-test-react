
import { useContext } from "react";
import { Navbar, Nav, Stack, Container } from "react-bootstrap";

import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserNotifications from "./chat/UserNotifications";

const NavBar = () => {

    const { user, logoutUser } = useContext(AuthContext);

    const { logoutUserFromChat } = useContext(ChatContext);

    // console.log("The User in NavBar is: ", user);

    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to={"/"} className="link-light text-decoration-none"> Jafar Loka Chat App </Link>
                </h2>

                {user && <span className="text-warning">You Are Logged In As: {user.email}</span>}

                {
                    !user && <Nav>
                        <Container>
                            <Stack direction="horizontal" gap={3}>
                                <Link to={"/Login"} className="link-light text-decoration-none">J-L-Login</Link>

                                <Link to={"/Register"} className="link-light text-decoration-none">J-L-Register</Link>
                            </Stack>
                        </Container>
                    </Nav>
                }

                {
                    user && <Nav>
                        <Container>
                            <Stack direction="horizontal" gap={3}>
                                <UserNotifications />
                                <Link onClick={() => { logoutUserFromChat(); logoutUser() }} to={"/Login"} className="link-light text-decoration-none">J-L-Logout</Link>
                            </Stack>
                        </Container>
                    </Nav>
                }

            </Container>

        </Navbar >
    );
}

export default NavBar;