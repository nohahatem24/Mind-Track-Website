
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";

interface LockScreenProps {
  onUnlock: (password: string) => void;
  passwordError: string;
}

const LockScreen = ({ onUnlock, passwordError }: LockScreenProps) => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUnlock = () => {
    onUnlock(password);
    setPassword('');
  };

  return (
    <section id="safe-box" className="py-16">
      <div className="mindtrack-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Digital Safe Box</h2>
          <p className="text-mindtrack-stone/80 max-w-2xl mb-6">
            A secure place to store your meaningful thoughts, memories, and notes.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mindtrack-card flex flex-col items-center justify-center py-10"
        >
          <Lock className="w-16 h-16 text-mindtrack-sage mb-6" />
          <h3 className="text-xl font-semibold text-mindtrack-stone mb-4">
            Your Digital Safe Box is Locked
          </h3>
          <p className="text-mindtrack-stone/80 mb-6 text-center max-w-md">
            Enter your password to access your secure notes and memories.
          </p>
          
          <div className="w-full max-w-xs space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-mindtrack-sage/30 rounded-md focus:outline-none focus:ring-2 focus:ring-mindtrack-sage/50"
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            
            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-mindtrack-sage text-white rounded-md hover:bg-mindtrack-sage/90 transition-colors"
            >
              Unlock Safe Box
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LockScreen;
