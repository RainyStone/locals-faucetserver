import React from "react";
import "./FaucetRequest.css";
import Eth from "ethjs";
import config from "react-global-configuration";
import axios from "axios";

const FaucetRequest = ({ onQueued }) => {


  const [address, setAddress] = React.useState("");
  const [cansubmit, setCansubmit] = React.useState(false);
  const [message, setMessage] = React.useState();

  React.useEffect(() => {
    setCansubmit(Eth.isAddress(address));
  }, [address]);

  let timeout;
  React.useEffect(() => {
    if (message) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, [message]);

  const submit = () => {
    setCansubmit(false);

    let apiUrl = `${config.get("apiurl")}/donate/${config.get("accesskey")}/${address}`;
    axios
      .get(apiUrl)
      .then(response => {
        if (response.status === 200) {
          setAddress("");
          onQueued && onQueued();
          setMessage(response.data.message);
        }
      })
      // Catch any error here
      .catch(error => {
        if (!error || !error.response) {
          setMessage(`API error`);
          return;
        }
        if (error.response.status === 403) {
          setMessage(error.response.data.message);
          return;
        }
      });
  }

  return (
    <div className="">
      <section className="section">
        <div className="container bottompadding">
          <div className="field">
            <label className="label">
              输入钱包地址领取测试币
            </label>
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                placeholder="Enter your testnet account address"
                value={address}
                onChange={(e) => { setAddress(e.target.value) }}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                onClick={submit}
                disabled={!cansubmit}
                className="button is-link"
              >
                发送测试币
              </button>
            </div>
          </div>
          {message && (
            <article
              className="message"
              onClick={() => { setMessage(null) }}
            >
              <div className="message-body">
                <b>{message}</b><br />
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  )


};

export default FaucetRequest;
