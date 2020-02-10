const myKey = 'b8f12f8e2b84f0b55c15171f84dce900';

export function getNcovData() {
  const data = fetch(`http://api.tianapi.com/txapi/ncov/index?key=${myKey}`)
    .then(res => res.json())
    .then(res => {
      return res.newslist[0];
    });
  return data;
}
const appid = '47979915';
const appsecret = '2M30Vpxx';
export function getNcovOtherData() {
  const data = fetch(`https://tianqiapi.com/api?version=epidemic&appid=${appid}&appsecret=${appsecret}&vue=1`)
    .then(res => res.json())
    .then(res => {
      console.log(res.data.history);

      return res.data;
    });
  return data;
}
