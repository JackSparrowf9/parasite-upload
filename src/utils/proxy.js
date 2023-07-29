import fs from "fs";
import axios from "axios";

const checkLiveProxy = async (proxy) => {
  const url = "http://httpbin.org/ip";

  const response = await axios
    .get(url, {
      proxy: proxy,
    })
    .then((res) => {
      const { data } = res;
      console.log(`Proxy Live Ip: ${data.origin}`);
      return true;
    })
    .catch((err) => {
      // console.log(err);
      return false;
    });

  return response;
};

const getProxy = () => {
  return new Promise(async (resolve, reject) => {
    let count = 0;
    let checkLive = true;
    const proxyData = fs.readFileSync("proxy.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      return data;
    });

    const obj = JSON.parse(proxyData);

    while (checkLive) {
      let randomProxy = obj[Math.floor(Math.random() * obj.length)];
      let proxy = {
        protocol: "http",
        host: randomProxy.ip,
        port: randomProxy.port,
        auth: {
          username: randomProxy.auth.split(":")[0],
          password: randomProxy.auth.split(":")[1],
        },
      };

      const isLive = await checkLiveProxy(proxy);

      if (isLive) {
        checkLive = false;
        resolve(proxy);
        break;
      }
      count += 1;
      if (count > 20) {
        checkLive = false;
        reject();
        break;
      }
    }
  });
};
export default getProxy;
