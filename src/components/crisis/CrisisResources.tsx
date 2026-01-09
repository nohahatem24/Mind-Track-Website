import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  MapPin,
  Users,
  BookOpen,
  Heart,
  ShieldAlert,
  X,
  ChevronDown,
  Globe,
  Search,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import {
  worldwideResources,
  countryResources,
  regions,
  getAllCountriesSorted,
  getCountriesByRegion,
  type CountryResource,
} from './crisisResourcesData';
import {
  detectUserLocation,
  saveLocationPreference,
  getStoredLocation,
  isValidCountryCode,
  getCountryCodeByName,
  type LocationDetectionResult,
} from './locationUtils';

interface HelplineButtonProps {
  helpline: {
    phone?: string;
    phone2?: string;
    text?: string;
    chat?: string;
    email?: string;
  };
}

const HelplineButtons: React.FC<HelplineButtonProps> = ({ helpline }) => {
  const { t } = useI18n();
  
  return (
    <div className="flex flex-wrap gap-2">
      {helpline.phone && (
        <a
          href={`tel:${helpline.phone.replace(/\D/g, '')}`}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          {t('crisis_resources.call')}
        </a>
      )}
      {helpline.phone2 && (
        <a
          href={`tel:${helpline.phone2.replace(/\D/g, '')}`}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          {t('crisis_resources.call_alt')}
        </a>
      )}
      {helpline.text && (
        <a
          href={`sms:${helpline.text}`}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {t('crisis_resources.text')}
        </a>
      )}
      {helpline.chat && (
        <a
          href={helpline.chat}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {t('crisis_resources.chat')}
        </a>
      )}
      {helpline.email && (
        <a
          href={`mailto:${helpline.email}`}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          {t('crisis_resources.email')}
        </a>
      )}
    </div>
  );
};

const CrisisResources: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t, isRTL } = useI18n();
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationDetectionResult | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [showCountrySearch, setShowCountrySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Detect user's location on mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const location = await detectUserLocation();
        setUserLocation(location);
        if (location.countryCode && isValidCountryCode(location.countryCode)) {
          setSelectedCountryCode(location.countryCode);
        }
      } catch (error) {
        console.error('Location detection error:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    if (isOpen) {
      detectLocation();
    }
  }, [isOpen]);

  const handleLocationChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    saveLocationPreference(countryCode);
    setShowCountrySearch(false);
    setSearchQuery('');
  };

  const allCountries = getAllCountriesSorted();
  const filteredCountries = allCountries.filter(
    (country) =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCountryResource = selectedCountryCode && isValidCountryCode(selectedCountryCode)
    ? countryResources[selectedCountryCode]
    : null;

  const immediateActions = [
    {
      label: currentCountryResource?.emergencyNumbers?.emergency || '911',
      action: `tel:${currentCountryResource?.emergencyNumbers?.emergency || '911'}`,
      description: 'Emergency services',
    },
  ];



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed inset-4 md:inset-20 bg-white rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[90vh] ${
              isRTL ? 'rtl' : 'ltr'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className={`sticky top-0 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-200 p-6 flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                <ShieldAlert className="w-8 h-8 text-rose-600" />
                <div className={isRTL ? 'text-right' : ''}>
                  <h1 className="text-3xl font-bold text-mindtrack-stone">
                    {t('crisis_resources.crisis_support_resources')}
                  </h1>
                  {!isLoadingLocation && userLocation && selectedCountryCode && (
                    <p className="text-sm text-mindtrack-stone/70 mt-1">
                      📍 {currentCountryResource?.emoji} {currentCountryResource?.country}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
                aria-label={t('crisis_resources.close_modal')}
                title={t('crisis_resources.close_modal')}
              >
                <X className="w-6 h-6 text-mindtrack-stone" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* LOCATION SELECTOR */}
              <section className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <h2 className={`text-lg font-bold text-mindtrack-stone mb-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {t('crisis_resources.select_country')}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setShowCountrySearch(!showCountrySearch)}
                    className={`w-full bg-white border border-blue-300 rounded-lg px-4 py-3 text-left flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between hover:bg-blue-50 transition-colors`}
                  >
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      {!isLoadingLocation && selectedCountryCode && isValidCountryCode(selectedCountryCode) ? (
                        <>
                          <span className="text-2xl">{countryResources[selectedCountryCode].emoji}</span>
                          <span className="font-semibold text-mindtrack-stone">
                            {countryResources[selectedCountryCode].country}
                          </span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="text-mindtrack-stone/70">
                            {isLoadingLocation ? t('crisis_resources.detecting_location') : t('crisis_resources.select_your_country')}
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${showCountrySearch ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Country Search Dropdown */}
                  <AnimatePresence>
                    {showCountrySearch && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full left-0 right-0 mt-2 bg-white border border-blue-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col ${isRTL ? 'rtl' : ''}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {/* Search Input */}
                        <div className="p-3 border-b border-blue-100 sticky top-0 bg-white">
                          <div className="relative">
                            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400`} />
                            <input
                              type="text"
                              placeholder={t('crisis_resources.search_placeholder')}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm`}
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Countries List */}
                        <div className="overflow-y-auto flex-1">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <button
                                key={country.countryCode}
                                onClick={() => handleLocationChange(country.countryCode)}
                                className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-100 last:border-b-0 ${
                                  selectedCountryCode === country.countryCode ? 'bg-blue-100' : ''
                                }`}
                              >
                                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                                  <span className="text-xl">{country.emoji}</span>
                                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                                    <p className="font-semibold text-mindtrack-stone text-sm">{country.country}</p>
                                    <p className="text-xs text-mindtrack-stone/60">{country.region}</p>
                                  </div>
                                  {selectedCountryCode === country.countryCode && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                  )}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-sm text-mindtrack-stone/60">
                              No countries found
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* IMMEDIATE EMERGENCY */}
              {selectedCountryCode && isValidCountryCode(selectedCountryCode) && (
                <section>
                  <h2 className={`text-2xl font-bold text-mindtrack-stone mb-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    {t('crisis_resources.immediate_help')}
                  </h2>
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                    <p className={`text-mindtrack-stone mb-4 ${isRTL ? 'text-right' : ''}`}>
                      {t('crisis_resources.find_help')}:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(currentCountryResource?.emergencyNumbers || {})
                        .filter(([_, value]) => value)
                        .map(([type, number]) => (
                          <a
                            key={type}
                            href={`tel:${number}`}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg"
                          >
                            {type === 'emergency' && '🆘 '}
                            {t('crisis_resources.call')} {number}
                          </a>
                        ))}
                    </div>
                  </div>
                </section>
              )}

              {/* WORLDWIDE RESOURCES */}
              <section>
                <h2 className={`text-2xl font-bold text-mindtrack-stone mb-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                  <Globe className="w-6 h-6 text-green-600" />
                  🌍 {t('crisis_resources.international_resources')}
                </h2>
                <div className="space-y-3">
                  {worldwideResources.map((resource) => (
                    <motion.div
                      key={resource.id}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-lg transition-shadow ${isRTL ? 'rtl' : ''}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <h3 className={`font-bold text-mindtrack-stone mb-2 ${isRTL ? 'text-right' : ''}`}>{resource.name}</h3>
                      <p className={`text-sm text-mindtrack-stone/70 mb-3 ${isRTL ? 'text-right' : ''}`}>{resource.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {resource.phone && (
                          <a
                            href={`tel:${resource.phone.replace(/\D/g, '')}`}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {resource.phone}
                          </a>
                        )}
                        {resource.text && (
                          <span className="text-xs text-mindtrack-stone/60 flex items-center self-center">
                            {t('crisis_resources.text')}: {resource.text}
                          </span>
                        )}
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            {t('crisis_resources.website')}
                          </a>
                        )}
                        {resource.email && (
                          <a
                            href={`mailto:${resource.email}`}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {t('crisis_resources.email')}
                          </a>
                        )}
                      </div>
                      <p className={`text-xs text-mindtrack-stone/60 mt-2 ${isRTL ? 'text-right' : ''}`}>
                        Languages: {resource.languages.join(', ')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* COUNTRY-SPECIFIC RESOURCES */}
              {selectedCountryCode && isValidCountryCode(selectedCountryCode) && (
                <section>
                  <h2 className={`text-2xl font-bold text-mindtrack-stone mb-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <Phone className="w-6 h-6 text-blue-600" />
                    {currentCountryResource?.emoji} {currentCountryResource?.country} {t('crisis_resources.emergency')}
                  </h2>
                  <div className="space-y-4">
                    {currentCountryResource?.helplines.map((helpline) => (
                      <motion.div
                        key={helpline.name}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-lg transition-shadow ${isRTL ? 'rtl' : ''}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <h3 className={`font-bold text-mindtrack-stone mb-1 ${isRTL ? 'text-right' : ''}`}>{helpline.name}</h3>
                        {helpline.arabicName && (
                          <p className={`text-sm text-mindtrack-stone/70 mb-1 ${isRTL ? 'text-right' : ''}`}>{helpline.arabicName}</p>
                        )}
                        <p className={`text-sm text-mindtrack-stone/70 mb-3 ${isRTL ? 'text-right' : ''}`}>
                          {helpline.arabicDescription || helpline.description}
                        </p>
                        <HelplineButtons helpline={helpline} />
                        <p className={`text-xs text-mindtrack-stone/60 mt-2 ${isRTL ? 'text-right' : ''}`}>
                          {t('crisis_resources.available')}: {helpline.available} | Languages: {helpline.languages?.join(', ')}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {currentCountryResource?.websiteResources && (
                    <div className="mt-6">
                      <h3 className={`text-xl font-bold text-mindtrack-stone mb-3 ${isRTL ? 'text-right' : ''}`}>{t('crisis_resources.website')}</h3>
                      <div className="space-y-2">
                        {currentCountryResource.websiteResources.map((resource) => (
                          <a
                            key={resource.name}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block bg-blue-50 border border-blue-200 rounded-lg p-3 hover:shadow-lg hover:border-blue-300 transition-all ${isRTL ? 'rtl text-right' : ''}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          >
                            <p className="font-semibold text-mindtrack-stone text-sm">{resource.name}</p>
                            <p className="text-xs text-mindtrack-stone/70">{resource.description}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* OTHER COUNTRIES BY REGION */}
              {selectedCountryCode && isValidCountryCode(selectedCountryCode) && (
                <section>
                  <h2 className={`text-2xl font-bold text-mindtrack-stone mb-4 ${isRTL ? 'text-right' : ''}`}>{t('crisis_resources.regional_resources')}</h2>
                  <div className="space-y-3">
                    {Object.entries(regions).map(([region, countryCodes]) => (
                      <motion.div
                        key={region}
                        className={`border border-gray-200 rounded-lg overflow-hidden ${isRTL ? 'rtl' : ''}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <button
                          onClick={() =>
                            setExpandedRegion(expandedRegion === region ? null : region)
                          }
                          className={`w-full bg-gray-50 hover:bg-gray-100 p-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between transition-colors`}
                        >
                          <h3 className={`font-semibold text-mindtrack-stone ${isRTL ? 'text-right' : ''}`}>{region}</h3>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              expandedRegion === region ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {expandedRegion === region && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white border-t border-gray-200 p-4 space-y-2"
                            >
                              {countryCodes.map((code) => (
                                <button
                                  key={code}
                                  onClick={() => handleLocationChange(code)}
                                  className={`w-full text-${isRTL ? 'right' : 'left'} px-4 py-2 rounded-lg transition-colors ${
                                    selectedCountryCode === code
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'hover:bg-gray-100 text-mindtrack-stone'
                                  }`}
                                >
                                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                                    <span className="text-lg">{countryResources[code].emoji}</span>
                                    <span className="font-medium">{countryResources[code].country}</span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* CAN'T FIND YOUR COUNTRY */}
              {selectedCountryCode && isValidCountryCode(selectedCountryCode) && (
                <section className={`bg-orange-50 border-2 border-orange-200 rounded-lg p-6 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <h3 className={`font-bold text-mindtrack-stone text-lg mb-3 ${isRTL ? 'text-right' : ''}`}>❓ Can't Find Your Country?</h3>
                  <p className={`text-mindtrack-stone/80 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    If your country isn't listed, please search online for local crisis resources using these
                    terms:
                  </p>
                  <div className={`bg-white rounded-lg p-4 space-y-2 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm text-mindtrack-stone">
                      • "[Your Country] suicide prevention hotline"
                    </p>
                    <p className="text-sm text-mindtrack-stone">
                      • "[Your Country] mental health crisis line"
                    </p>
                    <p className="text-sm text-mindtrack-stone">
                      • "[Your Country] emergency mental health services"
                    </p>
                  </div>
                  <p className={`text-sm text-mindtrack-stone/70 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    In your local language, search for crisis hotline, mental health support, or suicide prevention
                    terms.
                  </p>
                  <p className={`text-sm text-mindtrack-stone/60 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    Worldwide resources above are still available to you 24/7.
                  </p>
                </section>
              )}

              {/* YOU ARE NOT ALONE */}
              <section className={`bg-gradient-to-r from-mindtrack-stone/5 to-blue-50 border-2 border-mindtrack-stone/10 rounded-lg p-6 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className={`font-bold text-mindtrack-stone text-lg mb-3 ${isRTL ? 'text-right' : ''}`}>💙 You Are Not Alone</h3>
                <p className={`text-mindtrack-stone/80 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                  If you're experiencing a crisis, please reach out. Speaking with someone can help. Whether it's
                  a crisis helpline, a trusted friend, family member, or mental health professional, there are
                  people who care and want to help.
                </p>
                <p className={`text-mindtrack-stone/80 leading-relaxed mt-3 ${isRTL ? 'text-right' : ''}`}>
                  Your life has value. Your feelings matter. Help is available, and things can get better.
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CrisisResources;
