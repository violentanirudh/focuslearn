const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

const details = {
  notes: {
    content:
      "Each lecture should have a notes (same index as of lecture). Each string of notes will be markdown and will contain 200 words or less.",
    schema: `{
            "type": "object",
            "properties": {
                "notes": {
                "type": "array",
                "items": {
                    "type": "string"
                }
                }
            }
        }`,
  },
  questions: {
    content:
      "Multiple Choice Question. Each title should have one Questions. Each question will have 3 options and one correct answer.",
    schema: `{
        "type": "object",
        "properties": {
            "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                "question": {
                    "type": "string"
                },
                "answer": {
                    "type": "string",
                    "enum": [
                    "option1",
                    "option2",
                    "option3"
                    ]
                },
                "option1": {
                    "type": "string"
                },
                "option2": {
                    "type": "string"
                },
                "option3": {
                    "type": "string"
                }
                },
                "required": [
                "question",
                "answer",
                "option1",
                "option2",
                "option3"
                ]
            }
            }
        },
        "required": [
            "questions"
        ]
        }`,
  },
};

const generatePrompt = (data, type) => {
  return `
    Generate a JSON-formatted response based on the given Lecture titles.
    The Response should contain an array of Objects. Input data provides you the list of titles.

    Input data:
    ${data}   

    ${type.content}

    Example OUTPUT JSON Schema (list):
    ${type.schema}
    `;
};

const playlist = async (id) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems`,
      {
        params: {
          part: "snippet",
          playlistId: id,
          maxResults: 150,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = [];
    const titles = [];

    response.data.items.forEach(async (item) => {
      titles.push(item.snippet.title);

      videos.push({
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        videoId: item.snippet.resourceId.videoId,
        embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
      });
    });

    console.log(videos)

    console.log(titles.length);

    // console.log(titles)
    // for (let key in details) {
    //     console.log(details[key])
    //     console.log('Generated ' + key.toString())
    //     console.log(`./serverless/${key.toString()}/${id}.json`)
    // }

    // for (let key in details) {
    //   let result = await model.generateContent(
    //     generatePrompt(titles, details[key]),
    //     {
    //       // Set temperature and top_p here
    //       temperature: 0.7, // Adjust as needed
    //       top_p: 0.9, // Adjust as needed
    //       max_tokens: 500000 // Adjust as needed
    //     }
    //   );
    //   console.log("Generated " + key.toString());
    //   fs.writeFileSync(
    //     `./serverless/${key.toString()}/${id}.json`,
    //     result.response.text()
    //   );
    // }

    // await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (error) {
    console.log(error);
  }
};

playlist("PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s");
playlist("PLinedj3B30sDby4Al-i13hQJGQoRQDfPo");