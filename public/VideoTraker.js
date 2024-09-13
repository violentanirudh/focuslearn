let player;
let courseId = "YOUR_COURSE_ID"; // Replace with actual course ID
let currentLectureIndex = 0; // Current lecture index, update this when changing lectures
let lectureDurations = []; // This should be populated with the durations of all lectures
let watchTime = 0;

function onYouTubeIframeAPIReady() {
  // Initialize player with the first video in the playlist
  initializePlayer();
}

function initializePlayer() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: getVideoIdForLecture(currentLectureIndex), // You need to implement this function
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  // You might want to start the video automatically or let the user start it
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    startTracking();
  } else if (
    event.data == YT.PlayerState.PAUSED ||
    event.data == YT.PlayerState.ENDED
  ) {
    stopTracking();
    updateProgress();
  }
}

let trackingInterval;

function startTracking() {
  trackingInterval = setInterval(() => {
    watchTime++;
    checkViewStatus();
  }, 1000);
}

function stopTracking() {
  clearInterval(trackingInterval);
}

function checkViewStatus() {
  const currentDuration = lectureDurations[currentLectureIndex];
  if (watchTime >= currentDuration * 0.9) {
    updateProgress();
  }
}

function updateProgress() {
  fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseId: courseId,
      lectureIndex: currentLectureIndex,
      watchTime: watchTime,
    }),
  });
}

function loadNextLecture() {
  currentLectureIndex++;
  if (currentLectureIndex < lectureDurations.length) {
    watchTime = 0;
    player.loadVideoById(getVideoIdForLecture(currentLectureIndex));
  } else {
    console.log("Course completed!");
  }
}

// You need to implement this function to return the correct YouTube video ID for each lecture
function getVideoIdForLecture(index) {
  // This should return the YouTube video ID for the lecture at the given index
  // You might want to store this information along with the course data
  return "VIDEO_ID_FOR_LECTURE_" + index;
}

// Initialize the course data
fetch("/api/courses/" + courseId)
  .then((response) => response.json())
  .then((course) => {
    lectureDurations = course.lectureDurations;
    initializePlayer();
  });
