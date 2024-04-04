import React, { useState, useEffect } from "react";

function ProgressBar({ value, max, onIncrement, onReset }) {
  const [progress, setProgress] = useState((value / max) * 100);
  const [isFull, setIsFull] = useState(false);

  const handleIncrement = async () => {
    const updatedProgress = Math.min(progress + 10, 100); // Increment progress by 10 (adjust as needed)
    setProgress(updatedProgress);
    await onIncrement(); // Call the onIncrement function passed from parent component
    if (updatedProgress >= 100) {
      setIsFull(true);
      alert("Bin full!");
    }
  };

  const handleReset = async () => {
    setProgress(0);
    setIsFull(false);
    await onReset(); // Call the onReset function passed from parent component
  };

  useEffect(() => {
    setProgress((value / max) * 100); // Update progress when value or max changes
  }, [value, max]);

  return (
    <div>
      <div className="h-4 bg-gray-200 rounded-full mb-4">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {!isFull && (
        <button
          onClick={handleIncrement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
        >
          Increment Progress
        </button>
      )}
      <button
        onClick={handleReset}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Reset Progress
      </button>
    </div>
  );
}

export default function Status() {
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/status");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setOrgData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/reset-bins", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to reset bins");
      }
      await fetchData(); // Fetch data again to reset all progress bars
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrementDryBins = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/increment-dry-bins", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to increment dry bins");
      }
      await fetchData(); // Fetch data again to update the counts
    } catch (error) {
      console.error(error);
    }
  };
  const handleIncrementWetBins = async (orgName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/increment-wet-bins?org_name=${orgName}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to increment wet bins");
      }
      await fetchData(); // Fetch data again to update the counts
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : orgData ? (
        <div className="">
          {orgData.map((org, index) => (
            <div key={index} className=" mx-auto mb-6">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {org.org_name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Name:</strong> {org.org_repr_detail.name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {org.org_repr_detail.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Contact No:</strong> {org.org_repr_detail.contact_no}
                </p>
                <div className="mt-4">
                  <div className="mb-5">
                    <p className="text-gray-700 dark:text-gray-300">
                      Filled Wet Bins: {org.filled_wet_bins}/{org.tot_wet_bins}
                    </p>
                    <ProgressBar
                      value={org.filled_wet_bins}
                      max={org.tot_wet_bins}
                      onIncrement={() => handleIncrementWetBins(org.org_name)} // Pass org_name to the function
                      onReset={handleResetAll}
                    />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Filled Dry Bins: {org.filled_dry_bins}/{org.tot_dry_bins}
                    </p>
                    <ProgressBar
                      value={org.filled_dry_bins}
                      max={org.tot_dry_bins}
                      onIncrement={handleIncrementDryBins}
                      onReset={handleResetAll}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
