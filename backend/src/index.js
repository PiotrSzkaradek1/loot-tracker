const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const charactersRouter = require("./routes/characters");
const usersRouter = require("./routes/users");
const lootRouter = require("./routes/loot");
const historyRouter = require("./routes/history");
const bossesRouter = require('./routes/bosses');
const stashRouter = require('./routes/stash');
const pricelistRouter = require('./routes/pricelist');

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(express.json());
app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use("/api/characters", charactersRouter);
app.use("/api/users", usersRouter);
app.use("/api/loot", lootRouter);
app.use("/api/history", historyRouter);
app.use("/api/bosses", bossesRouter)
app.use("/api/stash", stashRouter);
app.use("/api/pricelist", pricelistRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
