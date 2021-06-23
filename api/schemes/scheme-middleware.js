const db = require("./scheme-model");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params;

  try {
    const schemeID = await db.findById(scheme_id);
    if (!schemeID) {
      res
        .status(404)
        .json({ message: `scheme with scheme_id ${schemeID} not found` });
    } else {
      req.schemeID = schemeID;
      next();
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const scheme_name = req.body.scheme_name;
  if (!scheme_name || scheme_name === "" || typeof scheme_name !== "string") {
    res.status(400).json({ message: "invalid scheme_name" });
  }
  next();
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const instructions = req.body.instructions;
  const step_number = req.body.step_number;
  //console.log(instructions);

  if (!step_number || !instructions) {
    return res
      .status(400)
      .json({ message: "step number and instructions are required" });
  }
  if (typeof instructions !== "string") {
    return res.status(400).json({ message: "instructions must be a string" });
  }
  if (typeof step_number !== "number") {
    return res.status(400).json({ message: "step number must be a number" });
  }
  if (step_number < 1) {
    return res.status(400).json({ message: "step number must be 1 and up" });
  }
  next();
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
