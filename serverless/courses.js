const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      "type": "object",
      "properties": {
        "course": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "overview": {
              "type": "string"
            },
            "lectures": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  }
                },
                "required": [
                  "title",
                  "description"
                ]
              }
            },
            "level": {
              "type": "string",
              "enum": [
                "beginner",
                "intermediate",
                "advance"
              ]
            },
            "category": {
              "type": "string",
              "enum": [
                "programming",
                "mathematics",
                "productivity"
              ]
            }
          },
          "required": [
            "name",
            "overview",
            "lectures"
          ]
        }
      },
      "required": [
        "course"
      ]
    }
  },
});


const generatePrompt = (data) => {
  return `
    Generate a JSON-formatted response based on the given Lecture titles.

    Input data:
    ${data}

    Name : Generate a 40 character or less Course Name (Example: 'Introduction To Python' or 'Mastering Docker').
    Overview : Generate a 200 character or less Course Overview.
    Lectures : Generate a list of lectures with a title (Keep the title same from the list provided) and description (100 words maximum) for each lecture based on the given Input Data.
    Level : Choose from 'beginner', 'intermediate', 'advance' based on titles provided.
    Category : Decide a category like 'programming', 'mathematics', 'productivity' or any other one word category based on titles provided.
    `;
};

const convertDurationToMinutes = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

const fetchPlaylistItems = async (playlistId, nextPageToken = null) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    {
      params: {
        part: "snippet",
        playlistId,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 50,
        pageToken: nextPageToken,
      },
    }
  );
  return response.data;
};

const fetchVideoDetails = async (videoIds) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        part: "contentDetails",
        id: videoIds,
        key: process.env.YOUTUBE_API_KEY,
      },
    }
  );
  return response.data;
};

const generateContent = async (prompt) => {
  const result = await model.generateContent(prompt, {
    temperature: 1.0,
    top_p: 0.9,
    max_tokens: 200000,
  });
  return result.response.text();
};

const processPlaylist = async (id) => {
  try {
    let nextPageToken = null;
    const titles = [];
    const videoLength = [];
    const embed = [];
    let author = "";
    let channel = "";
    let duration = 0;

    do {
      const playlistItems = await fetchPlaylistItems(id, nextPageToken);

      playlistItems.items.forEach((item) => {
        titles.push(item.snippet.title);
        embed.push(`https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`);
      });

      const videoIds = playlistItems.items.map((item) => item.snippet.resourceId.videoId).join(",");
      const videoDetails = await fetchVideoDetails(videoIds);

      videoDetails.items.forEach((item) => {
        videoLength.push(convertDurationToMinutes(item.contentDetails.duration));
      });

      if (!author && !channel) {
        author = playlistItems.items[0].snippet.videoOwnerChannelTitle;
        channel = `https://www.youtube.com/channel/${playlistItems.items[0].snippet.videoOwnerChannelId}`;
      }

      nextPageToken = playlistItems.nextPageToken;
    } while (nextPageToken);

    duration = videoLength.reduce((a, b) => a + b, 0);
    const generatedContent = {};

    let requests = 0

    while (requests < 3) {
      try {
        generatedContent.data = JSON.parse(await generateContent(generatePrompt(titles)));
        break
      } catch (error) {
        requests++
        console.error(error.message)
        continue
      }
    }

    if (requests === 3) {
      return false
    }

    const content = {
      course: generatedContent.data.course,
      author,
      channel,
      duration,
    };

    if (content.course && content.course.lectures) {
      content.course.lectures.forEach((lecture, index) => {
        lecture.embed = embed[index];
        lecture.duration = videoLength[index];
      });
    }

    const file = path.join(__dirname, '../public/courses/content', `${id}.json`);
    fs.writeFileSync(file, JSON.stringify(content), { flag: 'w' });

    return { 
      channel, duration,
      instructor: content.author,
      lectures: videoLength.length, 
      title: content.course.name, 
      overview: content.course.overview,
      category: content.course.category,
      level: content.course.level
    };

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  processPlaylist
}