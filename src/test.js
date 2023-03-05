describe("OAuth1.0", function () {
  var OAuth = require("oauth");

  it("tests Flickr API's", function (done) {
    var oauth = new OAuth.OAuth(
      "https://www.flickr.com/services/oauth/request_token",
      "https://www.flickr.com/services/oauth/access_token",
      "2edd61331c5eaee299aa9a843435d748",
      "0cec42600f8f81f5",
      "1.0A",
      null,
      "HMAC-SHA1"
    );

    oauth.get(
      "https://www.flickr.com/services/rest/?method=flickr.cameras.getBrands&format=json",
      undefined,
      undefined,
      function (e, data, res) {
        if (e) console.error(e);
        console.log(require("util").inspect(data));
        done();
      }
    );
  });
});
