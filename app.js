const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://madirepriyanka01:LECkCPtLHN7uPE9A@frames.dappfvf.mongodb.net/TShirtsShop?retryWrites=true&w=majority&appName=Frames/tshirts",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  //   console.log("connected");
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});
const TShirtSchema = new mongoose.Schema({
  name: String,
  color: String,
  type: String,
  gender: String,
  price: Number,
  quantity: Number,
  image: String,
});

const TShirt = mongoose.model("TShirt", TShirtSchema);

app.get("/api/tshirts", async (req, res) => {
  const tshirts = await TShirt.find();
  res.json(tshirts);
});

app.post("/api/posttshirts", async (req, res) => {
  const tshirt = new TShirt(req.body);
  await tshirt.save();
  res.json(tshirt);
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTShirt = await TShirt.findByIdAndDelete(id);
    if (!deletedTShirt) {
      return res.status(404).json({ error: "T-shirt not found" });
    }
    res.status(200).json({ message: "T-shirt deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/updatetshirts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, color, type, gender, price, quantity, image } = req.body;

  try {
    const updatedTShirt = await TShirt.findByIdAndUpdate(
      id,
      { name, color, type, gender, price, quantity, image },
      { new: true } // This option returns the updated document
    );

    if (!updatedTShirt) {
      return res.status(404).send({ error: "T-shirt not found" });
    }

    res.send(updatedTShirt);
  } catch (error) {
    res.status(500).send({ error: "Error updating T-shirt" });
  }
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
