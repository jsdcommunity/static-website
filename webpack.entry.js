module.exports = [
    {
        html: "index.html", // filename and the chunk's name will be index
        js: "scripts"
    },
    {
        html: "home.html",
        chunks: ['index'] // will load the chunk index instead of bundling its own js file
    },
]