#!/usr/bin/env node

"use strict"

const boxen = require("boxen")
const chalk = require("chalk")
const inquirer = require("inquirer")
const clear = require("clear")
const open = require("open")
const qrCode = require("qrcode-terminal")
const fs = require("fs")
const request = require("request")
const path = require("path")
const ora = require("ora")
const cliSpinners = require("cli-spinners")

const MY_CV_URL = "https://github.com/ebdonato/cv/raw/main/cv-eduardo-donato.pdf"
const MY_CV_FILE_NAME = "cv-eduardo-donato.pdf"

clear()

const prompt = inquirer.createPromptModule()

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: "Just quit.",
                value: () => {
                    console.log("Hasta la vista.\n")
                },
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Curriculum Vitae")}?`,
                value: () => {
                    // cliSpinners.dots;
                    const loader = ora({
                        text: " Downloading Curriculum Vitae",
                        spinner: cliSpinners.material,
                    }).start()

                    let pipe = request(MY_CV_URL).pipe(fs.createWriteStream(`./${MY_CV_FILE_NAME}`))

                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), MY_CV_FILE_NAME)
                        console.log(`\nCurriculum Vitae Downloaded at ${downloadPath} \n`)
                        open(downloadPath)
                        loader.stop()
                    })
                },
            },
            {
                name: `Send me an ${chalk.green.bold("e-mail")}`,
                value: () => {
                    open("mailto:eduardo.donato@gmail.com")
                    console.log("Done, see you soon at inbox.\n")
                },
            },
        ],
    },
]

const data = {
    name: chalk.bold.green("              Eduardo Batista Donato"),
    handle: chalk.white("@ebdonato"),
    work: `${chalk.white("              Software Developer at")} ${chalk.hex("#2b82b2").bold("Eletromarquez")}`,
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan("ebdonato"),
    github: chalk.gray("https://github.com/") + chalk.green("ebdonato"),
    linkedIn: chalk.gray("https://linkedin.com/in/") + chalk.blue("ebdonato"),
    web: chalk.gray("https://gravatar.com/") + chalk.redBright("ebdonato"),
    npx: chalk.red("npx") + " " + chalk.white("ebdonato"),

    labelTwitter: chalk.white.bold("    Twitter:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:"),
}

qrCode.generate("https://github.com/ebdonato", {small: true}, function (code) {
    const arr = code.split("\n")

    let i = 0

    const me = boxen(
        [
            `${arr[i++]} ${data.name}`,
            `${arr[i++]} ${data.work}`,
            `${arr[i++]}`,
            `${arr[i++]} ${data.labelTwitter}  ${data.twitter}`,
            `${arr[i++]} ${data.labelGitHub}  ${data.github}`,
            `${arr[i++]} ${data.labelLinkedIn}  ${data.linkedIn}`,
            `${arr[i++]} ${data.labelWeb}  ${data.web}`,
            `${arr[i++]}`,
            `${arr[i++]} ${data.labelCard}  ${data.npx}`,
            `${arr[i++]}`,
            `${arr[i++]}     ${chalk.italic("I am an electrical and planning engineer.")}`,
            `${arr[i++]}     ${chalk.italic("I am currently a Microsoft Power Platform designer,")}`,
            `${arr[i++]}     ${chalk.italic("(Power BI, Power Apps e Power Automate),")}`,
            `${arr[i++]}     ${chalk.italic("and modern web full-stack developer (VueJS e ExpressJS).")}`,
        ].join("\n"),
        {
            margin: 1,
            float: "center",
            padding: 1,
            borderStyle: "round",
            borderColor: "green",
        }
    )

    console.log(me)
    const tip = [`Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above`, ""].join("\n")
    console.log(tip)

    prompt(questions).then((answer) => answer.action())
})
