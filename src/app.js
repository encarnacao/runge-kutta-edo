import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import express from "express";
import Joi from "joi";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const odeSchema = Joi.object({
	equation: Joi.string().required(),
	x0: Joi.number().required(),
	y0: Joi.number().required(),
	dy0: Joi.number().required(),
	step: Joi.number().required(),
	max: Joi.number().required(),
});

const app = express();
app.use(express.json());
const PORT = 5000;

const execPromise = promisify(exec);
async function pythonScript(equation, x0, y0, dy0, step, n) {
	console.log("executando script");
	const { stdout, stderr } = await execPromise(
		`python ./src/script.py ${equation} ${x0} ${y0} ${dy0} ${step} ${n}`
	);
}
async function installRequirements() {
	console.log("instalando requirements");
	const { stdout, stderr } = await execPromise(
		`pip install -r ./requirements.txt`
	);
	return stdout;
}
app.post("/ode", (req, res) => {
	try {
		const { error } = odeSchema.validate(req.body);
		if (error) {
			res.status(400).send(error.details[0].message);
			return;
		}
		const { equation, x0, y0, dy0, step, max } = req.body;
		const n = parseInt(Number(max) / Number(step));
		pythonScript(equation, x0, y0, dy0, step, n).then(() => {
			res.status(201).sendFile(
				path.join(__dirname, "../images", "plot.png"),
				(err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Imagem enviada");
					}
				}
			);
		});
	} catch {
		res.status(500).send("Não foi possível executar o script");
	}
});

app.get("/edo", async (req, res) => {
	try {
		const { equation, x0, y0, dy0, step, max } = req.query;
		const n = parseInt(Number(max) / Number(step));
		try {
			await pythonScript(equation, x0, y0, dy0, step, n);
		} catch {
			res.sendStatus(500);
			return;
		} finally {
			res.status(201).sendFile(
				path.join(__dirname, "../images", "plot.png"),
				(err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Imagem enviada");
					}
				}
			);
		}
	} catch {
		res.status(500).send("Não foi possível executar o script");
	}
});

//Testing route
app.get("/", async (_, res) => {
	const { stdout:version } = await execPromise("python --version");
	const { stdout:hello} = await execPromise("./src/hello_world.py");
	res.send(version+" --- "+hello);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});