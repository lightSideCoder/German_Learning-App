import express from "express"
import * as deepl from "deepl-node"
import "dotenv/config"

const app = express()
const deeplClient = new deepl.DeepLClient(process.env.DEEPL_KEY)

app.use(express.json())
app.use(express.static("Public"))

app.post("/translate", async (req, res) => {
    try {
        const result = await deeplClient.translateText(
            req.body.text,
            null,
            req.body.targetLang
        )

        res.json({ text: result.text })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Translation failed" })
    }
})

app.listen(8000, () => {
    console.log("http://localhost:8000")
})
