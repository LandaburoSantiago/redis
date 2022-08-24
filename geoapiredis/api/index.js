const redis = require("redis");
const express = require("express");
const cors = require("cors");
const { GeoReplyWith } = require("redis");
const app = express();
const port = 3003;
const redisClient = redis.createClient({
  url: "redis://db:6379",
});
const geo = require("georedis").initialize(redisClient);
app.set("port", port);
app.use(
  cors({
    origin: "*",
  })
);

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("conectado a redis");
  } catch (error) {
    console.log("error al conectarse a redis");
  }
};
connectRedis();

app.get("/", (req, res) => {
  res.send("Bienvenidos a la geoapi con redis");
});

app.get("/getInterestGroups", (req, res) => {
  const interest_groups = [
    { label: "Cervecerías artesanales", value: "cervecerias_artesanales" },
    { label: "Universidades", value: "universidades" },
    { label: "Farmacias", value: "farmacias" },
    {
      label: "Centro de atención de emergencias",
      value: "centro_de_atencion_de_emergencias",
    },
    { label: "Supermercados", value: "supermercados" },
  ];
  res.send(interest_groups);
});

app.get("/initializeCraftBreweries", (req, res) => {
  redisClient.geoAdd("cervecerias_artesanales", {
    longitude: -32.47982802285418,
    latitude: -58.23524577193214,
    member: "7 colinas",
  });
  redisClient.geoAdd("cervecerias_artesanales", {
    longitude: -32.48364196995287,
    latitude: -58.23327710246929,
    member: "Grow - Fernetería & Cervecería",
  });
  res.send("ok");
});

app.get("/initializeUniversities", (req, res) => {
  redisClient.geoAdd("universidades", {
    longitude: -32.49567329453565,
    latitude: -58.22957921527174,
    member: "UTN FRCU",
  });
  redisClient.geoAdd("universidades", {
    longitude: -32.47897539138854,
    latitude: -58.2335130441803,
    member: "UADER - Facultad de Ciencia y Tecnología",
  });
  res.send("ok");
});

app.get("/initializePharmacies", (req, res) => {
  redisClient.geoAdd("farmacias", {
    longitude: -32.48627555534657,
    latitude: -58.2309588789938,
    member: "Farmacia Suárez",
  });
  redisClient.geoAdd("farmacias", {
    longitude: -32.48593618009249,
    latitude: -58.23302015662175,
    member: "Farmacia Alberdi",
  });
  res.send("ok");
});

app.get("/initializeEmergencies", (req, res) => {
  redisClient.geoAdd("centro_de_atencion_de_emergencias", {
    longitude: -32.48208305021179,
    latitude: -58.23073214536207,
    member: "Vida Emergencias",
  });
  redisClient.geoAdd("centro_de_atencion_de_emergencias", {
    longitude: -32.48362839457438,
    latitude: -58.236682713031314,
    member: "Alerta Emergencias Cardiomedicas SA",
  });
  res.send("ok");
});

app.get("/initializeSupermarket", (req, res) => {
  redisClient.geoAdd("supermercados", {
    longitude: -32.486026680284176,
    latitude: -58.236118735101336,
    member: "GranRex",
  });
  redisClient.geoAdd("supermercados", {
    longitude: -32.4858626486259,
    latitude: -58.232654035091194,
    member: "Supermercado Supremo",
  });
  res.send("ok");
});

app.get("/getCraftBreweriesInFiveKilometersRadius", (req, res) => {
  const params = JSON.parse(req.query.location_user);
  const { userLatitude } = params;
  const { userLongitude } = params;
  if (userLatitude && userLongitude) {
    redisClient
      .geoSearchWith(
        "cervecerias_artesanales",
        { longitude: userLatitude, latitude: userLongitude },
        { radius: 5, unit: "km" },
        [GeoReplyWith.COORDINATES]
      )
      .then(async (data) => {
        await redisClient.geoAdd("cervecerias_artesanales", {
          longitude: userLongitude,
          latitude: userLatitude,
          member: "my_current_position",
        });
        const data_with_distance = [...data];
        for (const [index, place] of data.entries()) {
          if (place.member !== "my_current_position") {
            await redisClient
              .geoDist(
                "cervecerias_artesanales",
                place.member,
                "my_current_position",
                "km"
              )
              .then((data) => {
                data_with_distance[index].distanceWithMe = data;
              });
          }
        }
        res.send(
          data_with_distance.filter((e) => e.member !== "my_current_position")
        );
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  } else {
    res.send("No hay información sobre la ubicación del usuario");
  }
});

app.get("/getUniversitiesInFiveKilometersRadius", (req, res) => {
  const params = JSON.parse(req.query.location_user);
  const { userLatitude } = params;
  const { userLongitude } = params;
  if (userLatitude && userLongitude) {
    redisClient
      .geoSearchWith(
        "universidades",
        { longitude: userLatitude, latitude: userLongitude },
        { radius: 5, unit: "km" },
        [GeoReplyWith.COORDINATES]
      )
      .then(async (data) => {
        await redisClient.geoAdd("universidades", {
          longitude: userLongitude,
          latitude: userLatitude,
          member: "my_current_position",
        });
        const data_with_distance = [...data];
        for (const [index, place] of data.entries()) {
          if (place.member !== "my_current_position") {
            await redisClient
              .geoDist(
                "universidades",
                place.member,
                "my_current_position",
                "km"
              )
              .then((data) => {
                data_with_distance[index].distanceWithMe = data;
              });
          }
        }
        res.send(
          data_with_distance.filter((e) => e.member !== "my_current_position")
        );
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  } else {
    res.send("No hay información sobre la ubicación del usuario");
  }
});

app.get("/getPharmaciesInFiveKilometersRadius", (req, res) => {
  const params = JSON.parse(req.query.location_user);
  const { userLatitude } = params;
  const { userLongitude } = params;
  if (userLatitude && userLongitude) {
    redisClient
      .geoSearchWith(
        "farmacias",
        { longitude: userLatitude, latitude: userLongitude },
        { radius: 5, unit: "km" },
        [GeoReplyWith.COORDINATES]
      )
      .then(async (data) => {
        await redisClient.geoAdd("farmacias", {
          longitude: userLongitude,
          latitude: userLatitude,
          member: "my_current_position",
        });
        const data_with_distance = [...data];
        for (const [index, place] of data.entries()) {
          if (place.member !== "my_current_position") {
            await redisClient
              .geoDist("farmacias", place.member, "my_current_position", "km")
              .then((data) => {
                data_with_distance[index].distanceWithMe = data;
              });
          }
        }
        res.send(
          data_with_distance.filter((e) => e.member !== "my_current_position")
        );
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  } else {
    res.send("No hay información sobre la ubicación del usuario");
  }
});

app.get("/getEmergenciesInFiveKilometersRadius", (req, res) => {
  const params = JSON.parse(req.query.location_user);
  const { userLatitude } = params;
  const { userLongitude } = params;
  if (userLatitude && userLongitude) {
    redisClient
      .geoSearchWith(
        "centro_de_atencion_de_emergencias",
        { longitude: userLatitude, latitude: userLongitude },
        { radius: 5, unit: "km" },
        [GeoReplyWith.COORDINATES]
      )
      .then(async (data) => {
        await redisClient.geoAdd("centro_de_atencion_de_emergencias", {
          longitude: userLongitude,
          latitude: userLatitude,
          member: "my_current_position",
        });
        const data_with_distance = [...data];
        for (const [index, place] of data.entries()) {
          if (place.member !== "my_current_position") {
            await redisClient
              .geoDist(
                "centro_de_atencion_de_emergencias",
                place.member,
                "my_current_position",
                "km"
              )
              .then((data) => {
                data_with_distance[index].distanceWithMe = data;
              });
          }
        }
        res.send(
          data_with_distance.filter((e) => e.member !== "my_current_position")
        );
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  } else {
    res.send("No hay información sobre la ubicación del usuario");
  }
});

app.get("/getSupermarketsInFiveKilometersRadius", (req, res) => {
  const params = JSON.parse(req.query.location_user);
  const { userLatitude } = params;
  const { userLongitude } = params;
  if (userLatitude && userLongitude) {
    redisClient
      .geoSearchWith(
        "supermercados",
        { longitude: userLatitude, latitude: userLongitude },
        { radius: 5, unit: "km" },
        [GeoReplyWith.COORDINATES]
      )
      .then(async (data) => {
        await redisClient.geoAdd("supermercados", {
          longitude: userLongitude,
          latitude: userLatitude,
          member: "my_current_position",
        });
        const data_with_distance = [...data];
        for (const [index, place] of data.entries()) {
          if (place.member !== "my_current_position") {
            await redisClient
              .geoDist(
                "supermercados",
                place.member,
                "my_current_position",
                "km"
              )
              .then((data) => {
                data_with_distance[index].distanceWithMe = data;
              });
          }
        }
        res.send(
          data_with_distance.filter((e) => e.member !== "my_current_position")
        );
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  } else {
    res.send("No hay información sobre la ubicación del usuario");
  }
});

app.post("/addMember", (req, res) => {
  const group = req.query["group"];
  const member = req.query["member"];
  const latitude = Number(req.query["latitude"]);
  const longitude = Number(req.query["longitude"]);
  console.log(latitude);
  console.log(longitude);

  if (group && member && latitude && longitude) {
    redisClient
      .geoAdd(group, {
        longitude: longitude,
        latitude: latitude,
        member: member,
      })
      .then(() => {
        res.send("Creado exitosamente");
      })
      .catch((error) => {
        console.log(error);
        res.send("Ocurrió algun error. Pruebe mas tarde.");
      });
  } else {
    res.send("No recibimos todos los datos necesarios.");
  }
});

app.listen(app.get("port"), (err) => {
  console.log(`Server corriendo en el puerto ${port}`);
});
