import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Briefcase, Building, Globe, 
  Target, Rocket, CheckCircle2, ChevronRight, 
  ChevronLeft, Save, Database, Clock, Bot,
  LayoutGrid, Trash2
} from 'lucide-react';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState('Not yet');
  const [formData, setFormData] = useState({
    fullName: '', email: '', role: '',
    brandName: '', industry: '', tagline: '',
    targetAudience: '', mainCompetitor: '',
    strategicGoal: ''
  });
  const [errors, setErrors] = useState({});

  // --- Auto-Save & Restore Logic ---
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_draft');
    if (savedData) {
      const { data, step, time } = JSON.parse(savedData);
      setFormData(data);
      setCurrentStep(step);
      setLastSaved(time);
    }
  }, []);

  const saveDraft = (silent = false) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('onboarding_draft', JSON.stringify({
      data: formData,
      step: currentStep,
      time: time
    }));
    setLastSaved(time);
    if (!silent) alert("Progress Saved!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // --- Navigation ---
  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 0) {
      if (!formData.fullName) newErrors.fullName = "Required";
      if (!formData.email) newErrors.email = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      saveDraft(true);
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const steps = [
    { id: 1, name: 'Profile', desc: 'TELL US WHO YOU ARE' },
    { id: 2, name: 'Brand Identity', desc: "WHAT'S YOUR BUSINESS CALLED?" },
    { id: 3, name: 'Strategic Context', desc: 'WHO ARE YOUR RIVALS?' },
    { id: 4, name: 'Goals & Review', desc: 'CONFIRM AND FINISH' }
  ];

  return (
    <div className="onboarding-terminal">
      {/* --- HEADER --- */}
      <header className="terminal-header">
        <div className="terminal-brand">
          <div className="terminal-logo">
            <Bot size={24} color="white" />
          </div>
          <div>
            <h1>CLIENT ONBOARDING</h1>
            <p>Strategic Brand Analyst Terminal v1.0</p>
          </div>
        </div>
        <div className="header-meta">
          <div className="meta-item">
            <Clock size={16} /> <span>PERSISTENCE ACTIVE</span>
          </div>
          <div className="meta-item">
            <Database size={16} /> <span>SQLITE SECURED</span>
          </div>
        </div>
      </header>

      <main className="terminal-content">
        {/* --- SIDEBAR STEPS --- */}
        <aside className="steps-sidebar">
          <div className="sidebar-label">
            <div className="blue-dot"></div> STEPS
          </div>
          <div className="steps-list">
            {steps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`step-item ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {idx < currentStep ? <CheckCircle2 size={18} /> : step.id}
                </div>
                <div className="step-info">
                  <h3>{step.name}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* --- MAIN FORM PANEL --- */}
        <section className="form-panel">
          <div className="panel-header">
            <div className="step-pill">
              <div className="inner-dot"></div> STEP {currentStep + 1} / 4
            </div>
            <div className="panel-title">
              <h2>{steps[currentStep].name}</h2>
              <p>Tell us a bit about your brand journey.</p>
            </div>
            <div className="progress-container">
               <span className="progress-label">PROGRESS</span>
               <div className="progress-bar">
                 <div className="progress-fill" style={{ width: `${(currentStep + 1) * 25}%` }}></div>
               </div>
            </div>
          </div>

          <div className="form-body">
            {currentStep === 0 && (
              <div className="step-grid">
                <div className="input-group">
                  <label>FULL NAME</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Ashish Ranjan" />
                  </div>
                </div>
                <div className="input-group">
                  <label>WORK EMAIL</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input name="email" value={formData.email} onChange={handleInputChange} placeholder="ash@brandanalyst.com" />
                  </div>
                </div>
                <div className="input-group full-width">
                  <label>PRIMARY ROLE</label>
                  <div className="input-wrapper">
                    <Briefcase size={18} />
                    <select name="role" value={formData.role} onChange={handleInputChange}>
                      <option value="">Select Role</option>
                      <option value="founder">Founder / CEO</option>
                      <option value="marketing">Marketing Lead</option>
                      <option value="analyst">Brand Analyst</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="step-grid">
                <div className="input-group">
                  <label>BRAND NAME</label>
                  <div className="input-wrapper">
                    <Building size={18} />
                    <input name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. ZenFoods" />
                  </div>
                </div>
                <div className="input-group">
                  <label>INDUSTRY</label>
                  <div className="input-wrapper">
                    <LayoutGrid size={18} />
                    <select name="industry" value={formData.industry} onChange={handleInputChange}>
                      <option value="">Select Industry</option>
                      <option value="tech">Technology</option>
                      <option value="fmcg">FMCG</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>
                </div>
                <div className="input-group full-width">
                  <label>BRAND TAGLINE / MISSION</label>
                  <div className="input-wrapper">
                    <Rocket size={18} />
                    <textarea name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="The simplest way to automate your brand analysis." />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-grid">
                <div className="input-group">
                  <label>TARGET AUDIENCE</label>
                  <div className="input-wrapper">
                    <Target size={18} />
                    <input name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="e.g. Gen Z Entrepreneurs" />
                  </div>
                </div>
                <div className="input-group">
                  <label>MAIN COMPETITOR</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input name="mainCompetitor" value={formData.mainCompetitor} onChange={handleInputChange} placeholder="e.g. CompetitorX" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="review-step">
                <div className="input-group full-width">
                  <label>STRATEGIC GOAL</label>
                  <div className="input-wrapper">
                    <Target size={18} />
                    <textarea name="strategicGoal" value={formData.strategicGoal} onChange={handleInputChange} placeholder="e.g. Increase market share by 15%..." />
                  </div>
                </div>
                <div className="review-summary-cards">
                  <div className="summary-card">
                    <span className="label">PROFILE</span>
                    <span className="val">{formData.fullName || '---'}</span>
                  </div>
                  <div className="summary-card">
                    <span className="label">BRAND</span>
                    <span className="val">{formData.brandName || '---'}</span>
                  </div>
                  <div className="summary-card">
                    <span className="label">INDUSTRY</span>
                    <span className="val">{formData.industry || '---'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="panel-footer">
            <button className="btn-back" onClick={prevStep} disabled={currentStep === 0}>
              <ChevronLeft size={18} /> Back
            </button>
            <div className="footer-right">
              <button className="btn-save" onClick={() => saveDraft()}>
                <Save size={18} /> Save Draft
              </button>
              <button className="btn-next" onClick={nextStep}>
                {currentStep === 3 ? 'Finish' : 'Next Step'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OnboardingPage;
