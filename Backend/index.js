const init =require("./src/server");


function main() {
    // Utiliser le port 3001 pour éviter le conflit avec Next.js (port 3000)
    const PORT = process.env.PORT || 3001;
    let app = init(PORT,(port)=>{console.log("app listening on port "+port)});
 }
 
 main();
 