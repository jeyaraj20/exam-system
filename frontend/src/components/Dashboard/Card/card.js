import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

export const MainCard = (props) => {
  return (
    <Card
      style={{
        background: "white",
        display: "inline-block",
        margin: 30,
        borderRadius: 10,
        padding: "10px 20px",
      }}
      bodyStyle={{ padding: "10px" }}
    >
      <div
        style={{
          marginBottom: 20,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "darkblue",
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          {props.value}
        </span>

        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginTop: 10,
            marginLeft: 5,
          }}
        >
          /{props.total}
        </span>

        <img
          src={props.image}
          alt=""
          style={{
            marginLeft: 30,
            width: 120,
            height: 100,
          }}
        />
      </div>
    </Card>
  );
};
