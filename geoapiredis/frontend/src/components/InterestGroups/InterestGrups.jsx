import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {
  Grid,
  Container,
  Flex,
  Text,
  Button,
  Tooltip,
} from "@chakra-ui/react";
const InterestGroups = () => {
  const [interestGroups, setInterestGroups] = useState([]);
  const [craftBreweries, setCraftBreweries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [locationUser, setLocationUser] = useState({
    userLatitude: 0,
    userLongitude: 0,
  });
  const getInterestGroups = async () => {
    try {
      const dataInterestGroups = await axios.get(
        "http://localhost:3003/getInterestGroups"
      );
      setInterestGroups(dataInterestGroups.data);
    } catch (error) {}
  };

  const getCraftBreweriesInFiveKilometersRadius = async (location_user) => {
    if (location_user.userLatitude && location_user.userLongitude) {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/getCraftBreweriesInFiveKilometersRadius`,
          {
            params: { location_user },
          }
        );
        setCraftBreweries(data);
      } catch (error) {}
    }
  };

  const getUniversitiesInFiveKilometersRadius = async (location_user) => {
    if (location_user.userLatitude && location_user.userLongitude) {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/getUniversitiesInFiveKilometersRadius`,
          {
            params: { location_user },
          }
        );
        setUniversities(data);
      } catch (error) {}
    }
  };

  const getPharmaciesInFiveKilometersRadius = async (location_user) => {
    if (location_user.userLatitude && location_user.userLongitude) {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/getPharmaciesInFiveKilometersRadius`,
          {
            params: { location_user },
          }
        );
        setPharmacies(data);
      } catch (error) {}
    }
  };

  const getEmergenciesInFiveKilometersRadius = async (location_user) => {
    if (location_user.userLatitude && location_user.userLongitude) {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/getEmergenciesInFiveKilometersRadius`,
          {
            params: { location_user },
          }
        );
        setEmergencies(data);
      } catch (error) {}
    }
  };

  const getSupermarketsInFiveKilometersRadius = async (location_user) => {
    if (location_user.userLatitude && location_user.userLongitude) {
      try {
        const { data } = await axios.get(
          `http://localhost:3003/getSupermarketsInFiveKilometersRadius`,
          {
            params: { location_user },
          }
        );
        setSupermarkets(data);
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (locationUser.userLatitude && locationUser.userLongitude) {
      getCraftBreweriesInFiveKilometersRadius(locationUser);
      getUniversitiesInFiveKilometersRadius(locationUser);
      getPharmaciesInFiveKilometersRadius(locationUser);
      getEmergenciesInFiveKilometersRadius(locationUser);
      getSupermarketsInFiveKilometersRadius(locationUser);
    }
  }, [locationUser]);

  useEffect(() => {
    getInterestGroups();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationUser((oldState) => {
          const newState = JSON.parse(JSON.stringify(oldState));

          newState["userLongitude"] = position.coords.longitude;
          newState["userLatitude"] = position.coords.latitude;
          return newState;
        });
      });
    }
  }, []);

  return (
    <>
      {interestGroups.length ? (
        <>
          <Text fontWeight={"bold"} margin="0 auto" fontSize={"2xl"}>
            Grupos de interes en un radio de 5km
          </Text>
          <Grid
            templateColumns={{
              sm: `repeat(1, 1fr)`,
              md: `repeat(3, 1fr)`,
              lg: `repeat(${interestGroups.length}, 1fr)`,
            }}
            mt={4}
            gap={interestGroups.length + 1}
            style={{ minHeight: "100%" }}
          >
            {interestGroups.map((interestGroup) => (
              <Flex flexDirection={"column"} textAlign="center">
                <Text whiteSpace={'nowrap'} fontWeight={"bold"} fontSize={"md"}>
                  {interestGroup.label}
                </Text>
                <Container
                  maxH={"400px"}
                  w={"100%"}
                  textAlign="left"
                  border={"1px solid white"}
                  borderRadius="10px"
                  padding={"20px"}
                  mt={3}
                  overflowY="scroll"
                  maxW={"none"}
                >
                  {interestGroup.value === "cervecerias_artesanales" ? (
                    <>
                      {craftBreweries.length ? (
                        <>
                          {craftBreweries.map((craftBrewerie) => (
                            <>
                            <Tooltip placement="top" label={`A ${Math.round(craftBrewerie.distanceWithMe)} km`}>
                              <Text whiteSpace={"nowrap"}>
                                {craftBrewerie.member}
                              </Text>
                              </Tooltip>
                            </>
                          ))}
                        </>
                      ) : (
                        <Text>No se ecnontraron datos</Text>
                      )}
                    </>
                  ) : interestGroup.value === "universidades" ? (
                    <>
                      {universities.length ? (
                        <>
                          {universities.map((university) => (
                            <>
                            <Tooltip placement="top" label={`A ${Math.round(university.distanceWithMe)} km`}>
                              <Text whiteSpace={"nowrap"}>
                                {university.member}
                              </Text>
                              </Tooltip>
                            </>
                          ))}
                        </>
                      ) : (
                        <Text>No se encontraron datos</Text>
                      )}
                    </>
                  ) : interestGroup.value === "farmacias" ? (
                    <>
                      {pharmacies.length ? (
                        <>
                          {pharmacies.map((pharmacy) => (
                            <>
                            <Tooltip placement="top" label={`A ${Math.round(pharmacy.distanceWithMe)} km`}>
                              <Text whiteSpace={"nowrap"}>
                                {pharmacy.member}
                              </Text>
                              </Tooltip>
                            </>
                          ))}
                        </>
                      ) : (
                        <Text>No se ecnontraron datos</Text>
                      )}
                    </>
                  ) : interestGroup.value === "centro_de_atencion_de_emergencias" ? (
                    <>
                      {emergencies.length ? (
                        <>
                          {emergencies.map((emergency) => (
                            <>
                            <Tooltip placement="top" label={`A ${Math.round(emergency.distanceWithMe)} km`}>
                              <Text whiteSpace={"nowrap"}>
                                {emergency.member}
                              </Text>
                              </Tooltip>
                            </>
                          ))}
                        </>
                      ) : (
                        <Text>No se ecnontraron datos</Text>
                      )}
                    </>
                  ) : interestGroup.value === "supermercados" ? (
                    <>
                      {supermarkets.length ? (
                        <>
                          {supermarkets.map((supermarket) => (
                            <>
                            <Tooltip placement="top" label={`A ${Math.round(supermarket.distanceWithMe)} km`}>
                              <Text whiteSpace={"nowrap"}>
                                {supermarket.member}
                              </Text>
                              </Tooltip>
                            </>
                          ))}
                        </>
                      ) : (
                        <Text>No se ecnontraron datos</Text>
                      )}
                    </>
                  ):null}
                </Container>
                <Button onClick={()=>window.location.href=`/addMember/${interestGroup.value}`} mt={3}>+ Agregar lugar</Button>
              </Flex>
            ))}
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default InterestGroups;
