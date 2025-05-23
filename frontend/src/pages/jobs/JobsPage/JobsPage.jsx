import React from "react";
import Hero from "./Hero";
import JobFilters from "./JobFilters";
import JobResults from "./JobResults";

const JobsPage = () => {
  return (
    <div className="mx-xl-5 my-4 px-3 px-sm-5">
      <Hero />
      <div className="main row gap-3 m-0">
        <JobFilters />
        <JobResults />
      </div>
    </div>
  );
};

export default JobsPage;
