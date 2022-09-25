import React, { Component } from "react";
import "./FaucetInfo.css";
import axios from "axios";
import NumberFormat from "react-number-format";
import config from "react-global-configuration";

const FaucetInfo = () => {
  const [faucetinfo, setFaucetinfo] = React.useState();

  React.useEffect(() => {
    axios
      .get(config.get("apiurl") + "/faucetinfo")
      .then((response) => {
        response.data.etherscanlink =
          response.data.etherscanroot + "/address/" + response.data.account;
        setFaucetinfo(response.data);
      })
      // Catch any error here
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!faucetinfo)
    return (
      <div className="content has-text-centered has-text-weight-light">
        <p>无法连接到后端服务!</p>
      </div>
    );

  console.log(`faucetinfo.availablequeuesize:${faucetinfo.availablequeuesize}`)
  console.log(`faucetinfo.queuesize:${faucetinfo.queuesize}`)
  return (
    <section className="section">
      <div className="content has-text-centered has-text-weight-light">
        <p>
          此水龙头服务每隔 {faucetinfo.payoutfrequencyinsec} 秒可发放{" "}
          {faucetinfo.payoutamountinether}(Ether)
          测试币。用户可以将自己的钱包地址添加到请求处理队列中，最大长度为 {faucetinfo.queuesize}
          。测试币发放地址{" "}
          <a
            target="_new"
            href={faucetinfo.etherscanlink}
            style={{"pointer-events":"none"}}
          >
            {faucetinfo.account}
          </a>
          {"  "}(余额{" "}
          <NumberFormat
            value={Math.floor(faucetinfo.balance)}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" ETH"}
          />
          。
        </p>
      </div>
    </section>
  );
};

export default FaucetInfo;
