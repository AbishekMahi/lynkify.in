function search() {
    const songName = document.getElementById("song-name").value;

    // Hide the error message if the input is empty
    if (songName === "") {
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.innerHTML = "";
        return;
    }

    const url = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(songName)}`;

    // Show the loading message
    const loading = document.getElementById("loader");
    loading.classList.remove("d-none");
    errorMsg.innerHTML = "";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const platforms = data.linksByPlatform;
            const songInfo = data.entitiesByUniqueId[data.entityUniqueId];
            const results = document.getElementById("links");
            const songTitle = document.getElementById("song-title");
            const songArtist = document.getElementById("song-artist");
            const songImage = document.getElementById("song-image");
            const bgSongImage = document.getElementById("bg-image");
            const songInfoContainer = document.getElementById("song-info");
            const videoId = document.getElementById("video-id");

            // Replace platform names
            const platformReplacements = {
                "amazonMusic": "Amazon Music",
                "youtubeMusic": "YouTube Music",
                "spotify": "Spotify",
                "itunes": "Itunes",
                "appleMusic": "Apple Music",
                "youtube": "YouTube",
                "google": "Google",
                "googleStore": "Googlestore",
                "pandora": "Pandora",
                "deezer": "Deezer",
                "tidal": "Tidal",
                "amazonStore": "Amazon Store",
                "soundcloud": "Soundcloud",
                "napster": "Napster",
                "yandex": "Yandex",
                "spinrilla": "Spinrilla",
                "audius": "Audius",
                "anghami": "Anghami",
                "boomplay": "Boomplay",
                "audiomack": "Audiomack"
            };
            for (let platform in platforms) {
                if (platform in platformReplacements) {
                    platforms[platformReplacements[platform]] = platforms[platform];
                    delete platforms[platform];
                }
            }

            songTitle.textContent = songInfo.title;
            songArtist.textContent = songInfo.artistName;
            songImage.src = songInfo.thumbnailUrl;
            songImage.alt = songInfo.title;
            songImage.title = songInfo.title;
            songInfoContainer.classList.remove("d-none");
            bgSongImage.style.backgroundImage = `url(${songInfo.thumbnailUrl})`;

            // Extract the video ID from the YouTube link and display it
            if (platforms.YouTube) {
                const url = platforms.YouTube.url;
                const videoIdMatch = url.match(/v=([^&]+)/);
                if (videoIdMatch) {
                    const id = videoIdMatch[1];
                    // videoId.textContent = `YouTube Video ID: ${id}`;
                    videoId.src = `https://www.youtube.com/embed/${id}`;
                }
            }
            results.innerHTML = "";
            const platformOrder = ["Spotify", "Apple Music", "YouTube Music", "YouTube", "Amazon Music", "Soundcloud", "Amazon Store", "Boomplay", "Audiomack"];
            for (let platform of platformOrder) {
                if (platforms.hasOwnProperty(platform)) {
                    const url = platforms[platform].url;
                    const a = document.createElement("a");
                    a.href = url;
                    a.target = "_blank";
                    a.title = "Listen on " + platform;

                    // Create the icon element
                    const icon = document.createElement("i");
                    icon.classList.add("far", "fa-angle-right");

                    // Create the platform name element
                    const platformName = document.createElement("span");
                    platformName.textContent = platform;

                    // Create the platform icon element
                    const platformIcon = document.createElement("img");
                    platformIcon.classList.add("mr-20", "icons");
                    platformIcon.src = "icons/" + platform.replace(/\s+/g, '_') + ".png";
                    platformIcon.alt = "";

                    // Append the icon, platform name, and platform icon to the link element
                    const linkContent = document.createElement("div");
                    linkContent.classList.add("d-flex", "align-items-center");
                    linkContent.appendChild(platformIcon);
                    linkContent.appendChild(platformName);
                    a.appendChild(linkContent);
                    a.appendChild(icon);

                    // Append the link element to the results container
                    results.appendChild(a);
                }
            }

            // for (let platform in platforms) {
            //     const url = platforms[platform].url;
            //     const a = document.createElement("a");
            //     a.href = url;
            //     a.target = "_blank";
            //     a.title = "Listen on " + platform;

            //     // Create the icon element
            //     const icon = document.createElement("img");
            //     icon.classList.add("mr-20", "icons");
            //     icon.src = `icons/${platform.replace(/\s/g, '_')}.png`;
            //     icon.alt = platform + " icon";

            //     // Create the text element
            //     const text = document.createElement("span");
            //     text.textContent = platform;

            //     // Create the icon element for the right arrow
            //     const arrowIcon = document.createElement("i");
            //     arrowIcon.classList.add("far", "fa-angle-right");

            //     // Create a container for the icon and text
            //     const container = document.createElement("div");
            //     container.classList.add("d-flex", "align-items-center");

            //     // Append the icon and text to the container
            //     container.appendChild(icon);
            //     container.appendChild(text);

            //     // Append the container and arrow icon to the link element
            //     a.appendChild(container);
            //     a.appendChild(arrowIcon);

            //     // Append the link element to the results container
            //     results.appendChild(a);
            // }

            document.getElementById("form").classList.add("d-none"); // hide the text input and button
        })
        .catch(error => {
            console.error(error);
            errorMsg.innerHTML = "Please check your Spotify or iTunes link and try again";
            document.getElementById("form").classList.remove("d-none"); // show the text input and button
        })
        .finally(() => {
            loading.classList.add("d-none"); // Hide the loading message
        });
}
