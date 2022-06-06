const redis = require('redis');
const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors({
    origin: '*'
}));
const port = 3002
const redisClient = redis.createClient({
    url:"redis://db_redis_kylo:6379",
});
app.set('port', port)


const connectRedis = async () =>{
    try {
        await redisClient.connect()
        console.log("-------------------------------------")
        console.log("conectado a redis")
    } catch (error) {
        console.log("error al conectarse a redis")
    }

}    
    
    const setData = async ()=>{
    try {    
        await redisClient.set("key1", "Hola mundo 1")
        await redisClient.set("key2", "Hola mundo 2")
        await redisClient.set("key3", "Hola mundo 3")
    } catch (error) {
        console.log("error al insertar los datos")
    }
    
}
const getData = async ()=>{
    console.log(await redisClient.get("key1"));
    console.log(await redisClient.get("key2"));
    console.log(await redisClient.get("key3"));
}
// Otra alternativa
// redisClient.get("key1").then((data)=>{
//     console.log(data)
//     })
    
    const setList = async ()=>{
        try {
            await redisClient.lPush("list1", ["val1", "val2", "val3", "val4"])
        } catch (error) {
            console.log("error al crear la lista")
        }
    }
const getList= async ()=>{
    try {
        console.log(await redisClient.LRANGE("list1", 0, -1));
    } catch (error) {
        console.log("error al obtener la lista" + error)
    }
}

const main = async ()=>{
    await connectRedis()
    // await setData();
    // console.log("------------------------------------")
    // await setData();
    // await getData()
    
    // await setList();
    // console.log("------------------------------------")
    // await setList();
    // await getList();
    
}

main()

app.get("/", (req,res)=>{
    res.send("Bienvenidos a la api con redis")
})

app.post("/create", (req,res)=>{
       redisClient.lPush(req.query["episodio"], [req.query["personaje"]])
       .then(()=>{
           res.send("Carga ok")
       })
       .catch((error)=>{
           res.send("Error al cargar el personaje " + error)
       })
})

app.post("/delete", (req,res)=>{
    redisClient.lRem(req.query["episodio"], -1 ,[req.query["personaje"]])
    .then(()=>{
        res.send("Carga ok")
    })
    .catch((error)=>{
        res.send("Error al cargar el personaje " + error)
    })
})

app.get("/list", async (req,res)=>{
    const lenList = await redisClient.lLen(req.query["episodio"]);
    redisClient.lRange(req.query["episodio"], 0, lenList)
    .then((data)=>{
        const personajes = data;
        res.send(personajes);
    })
    .catch((error)=>{
        res.send("Error al listar los personajes " + error)

    })
})


app.listen(app.get('port'), (err)=>{
    console.log(`Server corriendo en el puerto ${port}`)
})

