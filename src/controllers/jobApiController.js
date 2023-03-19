const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ createdBy: userID, _id: jobId });
  if (!job) {
    throw new NotFound(`No job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const jobs = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ jobs });
};
const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequest("Company or Position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFound(`NO job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId },
  } = req;
  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userID });
  if (!job) {
    throw new NotFound(`NO job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json(`Delete job with id :${jobId} successfully`);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
