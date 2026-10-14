import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "./services/api";
import { useAuth } from "./AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const { user, logout } = useAuth();

  const [type, setType] = useState("transport");
  const [activity, setActivity] = useState("bike");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("km");

  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [dateFilter,setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const unitOptions: Record<string, string> = {
    transport: "km",
    electricity: "kWh",
    food: "serving",
    travel: "km",
    shopping: "item",
    waste: "Kg",
  };

  const activityOptions: Record<string, string[]> = {
    transport: ["bike", "car", "bus", "train"],
    electricity: ["kwh"],
    food: ["veg", "nonveg"],
    travel: ["flight"],
    shopping: ["product"],
    waste: ["kg"],
  };
  const filteredActivities = activities.filter((item) => {
  const activityDate = new Date(item.date);
  const now = new Date();

  // Date filter
  if (dateFilter === "month") {
    if (
      activityDate.getMonth() !== now.getMonth() ||
      activityDate.getFullYear() !== now.getFullYear()
    ) {
      return false;
    }
  }

  if (dateFilter === "year") {
    if (activityDate.getFullYear() !== now.getFullYear()) {
      return false;
    }
  }

  // Category filter
  if (
    categoryFilter !== "all" &&
    item.type !== categoryFilter
  ) {
    return false;
  }

  // Search filter
  const search = searchTerm.trim().toLowerCase();

  if (search) {
    const matchesActivity = String(item.activity || "")
      .toLowerCase()
      .includes(search);

    const matchesCategory = String(item.type || "")
      .toLowerCase()
      .includes(search);

    if (!matchesActivity && !matchesCategory) {
      return false;
    }
  }

  return true;
});
const sortedActivities = [...filteredActivities].sort(
  (a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
);

  const totalCarbon = filteredActivities.reduce(
    (total, item) => total + Number(item.carbonEmission || 0),
    0
  );
  const categoryData = [
  { name: "Transport", type: "transport" },
  { name: "Electricity", type: "electricity" },
  { name: "Food", type: "food" },
  { name: "Travel", type: "travel" },
  { name: "Shopping", type: "shopping" },
  { name: "Waste", type: "waste" },
].map((category) => ({
  name: category.name,
  emissions: Number(
    filteredActivities
      .filter((item) => item.type === category.type)
      .reduce(
        (total, item) =>
          total + Number(item.carbonEmission || 0),
        0
      )
      .toFixed(2)
  ),
}));

  const ecoScore = Math.max(
    0,
    Math.round(100 - totalCarbon * 10)
  );
  const highestCategory = [...categoryData].sort(
  (a, b) => b.emissions - a.emissions
)[0];

const smartInsight =
  totalCarbon === 0
    ? "Add your first activity to receive a personalized eco insight."
    : highestCategory.emissions === 0
    ? "Great start! Keep recording activities to discover where you can reduce emissions."
    : `Your highest-emission category is ${highestCategory.name} (${highestCategory.emissions.toFixed(2)} kg CO₂e). Focus on reducing emissions in this category first.`;

  useEffect(() => {
    apiGet("/api/activities")
      .then((data) => {
        setActivities(data.data);
      })
      .catch((error) => {
        console.error("Failed to load activities:", error);
      });
  }, []);

  const calculateCarbon = async () => {
    const value = Number(quantity);

    if (!value || value <= 0) {
      setResult(null);
      setError("Please enter a quantity greater than 0.");
      return;
    }

    setError("");

    try {
      const data = await apiPost("/api/activities", {
        type,
        activity,
        quantity: value,
        unit,
      });

      setResult(data.data.carbonEmission);

      setActivities((previous) => [
        data.data,
        ...previous,
      ]);

      setQuantity("");
    } catch (error) {
  console.error("Carbon calculation failed:", error);
  setResult(null);

  setError(
    error instanceof Error
      ? error.message
      : "Unknown error occurred"
  );
}
  };

  const deleteActivity = async (id: string) => {
    try {
      await apiDelete(`/api/activities/${id}`);

      setActivities((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete Activity Error:", error);
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          🌱 EcoTrack
        </div>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#calculator">Calculator</a>
          <a href="#history">History</a>
        </nav>

        <button
          className="profile-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {/* DASHBOARD */}
      <main className="dashboard" id="dashboard">

        {/* HERO */}
        <section className="hero">

          <div>
            <div className="eyebrow">
              SMART CARBON TRACKING
            </div>

            <h1>
              Welcome back, {user?.name} 🌱
            </h1>

            <p className="hero-text">
              Track your daily activities, understand your
              carbon footprint and make smarter choices for
              a greener future.
            </p>

            <a
              href="#calculator"
              className="primary-btn"
              style={{
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              Calculate Carbon
            </a>
          </div>

          <div className="eco-score">
            <p>Eco Score</p>

            <strong>{ecoScore}</strong>

            <span>/100</span>

            <small>
              {ecoScore >= 80
                ? "Excellent 🌿"
                : ecoScore >= 50
                ? "Keep improving"
                : "Let's do better"}
            </small>
          </div>

        </section>

        {/* STATS */}
        {/* DATE FILTER */}
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
    marginBottom: "16px",
    flexWrap: "wrap",
  }}
>
  <label
    htmlFor="date-filter"
    style={{ fontWeight: 600, color: "#526158" }}
  >
    Filter Period:
  </label>

  <select
    id="date-filter"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    style={{
      padding: "10px 14px",
      border: "1px solid #dce5df",
      borderRadius: "10px",
      background: "#fff",
      minWidth: "160px",
    }}
  >
    <option value="all">All Time</option>
    <option value="month">This Month</option>
    <option value="year">This Year</option>
  </select>
</div>
        <section className="stats">

          <div className="card">
            <span>📊</span>
            <p>Total Activities</p>
            <h2>{activities.length}</h2>
            <small>Recorded activities</small>
          </div>

          <div className="card">
            <span>🌍</span>
            <p>Total CO₂</p>
            <h2>
              {totalCarbon.toFixed(2)}
            </h2>
            <small>kg CO₂e</small>
          </div>

          <div className="card">
            <span>🌱</span>
            <p>Eco Score</p>
            <h2>{ecoScore}/100</h2>
            <small>Your current score</small>
          </div>

          <div className="card">
            <span>♻️</span>
            <p>Categories</p>
            <h2>6</h2>
            <small>Activity categories</small>
          </div>

        </section>

        {/* CONTENT */}
        <section className="content-grid">
        {/* SMART INSIGHTS */}
<div
  className="panel"
  style={{
    gridColumn: "1 / -1",
    marginBottom: "22px",
    background: "#eef8f1",
    border: "1px solid #ccebd5",
  }}
>
  <h2>🌿 Smart Eco Insights</h2>

  <p
    style={{
      color: "#245c39",
      lineHeight: 1.7,
      marginBottom: 0,
    }}
  >
    {smartInsight}
  </p>
</div>
        {/* CARBON ANALYTICS CHART */}
<div
  className="panel"
  style={{
    gridColumn: "1 / -1",
    marginBottom: "22px",
  }}
>
  <h2>Carbon Emissions by Category</h2>

  <p>Your total carbon footprint across all categories.</p>

  <div style={{ width: "100%", height: 320 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="emissions"
          name="Carbon Emissions"
          fill="#16a34a"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

          {/* ACTIVITY HISTORY */}
          <div className="panel" id="history">

          <h2>Activity History</h2>

<p style={{ color: "#66736b", marginTop: "-8px" }}>
  Showing {filteredActivities.length} of {activities.length} activities
</p>
            
            <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    margin: "20px 0",
  }}
>
  <input
    type="text"
    placeholder="Search activities..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      border: "1px solid #dce5df",
      borderRadius: "10px",
    }}
  />

  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      border: "1px solid #dce5df",
      borderRadius: "10px",
      background: "#fff",
    }}
  >
    <option value="all">All Categories</option>
    <option value="transport">Transport</option>
    <option value="electricity">Electricity</option>
    <option value="food">Food</option>
    <option value="travel">Travel</option>
    <option value="shopping">Shopping</option>
    <option value="waste">Waste</option>
  </select>
</div>

            <p>
              Your recently recorded carbon activities.
            </p>

            {filteredActivities.length === 0 ? (
              <div className="chart-placeholder">
                No activities recorded yet.
              </div>
            ) : (
              <div>
                {sortedActivities.map((item) => (
                  <div
                    className="activity"
                    key={item._id}
                  >
                    <span>
                      {item.type === "transport"
                        ? "🚗"
                        : item.type === "electricity"
                        ? "⚡"
                        : item.type === "food"
                        ? "🍽️"
                        : item.type === "travel"
                        ? "✈️"
                        : item.type === "shopping"
                        ? "🛍️"
                        : "♻️"}
                    </span>

                    <div style={{ flex: 1 }}>
                      <strong
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {item.activity} —{" "}
                        {item.quantity} {item.unit}
                      </strong>

                      <small>
                        {new Date(
                          item.date
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                    </div>

                    <div
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <strong
                        style={{
                          color: "#208b52",
                        }}
                      >
                        {item.carbonEmission} kg
                      </strong>

                      <button
                        onClick={() =>
                          deleteActivity(item._id)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* CARBON CALCULATOR */}
          <div className="panel" id="calculator">

            <h2>Carbon Calculator</h2>

            <p>
              Add an activity to calculate your carbon footprint.
            </p>

            <label>Category</label>

            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value;

                setType(newType);
                setActivity(
                  activityOptions[newType][0]
                );
                setUnit(unitOptions[newType]);
              }}
              style={{
                width: "100%",
                padding: "11px",
                margin: "8px 0 16px",
                border: "1px solid #dce5df",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <option value="transport">
                Transport
              </option>
              <option value="electricity">
                Electricity
              </option>
              <option value="food">
                Food
              </option>
              <option value="travel">
                Travel
              </option>
              <option value="shopping">
                Shopping
              </option>
              <option value="waste">
                Waste
              </option>
            </select>

            <label>Activity</label>

            <select
              value={activity}
              onChange={(e) =>
                setActivity(e.target.value)
              }
              style={{
                width: "100%",
                padding: "11px",
                margin: "8px 0 16px",
                border: "1px solid #dce5df",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              {activityOptions[type].map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option
                      .charAt(0)
                      .toUpperCase() +
                      option.slice(1)}
                  </option>
                )
              )}
            </select>

            <label>Quantity</label>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              style={{
                width: "100%",
                padding: "11px",
                margin: "8px 0 16px",
                border: "1px solid #dce5df",
                borderRadius: "10px",
              }}
            />

            <label>Unit</label>

            <select
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              style={{
                width: "100%",
                padding: "11px",
                margin: "8px 0 16px",
                border: "1px solid #dce5df",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <option value={unit}>
                {unit}
              </option>
            </select>

            <button
              onClick={calculateCarbon}
              className="primary-btn"
              style={{
                width: "100%",
                marginTop: "5px",
              }}
            >
              Calculate CO₂
            </button>

            {error && (
              <p
                style={{
                  color: "#dc2626",
                  marginTop: "12px",
                  fontWeight: "600",
                }}
              >
                {error}
              </p>
            )}

            {result !== null && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  background: "#eef8f1",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <small>
                  Estimated carbon emission
                </small>

                <h2
                  style={{
                    margin: "8px 0 0",
                    color: "#208b52",
                  }}
                >
                  {result} kg CO₂e 🌱
                </h2>
              </div>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default App;