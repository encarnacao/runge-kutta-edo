import { exec } from "child_process";
import { promisify } from "util";
import express from "express";
import Joi from "joi";

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
async function pythonScript(equation,x0,y0,dy0,step,n){
    console.log("executando script");
    const { stdout, stderr } = await execPromise(`python ./src/script.py ${equation} ${x0} ${y0} ${dy0} ${step} ${n}`);
}
async function installRequirements(){
    console.log("instalando requirements");
    const { stdout, stderr } = await execPromise(`pip install -r ./requirements.txt`);
    return stdout;
}
app.post("/ode", (req,res) =>{
    const { error } = odeSchema.validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const { equation, x0, y0, dy0, step, max } = req.body;
    const n = parseInt(Number(max)/Number(step));
    pythonScript(equation,x0,y0,dy0,step,n).then(()=>{
        res.status(201).send("Script executado com sucesso");
    }
    );
})

//Testing route
app.get("/", (_,res)=>{
    res.send("Hello World");
});

app.listen(PORT, () => {
    installRequirements().then(() => console.log("requirements instalados"));
    console.log(`Server running on port ${PORT}`);
});