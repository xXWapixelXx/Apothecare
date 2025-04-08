import { motion } from 'framer-motion';
import { Heart, Shield, Users, Clock, Award, Leaf } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Zorg op maat',
      description: 'Persoonlijke aandacht en advies voor iedere klant.',
    },
    {
      icon: Shield,
      title: 'Betrouwbaarheid',
      description: 'Gecertificeerde producten en professionele service.',
    },
    {
      icon: Users,
      title: 'Expertise',
      description: 'Een team van ervaren apothekers en zorgprofessionals.',
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Altijd bereikbaar voor advies en ondersteuning.',
    },
    {
      icon: Award,
      title: 'Kwaliteit',
      description: 'Hoogwaardige producten van gerenommeerde merken.',
    },
    {
      icon: Leaf,
      title: 'Duurzaamheid',
      description: 'Milieubewuste keuzes in producten en verpakkingen.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 rounded-full blur-3xl animate-float-slow-reverse"></div>
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-300/30 to-cyan-300/30 rounded-full blur-3xl animate-float"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320B2AA' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.5
          }}></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-12 h-12 border-4 border-emerald-200/50 rounded-lg animate-float-slow transform rotate-45"></div>
          <div className="absolute top-40 right-40 w-8 h-8 border-4 border-teal-200/50 rounded-full animate-float"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border-4 border-cyan-200/50 rounded-lg animate-float-slow-reverse transform -rotate-12"></div>
          
          {/* Small decorative dots */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Content with backdrop blur */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Over{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  ApotheCare
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-200 to-teal-200 -rotate-1 rounded"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Uw vertrouwde partner in gezondheid en welzijn sinds 2020.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">Onze Missie</h2>
            <p className="text-lg text-gray-600">
              Bij ApotheCare streven we ernaar om hoogwaardige farmaceutische zorg toegankelijk te maken voor iedereen. 
              Met onze online apotheek combineren we het gemak van online winkelen met professioneel advies en persoonlijke aandacht.
            </p>
            <p className="text-lg text-gray-600">
              We geloven in een holistische benadering van gezondheid, waarbij we niet alleen medicijnen leveren, 
              maar ook advies geven over een gezonde levensstijl en preventieve zorg.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/pharmacy-team.jpg"
                alt="ApotheCare Team"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze Waarden</h2>
            <p className="text-lg text-gray-600">
              Deze kernwaarden vormen de basis van alles wat we doen bij ApotheCare.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  {value.icon && <value.icon className="w-6 h-6 text-emerald-600" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ons Team</h2>
          <p className="text-lg text-gray-600">
            Een toegewijd team van professionals staat voor u klaar.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Dr. Emma van der Berg',
              role: 'Hoofdapotheker',
              image: '/images/pharmacist-1.jpg',
            },
            {
              name: 'Thomas Groeneveld',
              role: 'Farmaceutisch Specialist',
              image: '/images/pharmacist-2.jpg',
            },
            {
              name: 'Sarah Jansen',
              role: 'Zorgconsulent',
              image: '/images/pharmacist-3.jpg',
            },
          ].map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Klaar om ApotheCare te ervaren?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Ontdek ons uitgebreide assortiment en profiteer van professioneel advies.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
            >
              Bekijk onze producten
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 