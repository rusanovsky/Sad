const app = require("express")();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const io = require("socket.io")(http);
const express = require("express");
const cors = require("cors");

const documents = {};
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  let previousId;
  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`)
    );
    previousId = currentId;
  };

  socket.on("getDoc", (docId) => {
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("addDoc", (doc) => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", (doc) => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
  });

  io.emit("documents", Object.keys(documents));

  console.log(`Socket ${socket.id} has connected`);
});

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://gomunkul:gomunkul@documents-tqsnb.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    throw err;
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected");
});

const docsRouter = require("../routes/docs");
app.use("/docs", docsRouter);

http.listen(4444, () => {
  console.log("Listening on port 4444");
});
