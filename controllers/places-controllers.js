const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");

const getCordsForAddress = require("../util/location");

const { validationResult } = require("express-validator");
const Place = require("../models/places");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provide id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed. please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provide user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    return next(
      HttpError("Invalid Input passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let cordinates;

  try {
    cordinates = await getCordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: cordinates,
    image:
      "https://images.pexels.com/photos/5847338/pexels-photo-5847338.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (er) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    console.log(er);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    return next(
      new HttpError("Invalid Input passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not update place.",
      500
    );
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not update place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Somthing went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleting place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
