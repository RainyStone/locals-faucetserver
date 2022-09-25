import React from 'react';
import axios from "axios";
import config from "react-global-configuration";

const Comp = ({ lastDonation }) => {

    const [q, setQ] = React.useState();

    const loadQueue = () => {
        axios
            .get(config.get("apiurl") + "/q")
            .then(response => {
                // debugger;
                setQ(response.data);
            })
            // Catch any error here
            .catch(error => {
                console.log(error);
                setQ(null);
            });
    }

    React.useEffect(() => {
        loadQueue();
    }, [lastDonation]);

    React.useEffect(() => {
        const interval = setInterval(loadQueue, 10 * 1000);
        return (() => {
            clearInterval(interval);
        })
    }, []);

    if (!q) {
        return null;
    }

    const lastItems = q.last.map((item, i) => {
        if (item.txhash) {
            return (
                <div key={i}>
                    <a target="_new" href={`${config.get("etherscanroot")}/tx/${item.txhash}`}  style={{"pointer-events":"none"}}>{item.address}</a>
                </div>);
        }
    })


    const queueItems = q.current.map((item, i) => {
        return (<div key={i}>{item.address} (请求等待处理中....)</div>);
    })

    return (
        <section className="section">
            <div className="content has-text-centered has-text-weight-light">
                {lastItems && lastItems.length > 0 && (
                    <>
                        <h2>最近领取</h2>
                        {lastItems}
                    </>
                )}
                {queueItems && queueItems.length > 0 && (
                    <>
                        <h2>等待队列</h2>
                        {queueItems}
                    </>
                )}

            </div>
        </section>
    )
};


export default Comp;