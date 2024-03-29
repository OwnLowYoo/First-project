import React, { useContext, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, AGENCY_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";


const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const click = async () => {
        try {
            if (!isLogin && password !== confirmPassword) {
                alert("Пароли не совпадают!")
                return
            }

            const emailRegex = /^[\w-.]+@(mail|gmail|yandex)\.(ru|com)$/;
            if (!emailRegex.test(email)) {
                alert("Введите корректный email-адрес!")
                return
            }

            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(data)
            user.setIsAuth(true)
            if (email === "admin@mail.ru") {
                user.setIsAdmin(true)
            }
            navigate(AGENCY_ROUTE)
        } catch (e) {

                alert(e.response?.data?.message || "Данный email уже зарегистрирован")

        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Подтвердите ваш пароль..."
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            type="password"
                        />
                    )}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>

                </Form>
            </Card>
        </Container>
    );
});

export default Auth;