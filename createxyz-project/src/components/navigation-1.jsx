"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ userRole = null, userName = "", onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = {
    student: [
      { label: "Dashboard", href: "/dashboard", icon: "fa-columns" },
      { label: "My Courses", href: "/courses", icon: "fa-book" },
    ],
    instructor: [
      { label: "Dashboard", href: "/dashboard", icon: "fa-columns" },
      { label: "My Courses", href: "/courses", icon: "fa-book" },
      { label: "Instructor Panel", href: "/instructor", icon: "fa-chalkboard-teacher" },
    ],
    admin: [
      { label: "Dashboard", href: "/dashboard", icon: "fa-columns" },
      { label: "All Courses", href: "/courses", icon: "fa-book" },
      { label: "Instructor Panel", href: "/instructor", icon: "fa-chalkboard-teacher" },
      { label: "Admin Panel", href: "/admin", icon: "fa-cog" },
    ]
  };

  const currentNavItems = userRole ? navItems[userRole] : [];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <i className="fas fa-graduation-cap text-[#357AFF] text-2xl"></i>
              <span className="ml-2 text-xl font-semibold font-inter">LearnHub</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userRole ? (
              <>
                <div className="flex items-center space-x-4">
                  {currentNavItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter flex items-center"
                    >
                      <i className={`fas ${item.icon} mr-2`}></i>
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
                  <span className="text-gray-700 mr-4">{userName}</span>
                  <button
                    onClick={onSignOut}
                    className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/account/signin"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="px-4 py-2 rounded-md bg-[#357AFF] text-white hover:bg-blue-600 font-inter"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2">
            {userRole ? (
              <>
                {currentNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter"
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <span className="block px-3 py-2 text-gray-700">{userName}</span>
                  <button
                    onClick={onSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <a
                  href="/account/signin"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-inter"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="block px-3 py-2 rounded-md bg-[#357AFF] text-white hover:bg-blue-600 font-inter"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function StoryComponent() {
  const handleSignOut = () => {
    console.log("User signed out");
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8 p-8">
      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Not Signed In</h2>
        <MainComponent />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Student Navigation</h2>
        <MainComponent
          userRole="student"
          userName="John Student"
          onSignOut={handleSignOut}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Instructor Navigation</h2>
        <MainComponent
          userRole="instructor"
          userName="Dr. Jane Smith"
          onSignOut={handleSignOut}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter">Admin Navigation</h2>
        <MainComponent
          userRole="admin"
          userName="Admin User"
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  );
});
}