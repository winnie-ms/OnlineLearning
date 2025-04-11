"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ title, description, progress, instructor, imageUrl }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-[300px] transition-transform hover:scale-[1.02]">
      <div className="relative h-[160px] bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Course cover for ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <i className="fas fa-book text-4xl text-gray-400"></i>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-inter text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {instructor && (
          <p className="text-sm text-gray-600 mb-3">
            <i className="fas fa-user-tie mr-2"></i>
            {instructor}
          </p>
        )}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        {typeof progress === 'number' && (
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-800">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#357AFF] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Complete Course Card</h2>
        <MainComponent
          title="Introduction to Web Development"
          description="Learn the fundamentals of web development, including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to confident developer."
          progress={65}
          instructor="Dr. Jane Smith"
          imageUrl="/course-image.jpg"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Without Progress</h2>
        <MainComponent
          title="Python Programming Basics"
          description="Start your programming journey with Python. Perfect for beginners who want to learn one of the most popular programming languages."
          instructor="John Doe"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Minimal Information</h2>
        <MainComponent
          title="Data Structures and Algorithms"
          description="Master the fundamental concepts of data structures and algorithms."
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Long Title and Description</h2>
        <MainComponent
          title="Advanced Machine Learning and Artificial Intelligence: Deep Learning, Neural Networks, and More"
          description="This extensive course covers everything you need to know about machine learning and AI. From basic concepts to advanced implementations, you'll learn through practical examples and real-world applications. We'll cover neural networks, deep learning, reinforcement learning, and much more."
          progress={20}
          instructor="Dr. Alan Turing"
        />
      </div>
    </div>
  );
});
}