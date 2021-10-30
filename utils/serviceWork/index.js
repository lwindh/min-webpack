if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./index.js").then(function (reg) {
    console.log("Service Worker 注册成功 index.html");
    console.log(reg);
    // setInterval(() => {
    //     reg.update()
    //   }, 60 * 60 * 1000);
  });
}

self.addEventListener("install", () => {
  // 安装回调的逻辑处理
  console.log("service worker 安装成功");
});
self.addEventListener("activate", () => {
  // 激活回调的逻辑处理
  console.log("service worker 激活成功");
});
self.addEventListener("fetch", (event) => {
  console.log("service worker 抓取请求成功: " + event.request.url);
});
