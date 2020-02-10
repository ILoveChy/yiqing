const myKey = 'b8f12f8e2b84f0b55c15171f84dce900';

export function getNcovData() {
  const data = fetch(`http://api.tianapi.com/txapi/ncov/index?key=${myKey}`)
    .then(res => res.json())
    .then(res => {
      return res.newslist[0];
    });
  return data;
}
