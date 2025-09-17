import { useState } from 'react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'editor'
  const [pages, setPages] = useState([])
  const [currentPageId, setCurrentPageId] = useState(null)
  const [previewScreen, setPreviewScreen] = useState('form') // 'form', 'loading', 'success'
  const [showForm, setShowForm] = useState(false) // For sliding form animation
  const [backdropFading, setBackdropFading] = useState(false) // For backdrop fade animation
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved', 'saving', 'unsaved'


  const handleBackdropClose = () => {
    if (!backdropFading) { // Prevent multiple clicks during animation
      setBackdropFading(true)
      setShowForm(false) // Start slider animation immediately
      setTimeout(() => {
        setBackdropFading(false)
      }, 400) // Remove backdrop after fade completes
    }
  }

  const getDefaultConfig = () => ({
    branding: {
      logoUrl: '',
      primaryColor: '#6366f1',
      secondaryColor: '#f3f4f6',
      buttonColor: '#6366f1',
      fontFamily: 'Arial',
      backgroundImage: '',
      backgroundColor: '#6b7280',
      descriptionColor: '#6b7280',
      checkboxTextColor: '#ffffff',
      titleFontSize: '1.4rem',
      ctaFontSize: '1.05rem',
      sliderBackgroundColor: '#171717',
      sliderTextColor: '#ffffff',
    },
    content: {
      poapImage: '',
      poapTitle: 'POAP Event Title',
      poapDescription: 'Claim your proof of attendance for this amazing event!',
      claimButtonText: 'I want this',
      loadingText: 'We are now taking you to your collectible page...',
      congratsTitle: 'CONGRATULATIONS!',
      congratsSubtitle: 'You have just collected:',
      confirmationText: 'Successfully claimed!',
      finalCtaText: 'Continue',
      finalCtaLink: '',
      successTitle: 'POAP Claimed Successfully!',
      successMessage: 'Your POAP has been added to your collection.',
      congratulationsTitle: 'Congratulations!',
      successCtaText: 'View POAP',
      footerText: 'Terms & Conditions | Privacy Policy',
    },
    settings: {
      claimMethod: 'both', // 'wallet', 'email', 'both'
      customFields: [],
      consentEnabled: false,
      consentText: 'I consent to data collection',
    }
  })

  const getCurrentConfig = () => {
    const currentPage = pages.find(page => page.id === currentPageId)
    return currentPage ? currentPage.config : getDefaultConfig()
  }

  const handleConfigChange = (section, field, value) => {
    setSaveStatus('unsaved')
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            config: {
              ...page.config,
              [section]: {
                ...page.config[section],
                [field]: value
              }
            }
          }
        : page
    ))
  }

  const savePage = () => {
    setSaveStatus('saving')
    // Simulate save delay for better UX
    setTimeout(() => {
      const currentPage = pages.find(page => page.id === currentPageId)
      if (currentPage) {
        setPages(prev => prev.map(page =>
          page.id === currentPageId 
            ? { ...page, lastSaved: new Date().toISOString() }
            : page
        ))
      }
      setSaveStatus('saved')
    }, 500)
  }

  const createNewPage = () => {
    const newPage = {
      id: Date.now(),
      name: `POAP Page ${pages.length + 1}`,
      createdAt: new Date().toISOString(),
      config: getDefaultConfig()
    }
    setPages(prev => [...prev, newPage])
    setCurrentPageId(newPage.id)
    setCurrentView('editor')
    setSaveStatus('unsaved')
  }

  const editPage = (pageId) => {
    setCurrentPageId(pageId)
    setCurrentView('editor')
    setSaveStatus('saved')
  }

  const deletePage = (pageId) => {
    setPages(prev => prev.filter(page => page.id !== pageId))
    if (currentPageId === pageId) {
      setCurrentPageId(null)
      setCurrentView('dashboard')
    }
  }

  // const updatePageName = (pageId, newName) => {
  //   setPages(prev => prev.map(page =>
  //     page.id === pageId ? { ...page, name: newName } : page
  //   ))
  // }

  const backToDashboard = () => {
    setCurrentView('dashboard')
    setCurrentPageId(null)
  }

  const handleImageUpload = (section, field, event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleConfigChange(section, field, e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCustomField = () => {
    setSaveStatus('unsaved')
    const newField = {
      id: Date.now(),
      placeholder: 'New field',
      mandatory: false,
      type: 'text'
    }
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            config: {
              ...page.config,
              settings: {
                ...page.config.settings,
                customFields: [...page.config.settings.customFields, newField]
              }
            }
          }
        : page
    ))
  }

  const updateCustomField = (fieldId, property, value) => {
    setSaveStatus('unsaved')
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            config: {
              ...page.config,
              settings: {
                ...page.config.settings,
                customFields: page.config.settings.customFields.map(field =>
                  field.id === fieldId ? { ...field, [property]: value } : field
                )
              }
            }
          }
        : page
    ))
  }

  const removeCustomField = (fieldId) => {
    setSaveStatus('unsaved')
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            config: {
              ...page.config,
              settings: {
                ...page.config.settings,
                customFields: page.config.settings.customFields.filter(field => field.id !== fieldId)
              }
            }
          }
        : page
    ))
  }


  const config = getCurrentConfig()

  if (currentView === 'dashboard') {
    return (
      <div className="app">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>POAP Mint Page Dashboard</h1>
            <button 
              onClick={createNewPage}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Create New Page
            </button>
          </div>

          <div className="pages-grid">
            {pages.length === 0 ? (
              <div className="empty-state">
                <h3>No POAP pages created yet</h3>
                <p>Create your first branded POAP mint page to get started.</p>
                <button 
                  onClick={createNewPage}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Create Your First Page
                </button>
              </div>
            ) : (
              pages.map(page => (
                <div key={page.id} className="page-card">
                  <div className="page-card-preview">
                    <div className="mini-mobile-frame">
                      <div 
                        className="mini-mobile-preview"
                        style={{
                          fontFamily: page.config.branding.fontFamily,
                          backgroundImage: page.config.branding.backgroundImage ? `url(${page.config.branding.backgroundImage})` : 'none',
                          backgroundColor: page.config.branding.backgroundImage ? 'transparent' : page.config.branding.backgroundColor,
                        }}
                      >
                        <div className="mini-preview-header">
                          {page.config.branding.logoUrl && (
                            <img src={page.config.branding.logoUrl} alt="Logo" className="mini-preview-logo" />
                          )}
                        </div>

                        <div className="mini-floating-card">
                          {page.config.content.poapImage && (
                            <img src={page.config.content.poapImage} alt="POAP" className="mini-poap-image" />
                          )}
                          <h2 className="mini-title" style={{ color: page.config.branding.primaryColor, fontSize: `calc(${page.config.branding.titleFontSize} * 0.3)` }}>
                            {page.config.content.poapTitle}
                          </h2>
                        </div>

                        <button 
                          className="mini-cta-button"
                          style={{ 
                            backgroundColor: page.config.branding.buttonColor,
                            color: page.config.branding.checkboxTextColor,
                            fontSize: `calc(${page.config.branding.ctaFontSize} * 0.35)`
                          }}
                        >
                          {page.config.content.claimButtonText}
                        </button>

                        {/* Mini sliding container peek */}
                        <div className="mini-sliding-peek">
                          <p className="mini-peek-hint">scroll to see more</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="page-card-content">
                    <div className="page-card-header">
                      <h3>{page.name}</h3>
                      <div className="page-actions">
                        <button 
                          onClick={() => editPage(page.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginRight: '0.5rem'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
                              deletePage(page.id)
                            }
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="page-card-info">
                      <p><strong>POAP Title:</strong> {page.config.content.poapTitle}</p>
                      <p><strong>Created:</strong> {new Date(page.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // const getSaveButtonStyle = () => {
  //   const baseStyle = {
  //     padding: '0.5rem 1.5rem',
  //     border: 'none',
  //     borderRadius: '6px',
  //     fontSize: '0.875rem',
  //     fontWeight: '600',
  //     cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
  //     transition: 'all 0.2s ease'
  //   }

  //   switch (saveStatus) {
  //     case 'saved':
  //       return { ...baseStyle, backgroundColor: '#10b981', color: 'white' }
  //     case 'saving':
  //       return { ...baseStyle, backgroundColor: '#6b7280', color: 'white' }
  //     case 'unsaved':
  //       return { ...baseStyle, backgroundColor: '#f59e0b', color: 'white' }
  //     default:
  //       return { ...baseStyle, backgroundColor: '#6366f1', color: 'white' }
  //   }
  // }

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saved':
        return '✓ Saved'
      case 'saving':
        return 'Saving...'
      case 'unsaved':
        return 'Save Changes'
      default:
        return 'Save'
    }
  }

  return (
    <div className="app">
      <div className="builder-container">
        {/* Admin Form */}
        <div className="admin-panel-new">
          <div className="admin-header">
            <div className="header-content">
              <h1>POAP Mint Page Builder</h1>
              <p className="header-subtitle">Design and customize your POAP collection page!</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={backToDashboard}
                className="btn-secondary"
              >
                ← Back to Dashboard
              </button>
              
              <button 
                onClick={savePage}
                disabled={saveStatus === 'saving'}
                className={`btn-primary ${saveStatus}`}
              >
                {getSaveButtonText()}
              </button>
              
              {saveStatus === 'saved' && (
                <span className="save-indicator">
                  ✓ All changes saved
                </span>
              )}
            </div>
          </div>

          <div className="admin-content">
            <div className="config-grid">
              
              {/* Media & Assets */}
              <div className="config-card">
                <div className="card-header">
                  <h3>🖼️ Media & Assets</h3>
                  <p>Upload images and logos for your POAP page</p>
                </div>
                <div className="card-content">
                  <div className="media-grid">
                    <div className="media-upload">
                      <label className="upload-label">Brand Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('branding', 'logoUrl', e)}
                        className="file-input"
                      />
                      {config.branding.logoUrl && (
                        <div className="preview-thumb">
                          <img src={config.branding.logoUrl} alt="Logo preview" />
                          <button 
                            type="button"
                            onClick={() => handleConfigChange('branding', 'logoUrl', '')}
                            className="delete-image-btn"
                            title="Delete logo"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="media-upload">
                      <label className="upload-label">POAP Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('content', 'poapImage', e)}
                        className="file-input"
                      />
                      {config.content.poapImage && (
                        <div className="preview-thumb">
                          <img src={config.content.poapImage} alt="POAP preview" />
                          <button 
                            type="button"
                            onClick={() => handleConfigChange('content', 'poapImage', '')}
                            className="delete-image-btn"
                            title="Delete POAP image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="media-upload">
                      <label className="upload-label">Background Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('branding', 'backgroundImage', e)}
                        className="file-input"
                      />
                      {config.branding.backgroundImage && (
                        <div className="preview-thumb">
                          <img src={config.branding.backgroundImage} alt="Background preview" />
                          <button 
                            type="button"
                            onClick={() => handleConfigChange('branding', 'backgroundImage', '')}
                            className="delete-image-btn"
                            title="Delete background image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="config-card">
                <div className="card-header">
                  <h3>📝 Content</h3>
                  <p>Customize text and messaging</p>
                </div>
                <div className="card-content">
                  <div className="input-group">
                    <label className="input-label">POAP Title</label>
                    <input
                      type="text"
                      value={config.content.poapTitle}
                      onChange={(e) => handleConfigChange('content', 'poapTitle', e.target.value)}
                      className="text-input"
                      placeholder="Enter your POAP title"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Description</label>
                    <textarea
                      value={config.content.poapDescription}
                      onChange={(e) => handleConfigChange('content', 'poapDescription', e.target.value)}
                      className="textarea-input"
                      rows="3"
                      placeholder="Describe your event or POAP"
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Claim Button Text</label>
                      <input
                        type="text"
                        value={config.content.claimButtonText}
                        onChange={(e) => handleConfigChange('content', 'claimButtonText', e.target.value)}
                        className="text-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Loading Text</label>
                      <input
                        type="text"
                        value={config.content.loadingText}
                        onChange={(e) => handleConfigChange('content', 'loadingText', e.target.value)}
                        className="text-input"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Congratulations Title</label>
                      <input
                        type="text"
                        value={config.content.congratulationsTitle}
                        onChange={(e) => handleConfigChange('content', 'congratulationsTitle', e.target.value)}
                        className="text-input"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Success CTA Text</label>
                      <input
                        type="text"
                        value={config.content.successCtaText}
                        onChange={(e) => handleConfigChange('content', 'successCtaText', e.target.value)}
                        className="text-input"
                      />
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Congratulations Title</label>
                      <input
                        type="text"
                        value={config.content.congratsTitle}
                        onChange={(e) => handleConfigChange('content', 'congratsTitle', e.target.value)}
                        className="text-input"
                        placeholder="CONGRATULATIONS!"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Congratulations Subtitle</label>
                      <input
                        type="text"
                        value={config.content.congratsSubtitle}
                        onChange={(e) => handleConfigChange('content', 'congratsSubtitle', e.target.value)}
                        className="text-input"
                        placeholder="You have just collected:"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Success Page Title</label>
                    <input
                      type="text"
                      value={config.content.successTitle}
                      onChange={(e) => handleConfigChange('content', 'successTitle', e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Success Message</label>
                    <textarea
                      value={config.content.successMessage}
                      onChange={(e) => handleConfigChange('content', 'successMessage', e.target.value)}
                      className="textarea-input"
                      rows="2"
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Final CTA Text</label>
                      <input
                        type="text"
                        value={config.content.finalCtaText}
                        onChange={(e) => handleConfigChange('content', 'finalCtaText', e.target.value)}
                        className="text-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Final CTA Link</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={config.content.finalCtaLink}
                        onChange={(e) => handleConfigChange('content', 'finalCtaLink', e.target.value)}
                        className="text-input"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Footer Text</label>
                    <input
                      type="text"
                      value={config.content.footerText}
                      onChange={(e) => handleConfigChange('content', 'footerText', e.target.value)}
                      className="text-input"
                      placeholder="Terms & Conditions | Privacy Policy"
                    />
                  </div>
                </div>
              </div>

              {/* Design & Styling */}
              <div className="config-card">
                <div className="card-header">
                  <h3>🎨 Design & Styling</h3>
                  <p>Customize colors and typography</p>
                </div>
                <div className="card-content">
                  <div className="color-grid">
                    <div className="color-input-group">
                      <label className="color-label">Background</label>
                      <input
                        type="color"
                        value={config.branding.backgroundColor}
                        onChange={(e) => handleConfigChange('branding', 'backgroundColor', e.target.value)}
                        className="color-input"
                      />
                    </div>

                    <div className="color-input-group">
                      <label className="color-label">Title Color</label>
                      <input
                        type="color"
                        value={config.branding.primaryColor}
                        onChange={(e) => handleConfigChange('branding', 'primaryColor', e.target.value)}
                        className="color-input"
                      />
                    </div>

                    <div className="color-input-group">
                      <label className="color-label">CTA Color</label>
                      <input
                        type="color"
                        value={config.branding.buttonColor}
                        onChange={(e) => handleConfigChange('branding', 'buttonColor', e.target.value)}
                        className="color-input"
                      />
                    </div>

                    <div className="color-input-group">
                      <label className="color-label">CTA Text Color</label>
                      <input
                        type="color"
                        value={config.branding.checkboxTextColor}
                        onChange={(e) => handleConfigChange('branding', 'checkboxTextColor', e.target.value)}
                        className="color-input"
                      />
                    </div>

                    <div className="color-input-group">
                      <label className="color-label">Slider Background</label>
                      <input
                        type="color"
                        value={config.branding.sliderBackgroundColor}
                        onChange={(e) => handleConfigChange('branding', 'sliderBackgroundColor', e.target.value)}
                        className="color-input"
                      />
                    </div>

                    <div className="color-input-group">
                      <label className="color-label">Slider Text</label>
                      <input
                        type="color"
                        value={config.branding.sliderTextColor}
                        onChange={(e) => handleConfigChange('branding', 'sliderTextColor', e.target.value)}
                        className="color-input"
                      />
                    </div>
                  </div>

                  <div className="typography-section">
                    <div className="input-row">
                      <div className="input-group">
                        <label className="input-label">Font Family</label>
                        <select
                          value={config.branding.fontFamily}
                          onChange={(e) => handleConfigChange('branding', 'fontFamily', e.target.value)}
                          className="select-input"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Inter">Inter</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">Times New Roman</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Title Size</label>
                        <select
                          value={config.branding.titleFontSize}
                          onChange={(e) => handleConfigChange('branding', 'titleFontSize', e.target.value)}
                          className="select-input"
                        >
                          <option value="1.0rem">Small</option>
                          <option value="1.2rem">Medium Small</option>
                          <option value="1.4rem">Medium</option>
                          <option value="1.6rem">Medium Large</option>
                          <option value="1.8rem">Large</option>
                          <option value="2.0rem">Extra Large</option>
                          <option value="2.4rem">XXL</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="input-label">Button Size</label>
                        <select
                          value={config.branding.ctaFontSize}
                          onChange={(e) => handleConfigChange('branding', 'ctaFontSize', e.target.value)}
                          className="select-input"
                        >
                          <option value="0.875rem">Small</option>
                          <option value="1.0rem">Medium</option>
                          <option value="1.05rem">Medium Large</option>
                          <option value="1.125rem">Large</option>
                          <option value="1.25rem">Extra Large</option>
                          <option value="1.5rem">XXL</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Settings */}
              <div className="config-card">
                <div className="card-header">
                  <h3>⚙️ Form Settings</h3>
                  <p>Configure collection methods and fields</p>
                </div>
                <div className="card-content">
                  <div className="input-group">
                    <label className="input-label">Claim Method</label>
                    <select
                      value={config.settings.claimMethod}
                      onChange={(e) => handleConfigChange('settings', 'claimMethod', e.target.value)}
                      className="select-input"
                    >
                      <option value="wallet">Wallet Only</option>
                      <option value="email">Email Only</option>
                      <option value="both">Both Wallet & Email</option>
                    </select>
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.settings.consentEnabled}
                        onChange={(e) => handleConfigChange('settings', 'consentEnabled', e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Enable Consent Checkbox</span>
                    </label>
                  </div>

                  {config.settings.consentEnabled && (
                    <div className="input-group">
                      <label className="input-label">Consent Text</label>
                      <input
                        type="text"
                        value={config.settings.consentText}
                        onChange={(e) => handleConfigChange('settings', 'consentText', e.target.value)}
                        className="text-input"
                      />
                    </div>
                  )}

                  <div className="custom-fields-section">
                    <div className="section-header">
                      <label className="input-label">Custom Fields</label>
                      <button 
                        type="button"
                        onClick={addCustomField}
                        className="btn-add-field"
                      >
                        + Add Field
                      </button>
                    </div>
                    
                    {config.settings.customFields.map((field, index) => (
                      <div key={field.id} className="custom-field-card">
                        <div className="field-header">
                          <span className="field-title">Field {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeCustomField(field.id)}
                            className="btn-remove-field"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="field-content">
                          <div className="input-group">
                            <label className="field-label">Placeholder Text</label>
                            <input
                              type="text"
                              value={field.placeholder}
                              onChange={(e) => updateCustomField(field.id, 'placeholder', e.target.value)}
                              className="field-input"
                            />
                          </div>
                          
                          <div className="checkbox-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={field.mandatory}
                                onChange={(e) => updateCustomField(field.id, 'mandatory', e.target.checked)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-text">Required Field</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="preview-panel">
          {/* Screen Navigation */}
          <div className="screen-navigation">
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${previewScreen === 'form' ? 'active' : ''}`}
                onClick={() => setPreviewScreen('form')}
              >
                <span className="tab-icon">📝</span>
                <span className="tab-label">Form</span>
              </button>
              <button 
                className={`nav-tab ${previewScreen === 'loading' ? 'active' : ''}`}
                onClick={() => setPreviewScreen('loading')}
              >
                <span className="tab-icon">⏳</span>
                <span className="tab-label">Loading</span>
              </button>
              <button 
                className={`nav-tab ${previewScreen === 'success' ? 'active' : ''}`}
                onClick={() => setPreviewScreen('success')}
              >
                <span className="tab-icon">✅</span>
                <span className="tab-label">Success</span>
              </button>
            </div>
          </div>

          {/* Single Screen Preview */}
          <div className="single-screen-container">
            <div className="mobile-frame">
              <div 
                className="mobile-preview"
                style={{
                  fontFamily: config.branding.fontFamily,
                  backgroundImage: config.branding.backgroundImage ? `url(${config.branding.backgroundImage})` : 'none',
                  backgroundColor: config.branding.backgroundImage ? 'transparent' : config.branding.backgroundColor,
                }}
              >

                {/* Form Screen Content - Exact Figma Clone */}
                {previewScreen === 'form' && (
                  <>
                    {/* Status Bar Space */}
                    <div className="figma-status-space"></div>
                    
                    {/* Top Section - Exact Figma Layout */}
                    <div className="figma-top-section">
                      {/* Logo */}
                      {config.branding.logoUrl ? (
                        <div className="figma-logo">
                          <img src={config.branding.logoUrl} alt="Logo" className="figma-logo-img" />
                        </div>
                      ) : (
                        <div className="figma-logo">
                          <div style={{width: 150, height: 35, borderRadius: 8, background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                            <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500}}>LOGO</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Card Container */}
                      <div className="figma-card-wrapper">
                        <div style={{width: '100%', height: '100%', position: 'relative'}}>
                          <div style={{width: 303, height: 396, left: 0, top: 0, position: 'absolute', background: 'rgba(255, 255, 255, 0.05)', boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.10)', borderRadius: 16, border: '1px white solid', backdropFilter: 'blur(0px)'}} />
                          <div style={{width: 295, height: 388, left: 4, top: 4, position: 'absolute', background: 'linear-gradient(134deg, rgba(255, 255, 255, 0.20) 11%, rgba(255, 255, 255, 0.01) 28%, rgba(255, 255, 255, 0.01) 62%, rgba(255, 255, 255, 0.20) 83%)', borderRadius: 12, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: '-1px', backdropFilter: 'blur(25px)'}}>
                            <div style={{width: 295, height: 388, left: 0, top: 0, position: 'absolute', display: 'flex', flexDirection: 'column'}}>
                              <div style={{height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20}}>
                                {config.content.poapImage ? (
                                  <img style={{width: 200, height: 200, borderRadius: '50%', objectFit: 'cover'}} src={config.content.poapImage} alt="POAP" />
                                ) : (
                                  <div style={{width: 200, height: 200, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12}}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="9" cy="9" r="2"/>
                                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg>
                                    <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, fontWeight: 500}}>POAP Image</span>
                                  </div>
                                )}
                              </div>
                              <div style={{height: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px'}}>
                                <h3 style={{margin: 0, textAlign: 'center', color: config.branding.primaryColor, fontSize: config.branding.titleFontSize, fontFamily: 'Arial', fontWeight: '600'}}>
                                  {config.content.poapTitle}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <button 
                        className="figma-cta-button"
                        style={{ 
                          backgroundColor: config.branding.buttonColor,
                          color: config.branding.checkboxTextColor
                        }}
                        onClick={() => setShowForm(!showForm)}
                      >
                        {config.content.claimButtonText}
                      </button>
                    </div>

                    {/* Backdrop Overlay */}
                    {(showForm || backdropFading) && (
                      <div 
                        className={`figma-backdrop ${backdropFading ? 'fade-out' : ''}`}
                        onClick={handleBackdropClose}
                      />
                    )}

                    {/* Bottom Section - Scrollable Text */}
                    <div 
                      className={`figma-bottom-section ${showForm ? 'expanded' : ''}`}
                      style={{ background: config.branding.sliderBackgroundColor }}
                    >
                      <div className="figma-bottom-content">
                        {/* Scroll Hint */}
                        {!showForm && (
                          <div className="figma-scroll-hint">
                            <span className="figma-arrow" style={{ color: config.branding.sliderTextColor }}>↓</span>
                            <span className="figma-scroll-text" style={{ color: config.branding.sliderTextColor }}>Scroll to see more</span>
                            <span className="figma-arrow" style={{ color: config.branding.sliderTextColor }}>↓</span>
                          </div>
                        )}
                        
                        {/* Title and Details */}
                        <div className="figma-text-section">
                          <div className="figma-title-details">
                            <h2 className="figma-details-title" style={{ color: config.branding.sliderTextColor }}>{config.content.poapTitle}</h2>
                            <div className="figma-details-divider" style={{ background: config.branding.sliderTextColor }}></div>
                          </div>
                          
                          <p className="figma-description" style={{ color: config.branding.sliderTextColor }}>
                            {config.content.poapDescription}
                          </p>
                        </div>
                        
                        {/* Form Fields */}
                        {showForm && (
                          <div className="figma-form-fields">
                            {/* Claim Method Fields */}
                            {(config.settings.claimMethod === 'wallet' || config.settings.claimMethod === 'both') && (
                              <div className="figma-field">
                                <input 
                                  type="text" 
                                  className="figma-field-input" 
                                  placeholder="Enter your wallet address"
                                />
                              </div>
                            )}
                            
                            {(config.settings.claimMethod === 'email' || config.settings.claimMethod === 'both') && (
                              <div className="figma-field">
                                <input 
                                  type="email" 
                                  className="figma-field-input" 
                                  placeholder="Enter your email address"
                                />
                              </div>
                            )}
                            
                            {/* Custom Fields */}
                            {config.settings.customFields.map((field) => (
                              <div key={field.id} className="figma-field">
                                {field.type === 'text' && (
                                  <input 
                                    type="text" 
                                    className="figma-field-input" 
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                  />
                                )}
                                {field.type === 'email' && (
                                  <input 
                                    type="email" 
                                    className="figma-field-input" 
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                  />
                                )}
                                {field.type === 'select' && (
                                  <select className="figma-field-select">
                                    <option value="">Select {field.label.toLowerCase()}</option>
                                    {field.options?.map((option, optIndex) => (
                                      <option key={optIndex} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            ))}
                            
                            {/* Consent Checkbox */}
                            {config.settings.consentEnabled && (
                              <div className="figma-field figma-consent-field">
                                <label className="figma-checkbox-label">
                                  <input type="checkbox" className="figma-checkbox" />
                                  <span className="figma-consent-text">{config.settings.consentText}</span>
                                </label>
                              </div>
                            )}
                            
                            {/* Submit Button */}
                            <button 
                              className="figma-submit-button"
                              style={{ 
                                backgroundColor: config.branding.buttonColor,
                                color: config.branding.checkboxTextColor
                              }}
                            >
                              Claim POAP
                            </button>
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="figma-footer">
                          <div className="figma-powered-by">
                            <div className="figma-footer-logo">
                              <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                                <text x="0" y="16" fill="#fcfcfc" fontSize="12" fontFamily="system-ui">POAP STUDIO</text>
                              </svg>
                            </div>
                            <div className="figma-powered-text">
                              <span>Powered by </span>
                              <span style={{ fontWeight: 'bold' }}>POAP STUDIO</span>
                            </div>
                          </div>
                          <div className="figma-terms">
                            <p>{config.content.footerText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Loading Screen Content - Step by step */}
                {previewScreen === 'loading' && (
                  <>
                    {/* Status Bar Space */}
                    <div className="figma-status-space"></div>
                    
                    {/* Top Section - Same structure as form page */}
                    <div className="figma-top-section">
                      {/* Logo - Same as form page */}
                      {config.branding.logoUrl ? (
                        <div className="figma-logo">
                          <img src={config.branding.logoUrl} alt="Logo" className="figma-logo-img" />
                        </div>
                      ) : (
                        <div className="figma-logo">
                          <div style={{width: 150, height: 35, borderRadius: 8, background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                            <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500}}>LOGO</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Card Container - Exact same as form page */}
                      <div className="figma-card-wrapper">
                        <div style={{width: '100%', height: '100%', position: 'relative'}}>
                          <div style={{width: 303, height: 450, left: 0, top: 0, position: 'absolute', background: 'rgba(255, 255, 255, 0.05)', boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.10)', borderRadius: 16, border: '1px white solid', backdropFilter: 'blur(0px)'}} />
                          <div style={{width: 295, height: 442, left: 4, top: 4, position: 'absolute', background: 'linear-gradient(134deg, rgba(255, 255, 255, 0.20) 11%, rgba(255, 255, 255, 0.01) 28%, rgba(255, 255, 255, 0.01) 62%, rgba(255, 255, 255, 0.20) 83%)', borderRadius: 12, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: '-1px', backdropFilter: 'blur(25px)'}}>
                            <div style={{width: 295, height: 442, left: 0, top: 0, position: 'absolute', display: 'flex', flexDirection: 'column'}}>
                              <div style={{height: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 20, gap: 16}}>
                                <h2 style={{margin: 0, textAlign: 'center', color: config.branding.primaryColor, fontSize: 18, fontFamily: 'Arial', fontWeight: '600'}}>
                                  {config.content.congratulationsTitle}
                                </h2>
                                {config.content.poapImage ? (
                                  <img style={{width: 200, height: 200, borderRadius: '50%', objectFit: 'cover'}} src={config.content.poapImage} alt="POAP" />
                                ) : (
                                  <div style={{width: 200, height: 200, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12}}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="9" cy="9" r="2"/>
                                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg>
                                    <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, fontWeight: 500}}>POAP Image</span>
                                  </div>
                                )}
                              </div>
                              <div style={{height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px', gap: '12px'}}>
                                <h3 style={{margin: 0, textAlign: 'center', color: config.branding.primaryColor, fontSize: config.branding.titleFontSize, fontFamily: 'Arial', fontWeight: '600'}}>
                                  {config.content.poapTitle}
                                </h3>
                                <div className="simple-loader"></div>
                                <p style={{ color: config.branding.primaryColor, margin: 0, textAlign: 'center', fontSize: '12px', fontFamily: config.branding.fontFamily }}>
                                  {config.content.loadingText}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Success Screen Content - Clone from form page */}
                {previewScreen === 'success' && (
                  <>
                    {/* Status Bar Space */}
                    <div className="figma-status-space"></div>
                    
                    {/* Top Section - Exact Figma Layout */}
                    <div className="figma-top-section">
                      {/* Logo */}
                      {config.branding.logoUrl ? (
                        <div className="figma-logo">
                          <img src={config.branding.logoUrl} alt="Logo" className="figma-logo-img" />
                        </div>
                      ) : (
                        <div className="figma-logo">
                          <div style={{width: 150, height: 35, borderRadius: 8, background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                            <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500}}>LOGO</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Card Container */}
                      <div className="figma-card-wrapper">
                        <div style={{width: '100%', height: '100%', position: 'relative'}}>
                          <div style={{width: 303, height: 460, left: 0, top: 0, position: 'absolute', background: 'rgba(255, 255, 255, 0.05)', boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.10)', borderRadius: 16, border: '1px white solid', backdropFilter: 'blur(0px)'}} />
                          <div style={{width: 295, height: 76, left: 4, top: 380, position: 'absolute', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '0 0 12px 12px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', paddingLeft: 20, paddingBottom: 15}}>
                            <div style={{fontSize: 13, fontFamily: 'Arial', fontWeight: 'normal', color: config.branding.primaryColor, marginBottom: 2, lineHeight: 1}}>
                              OWNED BY
                            </div>
                            <div style={{fontSize: 20, fontFamily: 'Arial', fontWeight: 'bold', color: config.branding.primaryColor, lineHeight: 1}}>
                              JOHN DOE
                            </div>
                          </div>
                          <div style={{width: 295, height: 388, left: 4, top: 4, position: 'absolute', background: 'linear-gradient(134deg, rgba(255, 255, 255, 0.20) 11%, rgba(255, 255, 255, 0.01) 28%, rgba(255, 255, 255, 0.01) 62%, rgba(255, 255, 255, 0.20) 83%)', borderRadius: 12, outline: '1px rgba(255, 255, 255, 0.30) solid', outlineOffset: '-1px', backdropFilter: 'blur(25px)'}}>
                            <div style={{width: 295, height: 388, left: 0, top: 0, position: 'absolute', display: 'flex', flexDirection: 'column'}}>
                              <div style={{height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 20}}>
                                {config.content.poapImage ? (
                                  <img style={{width: 200, height: 200, borderRadius: '50%', objectFit: 'cover'}} src={config.content.poapImage} alt="POAP" />
                                ) : (
                                  <div style={{width: 200, height: 200, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12}}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="9" cy="9" r="2"/>
                                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg>
                                    <span style={{color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, fontWeight: 500}}>POAP Image</span>
                                  </div>
                                )}
                              </div>
                              <div style={{height: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px'}}>
                                <h3 style={{margin: 0, textAlign: 'center', color: config.branding.primaryColor, fontSize: config.branding.titleFontSize, fontFamily: 'Arial', fontWeight: '600'}}>
                                  {config.content.poapTitle}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* CTA Button below card */}
                      <div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
                        <button style={{
                          background: config.branding.buttonColor || '#3b82f6',
                          color: config.branding.checkboxTextColor || '#ffffff',
                          border: 'none',
                          borderRadius: 25,
                          padding: '12px 32px',
                          fontSize: 16,
                          fontWeight: '600',
                          fontFamily: 'Arial',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.2s ease'
                        }}>
                          {config.content.successCtaText}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
