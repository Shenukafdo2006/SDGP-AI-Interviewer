const dotenv = require("dotenv");
const app = require("./app");

<<<<<<< Updated upstream
dotenv.config();

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
=======
const { admin, initCollections, getOrCreateUser } = require("./config/firebase");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");
const authRoutes = require("./routes/authRoutes");
const app  = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/interview", aiInterviewRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Achievements API is running 🚀" });
>>>>>>> Stashed changes
});
