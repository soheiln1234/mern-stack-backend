// const axios=require("axios")
// const HttpError=require("../models/http-error")

// const API_KEY='AIzkkakjenkwwppdpfkror_Fofdkffdkf

const getCordsForAddress = (address) => {
  // i don't have billing account so icant setup gecodinggoogleapu :(
  //

  return {
    lat: 40.7484474,
    lang: -73.9871516,
  };

  // const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY')

  // const data=response.data

  // if(!data || data.status === 'ZERO_RESULTS){
  // const error = new HttpError('Could not finf location for the specified address',422)
  // throw error
  // }

  // const cordinates=data.results[0].geometry.location

  // return cordinates
};

module.exports = getCordsForAddress;
