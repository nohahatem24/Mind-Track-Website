import React, { useState } from 'react';
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
} from 'lucide-react';

const CrisisResources: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const immediateActions = [
    { label: 'CALL 911', action: 'tel:911', description: 'Emergency services' },
    { label: 'TEXT 988', action: 'sms:988?body=HELLO', description: 'Crisis Text Line' },
  ];

  const usHelplines = [
    {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      text: '741741',
      description: 'Free, confidential support 24/7',
      available: '24/7',
    },
    {
      name: 'Crisis Text Line',
      phone: null,
      text: '741741',
      description: 'Text-based crisis support',
      available: '24/7',
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      text: null,
      description: 'Substance abuse & mental health treatment referral',
      available: '24/7',
    },
    {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-7233',
      text: 'START to 88788',
      description: 'Support for domestic violence survivors',
      available: '24/7',
    },
    {
      name: 'RAINN Sexual Assault Hotline',
      phone: '1-800-656-4673',
      text: 'HELLO to 234567',
      description: 'Support for sexual assault survivors',
      available: '24/7',
    },
  ];

  const therapistResources = [
    {
      name: 'Psychology Today Therapist Finder',
      url: 'https://www.psychologytoday.com/us/basics/therapy',
      description: 'Search licensed therapists by location and specialty',
    },
    {
      name: 'SAMHSA Treatment Locator',
      url: 'https://findtreatment.gov',
      description: 'Find mental health and substance abuse treatment facilities',
    },
    {
      name: 'Open Path Collective',
      url: 'https://www.openpathcollective.org',
      description: 'Affordable therapy starting at $30/session',
    },
  ];

  const additionalResources = [
    {
      name: 'NAMI (National Alliance on Mental Illness)',
      url: 'https://www.nami.org',
      description: 'Education, support groups, advocacy',
    },
    {
      name: 'Mental Health America',
      url: 'https://www.mhanational.org',
      description: 'Mental health screening and resources',
    },
    {
      name: 'The Jed Foundation',
      url: 'https://jedfoundation.org',
      description: 'Mental health support for young adults',
    },
  ];

  const copingTools = [
    {
      name: 'TIPP Technique',
      description: 'Temperature, Intense exercise, Paced breathing, Muscle relaxation',
      icon: 'Zap',
    },
    {
      name: '5-4-3-2-1 Grounding',
      description: 'Ground yourself in the present moment using your senses',
      icon: 'Eye',
    },
    {
      name: 'Urge Surfing',
      description: 'Ride the wave of intense emotions or urges',
      icon: 'Waves',
    },
    {
      name: 'Ice Dive',
      description: 'Use cold water to shift your physiological state',
      icon: 'Droplet',
    },
  ];

  const educationalTopics = [
    'Understanding Suicidal Thoughts',
    'Supporting Someone in Crisis',
    'When to Go to Emergency Room',
    'What to Expect from Crisis Line',
    'Building Your Safety Plan',
    'Self-Harm Alternatives',
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
            className="fixed inset-4 md:inset-20 bg-white rounded-xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
                <h1 className="text-3xl font-bold text-mindtrack-stone">
                  Crisis Support & Resources
                </h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
                aria-label="Close crisis resources modal"
                title="Close modal"
              >
                <X className="w-6 h-6 text-mindtrack-stone" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* IMMEDIATE CRISIS SECTION */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  If You're in Immediate Danger
                </h2>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                  <p className="text-mindtrack-stone mb-4">
                    If you believe you are in immediate danger or having a medical emergency:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {immediateActions.map((action) => (
                      <a
                        key={action.label}
                        href={action.action}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                </div>
              </section>

              {/* US CRISIS HELPLINES */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-blue-600" />
                  Crisis Helplines (USA)
                </h2>
                <div className="space-y-4">
                  {usHelplines.map((helpline) => (
                    <motion.div
                      key={helpline.name}
                      whileHover={{ scale: 1.02 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-bold text-mindtrack-stone text-lg mb-2">
                        {helpline.name}
                      </h3>
                      <p className="text-mindtrack-stone/70 mb-3">{helpline.description}</p>
                      <div className="flex flex-wrap gap-3">
                        {helpline.phone && (
                          <a
                            href={`tel:${helpline.phone}`}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call {helpline.phone}
                          </a>
                        )}
                        {helpline.text && (
                          <a
                            href={`sms:${helpline.text}?body=HELLO`}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Text {helpline.text}
                          </a>
                        )}
                        <span className="text-sm text-mindtrack-stone/60 flex items-center self-center">
                          Available: {helpline.available}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* IMMEDIATE COPING TOOLS */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-green-600" />
                  Immediate Coping Tools
                </h2>
                <p className="text-mindtrack-stone/70 mb-4">
                  Quick techniques to help regulate intense emotions right now:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {copingTools.map((tool) => (
                    <motion.div
                      key={tool.name}
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-bold text-mindtrack-stone mb-2">{tool.name}</h3>
                      <p className="text-sm text-mindtrack-stone/70">{tool.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FIND A THERAPIST */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Find a Therapist
                </h2>
                <div className="space-y-3">
                  {therapistResources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-lg hover:border-purple-300 transition-all"
                    >
                      <h3 className="font-bold text-mindtrack-stone mb-1">{resource.name}</h3>
                      <p className="text-sm text-mindtrack-stone/70 mb-2">{resource.description}</p>
                      <span className="text-xs text-purple-600 font-semibold">Visit Resource →</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* ADDITIONAL RESOURCES */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Additional Resources
                </h2>
                <div className="space-y-3">
                  {additionalResources.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:shadow-lg hover:border-indigo-300 transition-all"
                    >
                      <h3 className="font-bold text-mindtrack-stone mb-1">{resource.name}</h3>
                      <p className="text-sm text-mindtrack-stone/70 mb-2">{resource.description}</p>
                      <span className="text-xs text-indigo-600 font-semibold">Visit Resource →</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* EDUCATIONAL RESOURCES */}
              <section>
                <h2 className="text-2xl font-bold text-mindtrack-stone mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                  Education & Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {educationalTopics.map((topic) => (
                    <div
                      key={topic}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-mindtrack-stone">{topic}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLOSING MESSAGE */}
              <section className="bg-gradient-to-r from-mindtrack-stone/5 to-blue-50 border-2 border-mindtrack-stone/10 rounded-lg p-6">
                <h3 className="font-bold text-mindtrack-stone text-lg mb-3">
                  You Are Not Alone
                </h3>
                <p className="text-mindtrack-stone/80 leading-relaxed">
                  If you're experiencing a crisis, please reach out. Speaking with someone can help.
                  Whether it's a crisis helpline, a trusted friend, family member, or mental health
                  professional, there are people who care and want to help.
                </p>
                <p className="text-mindtrack-stone/80 leading-relaxed mt-3">
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
