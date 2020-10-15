import express from "express";

const app = express();
const port = 8080;

app.get( "/printSingleFrame", ( req, res ) => {
    res.send( "Eluwina" );
} );

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
