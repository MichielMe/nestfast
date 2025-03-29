"use client";

import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user, logout, isInitialized } = useContext(AuthContext);
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [activeView, setActiveView] = useState("workouts");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [isInitialized, user, router]);

  // Fetch data when authenticated
  useEffect(() => {
    if (!isInitialized || !user) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Configure for this request only
        const config = {
          baseURL: "http://localhost:8000",
          headers: { Authorization: `Bearer ${user.token}` },
        };

        // Get data
        const workoutsRes = await axios.get("/workouts/workouts", config);
        const routinesRes = await axios.get("/routines", config);

        setWorkouts(workoutsRes.data || []);
        setRoutines(routinesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, isInitialized]);

  // Handle adding a new workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!workoutName || !workoutDescription) {
      alert("Please fill all fields");
      return;
    }

    try {
      const config = {
        baseURL: "http://localhost:8000",
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post(
        "/workouts",
        {
          name: workoutName,
          description: workoutDescription,
        },
        config
      );

      setWorkouts([...workouts, response.data]);
      setWorkoutName("");
      setWorkoutDescription("");
    } catch (error) {
      console.error("Failed to add workout:", error);
      alert("Failed to add workout");
    }
  };

  // Handle tab change
  const handleTabChange = (view) => (e) => {
    e.preventDefault();
    setActiveView(view);
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  // Show loading spinner while context initializes
  if (!isInitialized || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // If not logged in but initialization is complete, return null (redirect in progress)
  if (!user) {
    return null;
  }

  // Test if buttons work
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">NestFast Dashboard</h1>
        <button
          className="btn btn-error"
          onClick={handleLogout}
          style={{ pointerEvents: "auto" }}
        >
          Logout
        </button>
      </header>

      {error && (
        <div
          className="alert alert-error mb-4"
          style={{ pointerEvents: "auto" }}
        >
          <p>{error}</p>
          <button className="ml-auto" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <div className="mb-4">
        <Link href="/test-page" className="btn btn-outline btn-sm">
          Go to Test Page
        </Link>
      </div>

      <div className="tabs mb-6" style={{ pointerEvents: "auto" }}>
        <a
          href="#"
          className={`tab tab-lg tab-bordered ${
            activeView === "workouts" ? "tab-active" : ""
          }`}
          onClick={handleTabChange("workouts")}
        >
          Workouts
        </a>
        <a
          href="#"
          className={`tab tab-lg tab-bordered ${
            activeView === "routines" ? "tab-active" : ""
          }`}
          onClick={handleTabChange("routines")}
        >
          Routines
        </a>
      </div>

      {activeView === "workouts" && (
        <>
          <div
            className="bg-base-200 p-6 rounded-lg mb-6"
            style={{ pointerEvents: "auto" }}
          >
            <h2 className="text-2xl font-bold mb-4">Add Workout</h2>
            <form onSubmit={handleAddWorkout}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Workout Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  style={{ pointerEvents: "auto" }}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                  style={{ pointerEvents: "auto" }}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ pointerEvents: "auto" }}
              >
                Add Workout
              </button>
            </form>
          </div>

          <h3 className="text-xl font-bold mb-4">Your Workouts</h3>
          {workouts.length === 0 ? (
            <div className="alert alert-info">No workouts found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{workout.name}</h3>
                    <p>{workout.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeView === "routines" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Routines</h2>
          {routines.length === 0 ? (
            <div className="alert alert-info">No routines found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routines.map((routine) => (
                <div key={routine.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{routine.name}</h3>
                    <p>{routine.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
