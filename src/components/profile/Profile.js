import React, { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

//icon
import { IoLocationOutline } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { FaArrowLeftLong } from "react-icons/fa6";

//header画像
import Header from "../../images/default_header.jpg";

//icon画像
import Icon from "../../images/default_icon.jpeg";

import { getUser } from "../../lib/api/users";
import { TweetList } from "../tweets/TweetList";
import { ProfileUpdateModal } from "./ProfileUpdateModal";
import { useFlashMessage } from "../../hooks/useFlashMessage";
import { useRecoilState } from "recoil";
import { loginUserTweetsState } from "../../Atoms/tweets/loginUserTweetsState";

export const Profile = () => {
  //ページネーションでツイートを表示するため、Offsetと合計値を作成
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [modalShow, setModalShow] = useState(false);

  //ログインユーザーのツイートの状態
  const [loginUserTweets, setLoginUserTweets] =
    useRecoilState(loginUserTweetsState);

  //idからユーザーデータを取得する（user情報、ユーザーに基づくツイート、プロフィール取得）
  let { userId } = useParams("");

  const [userInfo, setUserInfo] = useState({
    user: {},
    profile: {},
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUser(userId, currentOffset);
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          user: res.data.userInfo,
          profile: res.data.profile,
        }));
        setLoginUserTweets(res.data.tweets);
        setTotalCount(res.data.tweets.length);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserInfo();
  }, [userId, currentOffset, modalShow]);

  //フラッシュメッセージをリセットする
  const { resetFlashMessage } = useFlashMessage();

  const navigate = useNavigate();
  const movementHome = () => {
    navigate("/");
  };

  const renderProfileAttribute = (text, icon) => {
    if (!text) return null; // テキストがない場合は何も描画しない
    return (
      <div
        style={{ marginTop: "20px", marginBottom: "20px", fontSize: "1.7vw" }}>
        {icon && <i>{icon}</i>}
        <span style={{ marginLeft: "10px" }}>{text}</span>
      </div>
    );
  };

  return (
    <>
      <Row xs='auto'>
        <Col>
          <FaArrowLeftLong style={{ fontSize: "2vw" }} onClick={movementHome} />
        </Col>
        <Col>
          <h3>{userInfo.profile.nickname}</h3>
          <p className='text-muted'>
            {loginUserTweets.length}
            {loginUserTweets.length > 1 ? "posts" : "post"}
          </p>
        </Col>
      </Row>
      <div className='position-relative'>
        <Image
          src={userInfo.profile.headerImageUrl || Header}
          width='100%'
          height='300px'
          alt='header_image'
        />
        <Image
          src={userInfo.profile.iconImageUrl || Icon}
          width='15%'
          height='170px'
          className='rounded-circle border position-absolute bottom-0 start-0 '
          alt='icon_image'
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}>
        <Row>
          <Col>
            <Button
              variant='secondary'
              className='rounded-pill'
              style={{ fontSize: "1.3vw" }}
              onClick={() => setModalShow(true)}>
              Edit Profile
            </Button>
            <ProfileUpdateModal
              show={modalShow}
              onHide={() => {
                setModalShow(false);
                resetFlashMessage(); //モーダルが閉じた時にフラッシュメッセージを非表示にする
              }}
              profileInfo={userInfo.profile}
            />
          </Col>
        </Row>
      </div>
      <Row xs='auto' className='border-bottom'>
        <Col>
          <h3>{userInfo.profile.nickname}</h3>
          <h5>@{userInfo.user.name}</h5>

          {renderProfileAttribute(userInfo.profile.bio)}
          {renderProfileAttribute(userInfo.profile.website, <CgWebsite />)}
          {renderProfileAttribute(
            userInfo.profile.location,
            <IoLocationOutline />
          )}
          {renderProfileAttribute(userInfo.profile.dateOfBirth, <SlCalender />)}
        </Col>
      </Row>
      <TweetList
        tweets={loginUserTweets}
        totalCount={totalCount}
        currentOffset={currentOffset}
        setCurrentOffset={setCurrentOffset}
      />
    </>
  );
};
