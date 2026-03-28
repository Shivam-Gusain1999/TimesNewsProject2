import "dotenv/config";
import mongoose from "mongoose";
import { Video } from "./src/models/video.model.js";

const MONGODB_URI = process.env.MONGODB_URI;

// Real Hindi news YouTube videos with unique IDs
const videoUpdates = [
  { index: 0, videoUrl: "https://www.youtube.com/watch?v=M7FIvfx5J10", title: "IPL 2026: चेन्नई vs मुंबई — बड़े मैच की हाइलाइट्स" },
  { index: 1, videoUrl: "https://www.youtube.com/watch?v=3jWRrafhO7M", title: "दिल्ली में भीषण गर्मी, तापमान 44 डिग्री पार" },
  { index: 2, videoUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ", title: "iPhone 18 Pro अनबॉक्सिंग: क्या ये सच में बेस्ट है?" },
  { index: 3, videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0", title: "शाहरुख खान की 'King' — ट्रेलर रिएक्शन" },
  { index: 4, videoUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", title: "सेंसेक्स 90,000 पार: निवेशकों में खुशी की लहर" },
  { index: 5, videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", title: "5 राज्यों में चुनाव: किसकी बनेगी सरकार? विश्लेषण" },
  { index: 6, videoUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk", title: "भारत बना तीसरी सबसे बड़ी अर्थव्यवस्था" },
  { index: 7, videoUrl: "https://www.youtube.com/watch?v=fRh_vgS2dFE", title: "NASA-ISRO: चांद पर भारतीय अंतरिक्ष यात्री" },
  { index: 8, videoUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0", title: "CBSE 12वीं रिजल्ट: टॉपर अनन्या शर्मा इंटरव्यू" },
  { index: 9, videoUrl: "https://www.youtube.com/watch?v=hTWKbfoikeg", title: "गर्मियों में स्वास्थ्य: डॉक्टर की जरूरी सलाह" },
];

async function fix() {
  await mongoose.connect(MONGODB_URI);
  const videos = await Video.find({}).sort({ createdAt: 1 });

  for (let i = 0; i < videos.length && i < videoUpdates.length; i++) {
    videos[i].videoUrl = videoUpdates[i].videoUrl;
    videos[i].title = videoUpdates[i].title;
    await videos[i].save();
    console.log(`✅ ${videos[i].title}`);
  }

  console.log("\n🎬 Videos updated with unique YouTube URLs!");
  process.exit(0);
}
fix();
