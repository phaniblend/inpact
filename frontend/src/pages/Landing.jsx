import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-inpact-bg">
      
      {/* NAVBAR */}
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left: Headline & CTA */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Build Skills by <span className="text-inpact-green">Doing Real Projects</span>
              </h1>
              
              <p className="text-xl text-inpact-gray mb-10 leading-relaxed">
                INPACT bridges the gap between learning and industry by letting you work on real-world systems — not toy tutorials.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/algorithms')}
                  className="px-8 py-4 bg-inpact-green text-black font-bold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  Start Learning
                </button>
                
                <button 
                  onClick={() => navigate('/coding')}
                  className="px-8 py-4 border-2 border-inpact-dark text-inpact-dark font-semibold rounded-full hover:bg-inpact-dark hover:text-white transition-all duration-200"
                >
                  Explore Projects
                </button>
              </div>
            </div>
            
            {/* Right: Terminal Box */}
            <div className="bg-inpact-dark rounded-2xl p-8 shadow-card">
              <pre className="text-inpact-green font-mono text-sm leading-relaxed">
{`ERP-Lite
├─ Auth
├─ Orders
├─ Inventory
├─ Invoices
└─ Analytics`}
              </pre>
            </div>
            
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How INPACT Works</h2>
            <p className="text-xl text-inpact-gray">Learn exactly how real software is built in the industry.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-inpact-bg rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Learn Concepts</h3>
              <p className="text-inpact-gray">Understand real architecture, not just syntax.</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-inpact-bg rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Build Features</h3>
              <p className="text-inpact-gray">Implement features from real specs.</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-inpact-bg rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Get Reviewed</h3>
              <p className="text-inpact-gray">AI + human feedback like a real job.</p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-inpact-bg rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="w-14 h-14 bg-inpact-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold mb-3">Get Visible</h3>
              <p className="text-inpact-gray">Public proof recruiters can trust.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* REAL INDUSTRY PROJECTS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Real Industry Projects</h2>
            <p className="text-xl text-inpact-gray">Structured, production-style systems.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            
            {['ERP-Lite', 'CRM-Lite', 'WMS-Lite', 'HRMS-Lite', 'Demand-Lite'].map((project) => (
              <div key={project} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200">
                <h4 className="text-lg font-bold mb-2">{project}</h4>
                <p className="text-sm text-inpact-gray">
                  {project === 'ERP-Lite' && 'Orders, billing, inventory.'}
                  {project === 'CRM-Lite' && 'Leads, pipelines, customers.'}
                  {project === 'WMS-Lite' && 'Warehouse & logistics.'}
                  {project === 'HRMS-Lite' && 'Hiring, payroll, reviews.'}
                  {project === 'Demand-Lite' && 'Forecasting & planning.'}
                </p>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Who Is This For?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Learners */}
            <div className="bg-inpact-bg rounded-2xl p-10 shadow-card">
              <h3 className="text-2xl font-bold mb-4">Learners</h3>
              <p className="text-lg text-inpact-gray">
                Gain experience before your first job.
              </p>
            </div>
            
            {/* Mentors */}
            <div className="bg-inpact-bg rounded-2xl p-10 shadow-card">
              <h3 className="text-2xl font-bold mb-4">Mentors</h3>
              <p className="text-lg text-inpact-gray">
                Guide real projects, not theory.
              </p>
            </div>
            
            {/* Employers */}
            <div className="bg-inpact-bg rounded-2xl p-10 shadow-card">
              <h3 className="text-2xl font-bold mb-4">Employers</h3>
              <p className="text-lg text-inpact-gray">
                Hire based on proof, not resumes.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-inpact-dark text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">© 2025 INPACT — Build skills by doing real work.</p>
        </div>
      </footer>

    </div>
  );
}