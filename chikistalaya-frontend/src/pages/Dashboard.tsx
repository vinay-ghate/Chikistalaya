import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/ui/Layout/SideBar";
import { Input } from "@/components/ui/input";
import DashboardMap from "../components/dashboard/DashboardMap";
import HealthMetrics from "../components/dashboard/HealthMetrics";
import { Bell, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAuth } from "firebase/auth";

interface HealthMetricsProps {
  blood_pressure?: string;
  weight?: number;
  height?: number;
  allergies?: string;
  blood_group?: string;
  heart_rate?: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [bmi, setBmi] = useState("Unavailable");
  const [metrics, setMetrics] = useState<HealthMetricsProps>({});


  const sessionUser = sessionStorage.getItem("authUser");
  const user = sessionUser
    ? JSON.parse(sessionUser)
    : { name: "Guest", email: "Not Available" };

  const handleProfileSelect = () => setShowOverlay((prev) => !prev);

  const fetchBMI = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No logged-in user");
        return;
      }
      const token = await currentUser.getIdToken();
      console.log(token);

      if (!token) {
        throw new Error("No token provided");
      }

      const response = await fetch("https://curo-156q.onrender.com/api/fetch-user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to fetch user data");

      const userData = result.records[0]; // Assuming a single user record

      // Extract height and weight to compute BMI
      const { height, weight } = userData;
      if (height && weight) {
        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        setBmi(bmiValue.toFixed(2));
      } else {
        setBmi("Unavailable");
      }

      // Update 'metrics' state with the fetched user data
      setMetrics({
        blood_pressure: userData.blood_pressure?.toString(),
        weight: userData.weight,
        height: userData.height,
        allergies: userData.allergies,
        blood_group: userData.blood_group,
        heart_rate: userData.heart_rate,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      overlayRef.current &&
      !overlayRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchBMI();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300">
              Welcome back,
              <span className="ml-1 font-semibold">{user.name}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Search Input */}
            <div className="relative">
              <Input type="search" placeholder="Search..." className="pl-10 w-64 border-purple-200 focus:border-purple-500 text-purple-900 placeholder:text-purple-400 bg-white/50" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Bell Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="bg-purple-600 !text-white hover:bg-purple-700"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Icon */}
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="bg-purple-600 !text-white hover:bg-purple-700"
              onClick={handleProfileSelect}
            >
              <User className="h-5 w-5" />
            </Button>
            {/* Overlay */}
            {showOverlay && (
              <div
                ref={overlayRef}
                className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-10"
              >
                <p className="text-gray-700 font-medium">Name: {user.name}</p>
                <p className="text-gray-700 font-medium">Email: {user.email}</p>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Small Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 col-span-2 bg-purple-900 border-purple-700 text-white">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-200">BMI</p>
                  <p className="font-semibold">{bmi}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Map */}
          <Card className="col-span-2 bg-purple-900 border-purple-700">
            <DashboardMap />
          </Card>

          {/* Metrics */}
          <Card className="p-6 col-span-2 bg-purple-900 border-purple-700 text-white">
            {/* Pass all the fetched user data as props */}
            <HealthMetrics
              blood_pressure={metrics.blood_pressure}
              weight={metrics.weight}
              height={metrics.height}
              allergies={metrics.allergies}
              blood_group={metrics.blood_group}
              heart_rate={metrics.heart_rate}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
