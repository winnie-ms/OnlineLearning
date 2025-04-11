"use client";
import React from "react";
import Navigation1 from "../../components/navigation-1";

function MainComponent() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/course-operations", {
          method: "POST",
          body: JSON.stringify({ type: "fetch" }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load featured courses");
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation1 userRole={user?.role} userName={user?.name} />

      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-inter mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Access quality education from expert instructors
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/account/signup"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </a>
                <a
                  href="/account/signin"
                  className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-inter text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600">
            Start your learning journey with our top courses
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-600 py-8">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                instructor={course.instructor_name}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All Courses
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>

      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <i className="fas fa-laptop-code text-4xl text-blue-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Learn Online</h3>
              <p className="text-gray-400">Access courses anytime, anywhere</p>
            </div>
            <div>
              <i className="fas fa-certificate text-4xl text-blue-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Get Certified</h3>
              <p className="text-gray-400">Earn certificates upon completion</p>
            </div>
            <div>
              <i className="fas fa-users text-4xl text-blue-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-400">Learn from industry professionals</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>© 2025 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;