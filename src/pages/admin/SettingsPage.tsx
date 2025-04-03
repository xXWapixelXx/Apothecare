import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Lock,
  Bell,
  Mail,
  Globe,
  CreditCard,
  Shield,
  Save,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const sections: SettingsSection[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: User,
    description: 'Update your personal information and preferences',
  },
  {
    id: 'security',
    title: 'Security',
    icon: Lock,
    description: 'Manage your password and security settings',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you receive notifications',
  },
  {
    id: 'email',
    title: 'Email Settings',
    icon: Mail,
    description: 'Manage your email preferences and templates',
  },
  {
    id: 'website',
    title: 'Website Settings',
    icon: Globe,
    description: 'Configure your website appearance and behavior',
  },
  {
    id: 'payment',
    title: 'Payment Settings',
    icon: CreditCard,
    description: 'Manage payment methods and processing',
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    icon: Shield,
    description: 'Control your data and privacy settings',
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    storeName: 'ApotheCare',
    email: 'admin@apothecare.nl',
    phone: '+31 6 12345678',
    address: 'Amsterdam, Netherlands',
    currency: 'EUR',
    language: 'en',
    timezone: 'Europe/Amsterdam',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">
              System Settings
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <section.icon className={`w-5 h-5 ${
                activeSection === section.id ? 'text-emerald-600' : 'text-gray-400'
              }`} />
              <span className="text-sm font-medium">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {sections.find((s) => s.id === activeSection)?.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {sections.find((s) => s.id === activeSection)?.description}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="en">English</option>
                    <option value="nl">Dutch</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 