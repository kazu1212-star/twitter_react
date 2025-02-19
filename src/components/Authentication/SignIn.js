import React from "react";
import { useState } from "react";
import { signIn } from "../../lib/api/auth";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

//フラッシュメッセージ表示
import { flashMessageState } from "../../Atoms/flashmessage/FlashMessageState";
import { useFlashMessage } from "../../hooks/useFlashMessage";
import { useRecoilValue } from "recoil";
import FlashMessage from "../FlashMessage/FlashMessage";

const SignIn = () => {
  const { createFlashMessage, resetFlashMessage } = useFlashMessage();
  const flashMessage = useRecoilValue(flashMessageState);

  const [session, setSession] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onChangeRegistration = e => {
    const { name, value } = e.target;
    setSession(prevRegistration => ({
      ...prevRegistration,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async e => {
    e.preventDefault();
    try {
      const res = await signIn(session);
      Cookies.set("_access_token", res.headers["access-token"]);
      Cookies.set("_client", res.headers["client"]);
      Cookies.set("_uid", res.headers["uid"]);
      navigate("/");
    } catch (e) {
      createFlashMessage([e.response.data.errors], "error", true);
    }
  };

  const formList = [
    {
      name: "email",
      type: "text",
      placeholder: "email",
      label: "メールアドレス",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "パスワード",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        weigh: "100vh",
        height: "100vh",
      }}>
      <Card style={{ width: "100vh" }}>
        {flashMessage.open && <FlashMessage flashMessage={flashMessage} />}
        <Card.Body>
          <h1>
            <FaSquareXTwitter />
          </h1>
          <Card.Title
            style={{
              textAlign: "center",
              fontSize: "30px",
              fontWeight: "bold",
            }}>
            ログイン
          </Card.Title>
          <Form>
            {formList.map(item => (
              <Form.Group key={item.name} style={{ marginBottom: "20px" }}>
                <Form.Label>{item.label}</Form.Label>
                <Form.Control
                  name={item.name}
                  type={item.type}
                  placeholder={item.placeholder}
                  onChange={onChangeRegistration}
                />
              </Form.Group>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}>
              <Button
                type='submit'
                variant='primary'
                onClick={handleSignUpSubmit}>
                ログインする
              </Button>
            </div>

            <Link
              to='/api/v1/users'
              className='btn btn-secondary'
              onClick={resetFlashMessage}>
              新規登録画面へ
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignIn;
