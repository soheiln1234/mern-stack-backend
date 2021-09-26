const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");

const DUMMY_PLACES = [
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

const getPlaceUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((place) => place.creator === userId);

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provide user id.", 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
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

exports.getPlaceById = getPlaceById;
exports.getPlaceUserId = getPlaceUserId;
exports.createPlace = createPlace;
