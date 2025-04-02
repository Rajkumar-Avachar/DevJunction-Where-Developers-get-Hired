import { Job } from "../model/job.model.js";
import { Company } from "../model/company.model.js";

//Create Job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      skillsRequired,
      salary,
      location,
      jobType,
    } = req.body;

    const recruiterId = req.user.userId;

    const company = await Company.findOne({ createdBy: recruiterId });

    if (!company) {
      return res.status(403).json({
        message: "You are not associated with any company",
        success: false,
      });
    }

    if (
      !title ||
      !description ||
      !requirements ||
      !skillsRequired ||
      !salary ||
      !location ||
      !jobType
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      skillsRequired: skillsRequired.split(","),
      salary,
      location,
      jobType,
      company: company.id,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get all Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name")
      .populate("createdBy", "fullname");

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not Found",
        success: false,
      });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: true,
    });
  }
};

//Get a single job bt id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not Found",
        success: true,
      });
    }
    return res.status(200).json({
      job,
      succcess: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: true,
    });
  }
};

// Get all jobs created by recruiter (for recruiters only)
export const getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.userId;
    const jobs = await Job.find({ createdBy: recruiterId });
    if (jobs.length === 0) {
      return res.status(404).json({
        message: "You have not created any Job",
        success: false,
      });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Update job details
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    if (!job.createdBy || job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
        success: false,
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (!job.createdBy || job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
        success: false,
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
