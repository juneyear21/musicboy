document.addEventListener("DOMContentLoaded", function () {
    const URLinput = document.querySelector(".URL-input");
    const tracks = document.querySelector(".tracks");
    const footer = document.querySelector("footer");
    URLinput.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        sendURL(URLinput.value);
      }
    });
  
    function sendURL(URL) {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      };
  
      fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${URL}&key=AIzaSyCe0X5p2nsed7ffLTfjvmvfiEb0sr9QoRY`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          links(data.items);
        })
        .catch((error) => console.error("Error:", error));
    }
  
    function links(linkId) {
      tracks.innerHTML = "";
  
      linkId.forEach((links) => {
        if (links.id.videoId) {
          const yt_link = `https://www.youtube.com/watch?v=${links.id.videoId}`;
          const title = links.snippet.title;
          const img = links.snippet.thumbnails.high.url;
          const link = `
            <div class="track-item">
              <div class="track-details">
                <a href="${yt_link}" target="_blank">
                  <div class="musicInfo">
                  <img src="${img}" alt="image">
                    <h3>${title}</h3>
                  </div>
                </a>
                <button class="btn_stream" data-ytlink="${yt_link}" data-title="${title}" data-img="${img}">Play</button>
              </div>
            </div>
          `;
          tracks.innerHTML += link;
        }
      });
  
      // Add event listeners after adding elements to the DOM
      const streamButtons = document.querySelectorAll(".btn_stream");
  
      streamButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const yt_link = btn.getAttribute("data-ytlink");
          const title = btn.getAttribute("data-title");
          const img = btn.getAttribute("data-img");
          footer.innerHTML = `
            <div class="track-details">
              <img src="${img}" alt="image">
              <div>
                <h3>${title}</h3>
              </div>
            </div>
            <audio controls autoplay name="media" src="http://localhost:4000/stream?URL=${yt_link}&title=${encodeURIComponent(title)}"></audio>
          `;
        });
      });
    }
  });
  