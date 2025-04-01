
import { useContext } from "react";
import { Form, Row, Col, Stack, Alert, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

    const { errMsg, loginUser, loginInfo, updateLoginInfo, isLoading } = useContext(AuthContext);

    return (
        <>
            <Form onSubmit={
                (e) => {
                    e.preventDefault();
                    // console.log("The Login Info is: ", loginInfo);
                    loginUser();
                }
            }>
                <Row style={{ height: "80vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={9} sm={12} md={12} lg={12}>
                        <Stack gap={3}>
                            <h2 className="link-light text-center">Login To Jafar-Loka Application</h2>

                            <Form.Control
                                placeholder="Enter Your Email"
                                type="email"
                                required
                                onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })}
                            />


                            <Form.Control
                                placeholder="Enter Your Password"
                                type="password"
                                required
                                onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
                            />

                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? "Please wait..." : "Login To Account"}
                            </Button>

                            {
                                errMsg && <Alert variant="danger">
                                    <p>The Error is: {errMsg}</p>
                                </Alert>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;