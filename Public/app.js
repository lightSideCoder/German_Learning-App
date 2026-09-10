//TO-DO: übersetzung der erklärung ist noch n bisschen buggy. wenn man hin und her toggelt, kann es sein dass verschiedene übersetzungen angezigt werden
//Notizen <div> hinzufügen (scrollbar, speicherbar)
const input = document.getElementById("input")
const output = document.getElementById("output")
const header = document.getElementById("header")
const randProverb = document.getElementById("random")
const displayProverb = document.getElementById("proverbDisplay")
const explanation = document.getElementById("proverbMeaning")
const toggleLang = document.getElementById("lang")
let langTrans = 0	//0=de 1=fr
let proverbsObject
let index

async function loadProverbs() {
	const response = await fetch("/sprichwoerter.json")
	proverbsObject = await response.json()
}
loadProverbs()

async function translateMeaning() {
	const response =  await fetch("/translate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			text: explanation.textContent,
			targetLang: langTrans ? "fr" : "de"
		})
	})
	const data = await response.json()
	explanation.textContent = data.text
	langTrans = langTrans === 0 ? 1 : 0
}

function calibrateTranslator() {
	if (langTrans === 0)	{
		toggleLang.textContent = ">> französisch"
		header.textContent = "Übersetzer"
		input.placeholder = "Drücke 'Enter' zum Übersetzen"
	} else {
		toggleLang.textContent = ">> allemand"//français"
		header.textContent = "Traducteur"
		input.placeholder = "Appuie sur « Entrée » pour traduire"
	}
	langTrans = langTrans === 0 ? 1 : 0
}

calibrateTranslator()

toggleLang.addEventListener("click", calibrateTranslator)

input.addEventListener("keydown", async ev => {
    if (ev.key === "Enter") {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: input.value,
				targetLang: langTrans ? "fr" : "de"
            })
        })

        const data = await response.json()
		output.textContent = data.text
    }
})

randProverb.addEventListener("click", () => {
	index = Math.floor(Math.random() * proverbsObject.length)	
	displayProverb.textContent = `"${proverbsObject[index].sprichwort}"`
	explanation.textContent = ""
})

displayProverb.addEventListener("click", () => {
	explanation.textContent = `Erklärung: ${proverbsObject[index].erklaerung}`
})

explanation.addEventListener("click", translateMeaning)
