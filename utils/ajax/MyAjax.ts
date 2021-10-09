interface OptionsState {
  method: string;
  url: string;
  data?: any;
  timeout: number;
}

function fromDataToParams(data): string {
  return Object.keys(data)
    .map((key) => {
      return `${key}=${encodeURIComponent(data[key])}`;
    })
    .join("&");
}

function MyAjax({ method, url, data = {}, timeout = 9999 }: OptionsState) {
  let xhr = null;

  if ((window as any).XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP"); // IE
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    } else {
      console.log(xhr.status, xhr.statusText);
    }
  };

  if (method.toUpperCase() === "GET") {
    xhr.open(method, url + "?" + fromDataToParams(data));
    xhr.send();
  } else {
    xhr.open(method, url);
    xhr.send(JSON.stringify(data));
  }
  
  xhr.timeout = timeout;
}
