      {/* Popular Categories */}
      <section className="py-24 relative overflow-hidden">
        {/* Hexagonal Grid Background */}
        <div className="absolute inset-0 bg-[url('/hexagon-grid.png')] opacity-5"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="relative inline-block">
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 blur"></span>
              <span className="relative inline-block px-6 py-3 bg-white rounded-lg font-medium text-emerald-600">
                Populaire Categorieën
              </span>
            </div>
            <h2 className="text-6xl font-bold mt-8 mb-6">
              <span className="relative inline-block">
                Ontdek{' '}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
              </span>{' '}
              <span className="relative inline-block">
                onze{' '}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-emerald-600"></div>
              </span>{' '}
              <span className="relative">
                wereld
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="relative block bg-white rounded-2xl p-1 transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-emerald-900/90 to-emerald-600/20"></div>
                    
                    {/* Category Icon with Glow Effect */}
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className={`relative p-3 rounded-xl ${category.bgColor} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          {category.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 text-xs font-medium text-emerald-100 bg-emerald-900/30 backdrop-blur-sm rounded-full">
                            {category.productCount} producten
                          </span>
                          <span className="px-3 py-1 text-xs font-medium text-emerald-100 bg-emerald-900/30 backdrop-blur-sm rounded-full">
                            {category.deliveryTime}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {category.description}
                        </p>
                        <div className="flex items-center text-emerald-200 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span>Ontdek meer</span>
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-40 -left-64 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-32 -right-64 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </section>

// ... rest of the code ... 