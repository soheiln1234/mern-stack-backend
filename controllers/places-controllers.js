const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");

const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state Building",
    description: "One of the most famous sky scrapers in the world!",
    locations: {
      lat: 40.7484474,
      lang: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provide id.", 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provide user id.", 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError("Invalid Input passed, please check your data.", 422);
  }

  const { title, description, cordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    locations: cordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError("Invalid Input passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => placeId === place.id),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
    throw new HttpError("Could not find place for that id.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.find((place) => place.id !== placeId);
  res.status(200).json({ message: "Deleting place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
