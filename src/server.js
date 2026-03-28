import "dotenv/config";

import connectDB from "./config/db.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
    
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`💥 Port ${PORT} is already in use! Please kill the terminal or process holding it.`);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
