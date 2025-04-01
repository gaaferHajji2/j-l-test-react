
import { useContext } from "react";

import { Form, Row, Col, Stack, Alert, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {

    // const { user, setUser } = useContext(AuthContext);

    // console.log(user);

    // console.log(setUser);

    let { registerInfo, updateRegisterInfo, errMsg, registerUser, isLoading } = useContext(AuthContext);

    // console.log("The Loading Status is: ", isLoading);

    return (
        <>
            <Form onSubmit={(e) => { 
                e.preventDefault(); 
                // console.log(registerInfo); 
                registerUser() 
            }}>
                <Row style={{ height: "80vh", justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={9} sm={12} md={12} lg={12}>
                        <Stack gap={3}>
                            <h2 className="link-light text-center">Register To Jafar-Loka Application</h2>

                            <Form.Control placeholder="Enter Your Name" type="text" required
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />

                            <Form.Control placeholder="Enter Your Email" type="email" required
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />

                            <Form.Control placeholder="Enter Your Password" type="password" required
                                onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />

                            <Button variant="primary" type="submit" disabled={isLoading}>
                                Create An Account
                            </Button>

                            {
                                errMsg && <Alert variant="danger">
                                    <p>We Have An Error Here: {errMsg}</p>
                                </Alert>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Register;