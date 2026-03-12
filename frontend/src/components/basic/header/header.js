import React from "react";
import { Layout, Typography } from "antd";
import "./header.css";

const { Header } = Layout;
const { Title } = Typography;

export const HomepageHeader = (props) => {
  return (
    <Header
      style={{
        background: "#00000077",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <img
        src={props.img}
        alt="Logo"
        style={{
          height: 50,
          marginRight: 20,
        }}
      />

      <Title
        level={4}
        style={{
          margin: 0,
          color: "#07cfda",
        }}
      >
        {props.title}
      </Title>
    </Header>
  );
};
