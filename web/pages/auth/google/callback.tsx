import { useEffect } from "react";

/*function searchToObject(search: String) {
  var pairs = search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}*/

export default () => {
  useEffect(() => {
    // get the URL parameters which will include the auth token
    //const params = searchToObject();

    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage({ source: "login-redirect", payload: window.location.search }, window.location.origin);
      // close the popup
      window.close();
    }
  });
  // some text to show the user
  return <p>Please wait...</p>;
};
