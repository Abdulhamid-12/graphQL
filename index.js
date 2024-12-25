const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const axios = require("axios");
const WEATHER_API_KEY  = "835d2072fcf14599a23235539241312";
const DEFAULT_LOCATION = 'Riyadh';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type Location {
      name: String!,
      region: String!,
      country: String!,
      lat: Float!,
      lon: Float!,
      tz_id: String!,
      localtime_epoch: Int!,
      localtime: String!
    }
  
    type Condition {
      text: String!,
      icon: String!,
      code: Int!
    }
  
    type Current {
      last_updated_epoch: Int!,
      last_updated: String!,
      temp_c: Float!,
      temp_f: Float!,
      is_day: Int!,
      condition: Condition!,
      wind_mph: Float!,
      wind_kph: Float!,
      wind_degree: Int!,
      wind_dir: String!,
      pressure_mb: Int!,
      pressure_in: Float!,
      precip_mm: Float!,
      precip_in: Float!,
      humidity: Int!,
      cloud: Int!,
      feelslike_c: Float!,
      feelslike_f: Float!,
      windchill_c: Float!,
      windchill_f: Float!,
      heatindex_c: Float!,
      heatindex_f: Float!,
      dewpoint_c: Float!,
      dewpoint_f: Float!,
      vis_km: Float!,
      vis_miles: Float!,
      uv: Float!,
      gust_mph: Float!,
      gust_kph: Float!
    }
  
    type Weather {
      location: Location!,
      current: Current!
    }
  
    type Query {
      weather(location: String): Weather!
    }
  `);

// The root provides a resolver function for each API endpoint
const root = {
  weather: async ({ location }) => {
    const queryLocation = location || DEFAULT_LOCATION;
    const BASE_URL = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${queryLocation}`;
    const response = await axios.get(BASE_URL);
    const data = response.data;
    return {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        tz_id: data.location.tz_id,
        localtime_epoch: data.location.localtime_epoch,
        localtime: data.location.localtime,
      },
      current: {
        last_updated_epoch: data.current.last_updated_epoch,
        last_updated: data.current.last_updated,
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        is_day: data.current.is_day,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
          code: data.current.condition.code,
        },
        wind_mph: data.current.wind_mph,
        wind_kph: data.current.wind_kph,
        wind_degree: data.current.wind_degree,
        wind_dir: data.current.wind_dir,
        pressure_mb: data.current.pressure_mb,
        pressure_in: data.current.pressure_in,
        precip_mm: data.current.precip_mm,
        precip_in: data.current.precip_in,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
        windchill_c: data.current.windchill_c,
        windchill_f: data.current.windchill_f,
        heatindex_c: data.current.heatindex_c,
        heatindex_f: data.current.heatindex_f,
        dewpoint_c: data.current.dewpoint_c,
        dewpoint_f: data.current.dewpoint_f,
        vis_km: data.current.vis_km,
        vis_miles: data.current.vis_miles,
        uv: data.current.uv,
        gust_mph: data.current.gust_mph,
        gust_kph: data.current.gust_kph,
      },
    };
  },
};

const app = express();
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
